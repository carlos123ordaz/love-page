import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // 1. Remove trailing slash (except root "/")
    if (pathname !== '/' && pathname.endsWith('/')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(0, -1);
        return NextResponse.redirect(url, 301);
    }

    // 2. Force lowercase URLs for public pages
    if (pathname.startsWith('/p/') && pathname !== pathname.toLowerCase()) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.toLowerCase();
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    // Match all routes except static files, api routes, and _next
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|audio|images|og-image).*)',
    ],
};