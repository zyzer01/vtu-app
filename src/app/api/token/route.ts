import { getToken } from "next-auth/jwt";
import { generateToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, {status: 404});
  }

  const userToken = await generateToken({
    userId: token.sub,
    role: token.role,
  });

  return NextResponse.json({token: userToken}, {status: 200})
}
