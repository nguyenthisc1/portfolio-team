import { PROJECT_DESCRIPTION, PROJECT_NAME } from '@/shared/consts/common'
import '@workspace/ui/web.css'
import { Metadata } from 'next'
import { GsapProvider } from '@/shared/components/GsapProvider'
import localFont from 'next/font/local'

const ibmPlexSansCondensedBoldItalic = localFont({
    src: '../shared/fonts/IBMPlexSansCondensed-BoldItalic.ttf',
    display: 'swap',
    variable: '--font-ibm-plex-sans-condensed-bold-italic',
    weight: '700',
    style: 'italic',
})

export const metadata: Metadata = {
    title: {
        default: PROJECT_NAME,
        template: `%s | ${PROJECT_NAME}`,
    },
    description: PROJECT_DESCRIPTION,
    openGraph: {
        title: PROJECT_DESCRIPTION,
        description: PROJECT_DESCRIPTION,
        siteName: PROJECT_NAME,
    },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
    return (
        <html lang="en" translate="no" suppressHydrationWarning className={ibmPlexSansCondensedBoldItalic.className}>
            <head>
                <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </head>
            <body className="antialiased ">
                <GsapProvider>{children}</GsapProvider>
            </body>
        </html>
    )
}
