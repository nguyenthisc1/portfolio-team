import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Types for session and JWT user extension (used inside callbacks)
type UserWithCustomFields = {
    id?: string
    name: string
    email?: string
    username: string
    role: string
}

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'admin' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const [{ compare }, { connectDB }, { UserModel }] = await Promise.all([
                    import('bcryptjs'),
                    import('shared/lib/mongodb'),
                    import('shared/models/User'),
                ])

                await connectDB()

                // Find user by username
                const userDoc = await UserModel.findOne({
                    username: credentials.username,
                }).exec()

                if (!userDoc) {
                    return null
                }

                // Compare provided password with stored hash using edge-compatible bcrypt
                const passwordMatch = await compare(
                    credentials.password.toString(),
                    userDoc.passwordHash,
                )

                if (!passwordMatch) {
                    return null
                }

                // Return minimal user for session/JWT
                // Add id for consistency
                return {
                    id: userDoc._id?.toString?.() ?? undefined,
                    name: userDoc.name ?? userDoc.username,
                    email: undefined, // not using email
                    username: userDoc.username,
                    role: userDoc.role,
                } as UserWithCustomFields
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 1 day
    },
    callbacks: {
        async jwt({ token, user }) {
            // Runs at sign in, then for subsequent JWT checks
            if (user) {
                // Copy fields from user into token
                // Type assertion because user can be User or AdapterUser
                const u = user as UserWithCustomFields
                if (u.id) {
                    token.sub = u.id
                }
                token.username = u.username
                token.name = u.name
                token.role = u.role
            }
            return token
        },
        async session({ session, token }) {
            // Populates session.user with info from token
            if (token) {
                // Extend session.user safely
                session.user = {
                    // keep non-custom fields
                    ...session.user,
                    name: token.name as string,
                    id: (token.sub ?? '') as string,
                    username: token.username as string,
                    role: token.role as string,
                } as typeof session.user & {
                    id: string
                    username: string
                    role: string
                }
            }
            return session
        },
    },
}

export const { handlers, auth, signOut } = NextAuth(authConfig)
