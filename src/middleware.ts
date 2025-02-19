import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/utils/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const authPaths = ['/dashboard', '/admin'];
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isGoogleAuthCallback = request.nextUrl.pathname === '/api/auth/google/callback';

  // Allow Google OAuth callback to pass through
  if (isGoogleAuthCallback) {
    return NextResponse.next();
  }

  if (isAuthPath) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      
      const decoded = await verifyToken(token);
      console.log('Decoded Token:', decoded);
      
      if (request.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/auth/:path*'],
};
