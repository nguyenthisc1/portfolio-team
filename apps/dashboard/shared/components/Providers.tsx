'use client'
import { ourFileRouter } from 'config/uploadthing'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { BsProvider } from '@workspace/ui/components/Provider'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { extractRouterConfig } from 'uploadthing/server'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
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
