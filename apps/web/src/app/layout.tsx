import { PROJECT_DESCRIPTION, PROJECT_NAME } from '@/shared/consts/common'
import '@workspace/ui/web.css'
import { Metadata } from 'next'
import { GsapProvider } from '@/shared/components/GsapProvider'
import localFont from 'next/font/local'
import CanvasScene from '@/shared/components/scene/CanvasScene'

const ibmPlexSansCondensedBoldItalic = localFont({
    src: [
        {
            path: '../shared/fonts/IBMPlexSansCondensed-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../shared/fonts/IBMPlexSansCondensed-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-primary',
})

const archivoCondensed = localFont({
    src: [
        {
            path: '../shared/fonts/Archivo_Condensed-Black.ttf',
            style: 'normal',
            weight: '800',
        },
        {
            path: '../shared/fonts/Archivo_Condensed-ExtraBold.ttf',
            style: 'normal',
            weight: '900',
        },
    ],
    variable: '--font-secondary',
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
        <html
            lang="en"
            translate="no"
            suppressHydrationWarning
            className={`${ibmPlexSansCondensedBoldItalic.variable} ${archivoCondensed.variable}`}
        >
            <head>
                <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </head>
            <body className="antialiased ">
                <GsapProvider>
                    {children}
                    <CanvasScene />
                </GsapProvider>
            </body>
        </html>
    )
}
