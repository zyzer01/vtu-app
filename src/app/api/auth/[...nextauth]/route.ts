/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";
import { generateToken } from "@/utils/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
    token?: string;
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await dbConnect();

        let dbUser = await User.findOne({ email: profile.email });
        let isNewUser = false;

        if (!dbUser) {
          const fullName = profile.name || "";
          const [firstName, lastName] = fullName.split(" ");

          dbUser = new User({
            email: profile.email,
            firstName: firstName || "",
            lastName: lastName || "",
            role: "user",
            isEmailVerified: true,
            oauthProvider: "google",
          });

          await dbUser.save();
          isNewUser = true;
        }

        const token = await generateToken({
          userId: dbUser._id.toString(),
          role: dbUser.role
        });

        (user as any).id = dbUser._id.toString();
        (user as any).role = dbUser.role;
        (user as any).token = token;
        (user as any).isNewUser = isNewUser;

        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.token = (user as any).token;
        token.isNewUser = (user as any).isNewUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.token = token.token as string;
        (session as any).isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
