/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const authPaths = ['/dashboard', '/admin'];
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isAuthPath) {
    // Check for custom token
    const customToken = request.cookies.get('token')?.value;
    
    // Check for NextAuth session
    const nextAuthToken = await getToken({ req: request as any });

    if (!customToken && !nextAuthToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    let userId: string | undefined;
    let userRole: string | undefined;

    if (customToken) {
      try {
        const decoded = await verifyToken(customToken);
        userId = decoded.userId;
        userRole = decoded.role;
      } catch (error) {
        console.error('Error verifying custom token:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } else if (nextAuthToken) {
      userId = nextAuthToken.sub; // NextAuth uses 'sub' for user ID
      userRole = nextAuthToken.role as string;
    }

    if (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const requestHeaders = new Headers(request.headers);
    if (userId) requestHeaders.set('x-user-id', userId);
    if (userRole) requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
