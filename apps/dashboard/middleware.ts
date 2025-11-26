import { auth } from 'config/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth?.user
    const path = req.nextUrl.pathname

    if (path === '/login') return NextResponse.next()

    if (!isLoggedIn && path === '/') {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!_next|api|login|.*\\..*).*)'],
    runtime: 'nodejs',
}
