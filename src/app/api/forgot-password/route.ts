import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import { sendEmail } from '@/app/mail/mail.service';
import { StringConstants } from '@/lib/utils/constants';
import dbConnect from '@/lib/db';
import { calculateVerificationCodeExpiryTime, generateVerificationCode } from '@/lib/utils/auth';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: StringConstants.USER_NOT_FOUND }, { status: 404 });
        }

        const now = new Date().getTime();

        if (user.lastResetRequestTime && (now - user.lastResetRequestTime) < FIVE_MINUTES_MS) {
            const waitTimeMinutes = Math.ceil((FIVE_MINUTES_MS - (now - user.lastResetRequestTime)) / 60000);
            return NextResponse.json({ 
                error: `Please wait for ${waitTimeMinutes} minute${waitTimeMinutes > 1 ? 's' : ''} before requesting a new link.` 
            }, { status: 429 });
        }

        const resetToken = generateVerificationCode();
        const resetTokenExpiry = calculateVerificationCodeExpiryTime();

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = resetTokenExpiry;
        user.lastResetRequestTime = now;

        await user.save();

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Reset your password',
            template: 'forgot-password',
            params: { username: user.firstName, resetLink },
        });

        return NextResponse.json({ message: StringConstants.PASSWORD_RESET_LINK_SENT }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
