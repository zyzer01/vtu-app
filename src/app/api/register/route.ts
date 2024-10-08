import { sendEmail } from "@/app/mail/mail.service";
import User, { IUser } from "@/app/models/User";
import dbConnect from "@/lib/db";
import { calculateVerificationCodeExpiryTime, generateOTP, hashPassword } from "@/lib/utils/auth";
import { StringConstants } from "@/lib/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const body = await req.json();
        const userData: IUser = body;

        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            throw new Error(StringConstants.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await hashPassword(userData.password);

        const code = generateOTP();
        const codeExpiry = calculateVerificationCodeExpiryTime()

        const newUser = new User({ ...userData, password: hashedPassword, role: userData.role || 'user', emailVerificationCode: code, emailVerificationCodeExpiry: codeExpiry });

        await sendEmail({
            to: userData.email,
            subject: StringConstants.CONFIRM_EMAIL,
            template: 'confirm-email',
            params: { username: userData.firstName, code: code },
        });

        await newUser.save();

        const response = {
            message: StringConstants.REGISTRATION_SUCCESS,
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                isEmailVerified: newUser.isEmailVerified
            }
        };

        console.log('API Response:', JSON.stringify(response, null, 2));
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
