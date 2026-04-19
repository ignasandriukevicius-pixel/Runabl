import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user and trying to access protected route, redirect to login
  if (!user && pathname !== '/login' && pathname !== '/signup') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes
    '/athlete/:path*',
    '/coach/:path*',
    '/welcome/:path*',
    // Exclude api routes, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
