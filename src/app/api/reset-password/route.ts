import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import { sendEmail } from '@/app/mail/mail.service';
import { StringConstants } from '@/utils/constants';
import dbConnect from '@/lib/db';
import { hashPassword } from '@/utils/auth';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Missing token or new password' }, { status: 400 });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            const expiredUser = await User.findOne({ resetPasswordToken: token });
            if (expiredUser) {
                console.log('Token expired for user:', expiredUser.email);
                return NextResponse.json({ error: StringConstants.EXPIRED_TOKEN }, { status: 400 });
            } else {
                console.log('No user found with this token');
                return NextResponse.json({ error: StringConstants.INVALID_TOKEN }, { status: 400 });
            }
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;

        await user.save();

        await sendEmail({
            to: user.email,
            subject: 'Password Changed Successfully',
            template: 'changed-password',
            params: { firstName: user.firstName },
        });

        return NextResponse.json({ message: StringConstants.PASSWORD_RESET_SUCCESSFUL }, { status: 200 });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
