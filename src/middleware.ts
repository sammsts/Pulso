import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // private routes
    '/dashboard/:path*',
    '/historico/:path*',
    '/marcar-ponto/:path*',
    '/profile/:path*'
  ],
};
