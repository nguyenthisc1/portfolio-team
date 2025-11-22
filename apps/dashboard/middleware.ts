import { auth } from 'auth'

export default auth((_req) => {
    // The authorized callback in auth/config.ts handles the redirect logic
    // When it returns false, NextAuth automatically redirects to the signIn page
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
