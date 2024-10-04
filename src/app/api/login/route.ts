import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/app/models/User";
import { LoginData, LoginResponse } from "@/types/user";
import { comparePasswords, generateToken } from "@/utils/auth";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const loginData: LoginData = await req.json();
    const { email, password } = loginData;

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      role: user.role
    });

    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    };

    const jsonResponse = NextResponse.json(response, { status: 200 });

    jsonResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return jsonResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
