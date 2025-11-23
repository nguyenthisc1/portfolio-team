import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const username = process.env.AUTH_USERNAME
                const password = process.env.AUTH_PASSWORD

                if (!username || !password) {
                    console.error(
                        'AUTH_USERNAME and AUTH_PASSWORD must be set in environment variables',
                    )
                    return null
                }

                if (credentials?.username === username && credentials?.password === password) {
                    return { id: '1', name: 'Admin' }
                }
                return null
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        authorized({ auth, request }) {
            const { pathname } = request.nextUrl
            const isLoggedIn = !!auth?.user

            // Allow access to login page and API routes
            if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
                return true
            }

            // Require authentication for all other routes
            if (!isLoggedIn) {
                return false // This will trigger redirect to /login
            }

            return true
        },
        redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
} satisfies NextAuthConfig
