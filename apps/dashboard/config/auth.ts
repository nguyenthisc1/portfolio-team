import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const username = (credentials?.username as string | undefined)?.trim()
                const password = credentials?.password as string | undefined

                if (!username || !password) {
                    return null
                }

                const [{ connectDB }, { UserModel }, { compare }] = await Promise.all([
                    import('../shared/lib/mongodb'),
                    import('../shared/models/User'),
                    import('bcryptjs'),
                ])

                await connectDB()
                const user = await UserModel.findOne({ username })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(String(password), String(user.passwordHash))
                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user._id.toString(),
                    name: user.name ?? user.username,
                }
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt' as const,
    },

    callbacks: {
        authorized({ auth, request }: { auth: any; request: { nextUrl: { pathname: string } } }) {
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
    },
}
