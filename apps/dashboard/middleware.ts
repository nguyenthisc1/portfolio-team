import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isProtectedPath = protectedPaths.some((prefix) => path.startsWith(prefix))

    if (isProtectedPath) {
        const token = (await cookies()).get('authjs.session-token')
        if (!token) {
            const url = new URL('/', request.url)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next|static|favicon.ico|sitemap.xml).*)'],
    runtime: 'nodejs',
}
