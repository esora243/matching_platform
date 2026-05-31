import { NextResponse, type NextRequest } from 'next/server';
import { DUMMY_ROLE_COOKIE, VALID_ROLES } from '@/lib/roles';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const role = req.cookies.get(DUMMY_ROLE_COOKIE)?.value;
  if (!role || !(VALID_ROLES as string[]).includes(role)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
