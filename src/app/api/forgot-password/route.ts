import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import { sendEmail } from '@/app/mail/mail.service';
import { StringConstants } from '@/utils/constants';
import dbConnect from '@/lib/db';
import { calculateVerificationCodeExpiryTime, generateVerificationCode } from '@/utils/auth';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: StringConstants.USER_NOT_FOUND }, { status: 404 });
        }

        const resetToken = generateVerificationCode();
        const resetTokenExpiry = calculateVerificationCodeExpiryTime()

        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpiry = resetTokenExpiry

        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Reset your password',
            template: 'forgot-password',
            params: { username: user.firstName, code: resetToken },
        });

        return NextResponse.json({ message: StringConstants.FORGOT_PASSWORD }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
