/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/app/models/User';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dbConnect from './db';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    await dbConnect()
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Create a new user if they don't exist
        user = await User.create({
          googleId: profile.id,
          email: profile.emails![0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          isEmailVerified: true,
          role: 'user'
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
