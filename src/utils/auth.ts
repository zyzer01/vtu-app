import { saltRounds, verificationCodeExpiry } from "@/config";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);


export const hashPassword = (password: string) => bcrypt.hash(password, saltRounds)

export const generateVerificationCode = (): string => crypto.randomBytes(3).toString('hex')

export const calculateVerificationCodeExpiryTime = () => {
    return new Date(Date.now() + verificationCodeExpiry);
};

export const comparePasswords = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(inputPassword, hashedPassword);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateToken(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(JWT_SECRET);
}
export const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyToken(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
}
