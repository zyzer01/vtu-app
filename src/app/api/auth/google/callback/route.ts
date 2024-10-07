import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '@/utils/auth';
import User from '@/app/models/User';
import dbConnect from '@/lib/db';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
);

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      console.error('No code received from Google');
      return NextResponse.redirect('/auth/login?error=NoCode');
    }

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No payload in ID token');
    }

    const { email, sub: googleId, given_name, family_name } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        firstName: given_name,
        lastName: family_name,
        isEmailVerified: true,
        role: 'user'
      });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      role: user.role
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.redirect('/auth/login?error=GoogleAuthFailed');
  }
}
