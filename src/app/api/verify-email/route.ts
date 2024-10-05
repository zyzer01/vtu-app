import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import { sendEmail } from '@/app/mail/mail.service';
import { StringConstants } from '@/utils/constants';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const { code } = await req.json();
    
    const user = await User.findOne({
      emailVerificationCode: code,
      emailVerificationCodeExpiry: { $gt: new Date() }
    });
    console.log(user)


    if (!user) {
      return NextResponse.json({ error: StringConstants.INVALID_EXPIRED_TOKEN }, { status: 400 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: StringConstants.EMAIL_ALREADY_VERIFIED }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpiry = null;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Welcome to VTU Platform',
      template: 'welcome',
      params: { firstName: user.firstName },
    });

    return NextResponse.json({ message: StringConstants.EMAIL_VERIFICATION_SUCCESS }, { status: 200 });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
