import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './app/api/auth/[...nextauth]/route';

// Custom middleware for authentication and role-based access control
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Get token from cookies (NextAuth.js session token)
  const authCookie = req.cookies.get('next-auth.session-token')?.value || 
                     req.cookies.get('__Secure-next-auth.session-token')?.value;
  
  const isAdminPanel = pathname.startsWith('/admin');
  const isApiAdminRoute = pathname.startsWith('/api/admin');
  const isAdminUserRoute = pathname.startsWith('/api/admin/users');
  const isProtectedApiRoute = pathname.startsWith('/api/posts/create') || 
                              pathname.includes('/edit') || 
                              pathname.includes('/delete');
  
  // If no auth cookie and trying to access protected route, redirect to login
  if (!authCookie && (isAdminPanel || isApiAdminRoute || isProtectedApiRoute)) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  // For API routes that require specific roles, we will check the session in each API handler
  // For admin UI routes, we'll verify the role in the page component

  return NextResponse.next();
}

// Specify which paths should be protected by the middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/posts/create',
    '/api/posts/:path*',
  ],
};
