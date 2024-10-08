// resend-verification-code route

import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import { sendEmail } from '@/app/mail/mail.service';
import { StringConstants } from '@/lib/utils/constants';
import dbConnect from '@/lib/db';
import { calculateVerificationCodeExpiryTime, generateOTP } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: StringConstants.USER_NOT_FOUND }, { status: 404 });
        }

        if (user.isEmailVerified) {
            return NextResponse.json({ error: StringConstants.EMAIL_ALREADY_VERIFIED }, { status: 400 });
        }

        const newVerificationCode = generateOTP();
        const newVerificationCodeExpiry = calculateVerificationCodeExpiryTime()

        user.emailVerificationCode = newVerificationCode;
        user.emailVerificationCodeExpiry = newVerificationCodeExpiry;

        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email',
            template: 'resend-code',
            params: { username: user.firstName, code: newVerificationCode },
        });

        return NextResponse.json({ message: StringConstants.VERIFICATION_CODE_SENT }, { status: 200 });
    } catch (error) {
        console.error('Resend verification code error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
