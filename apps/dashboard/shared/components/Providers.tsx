'use client'
import { BsProvider } from '@workspace/ui/components/Provider'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <BsProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                    enableColorScheme
                >
                    {children}
                </ThemeProvider>
            </BsProvider>
        </SessionProvider>
    )
}
