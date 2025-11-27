import { PROJECT_DESCRIPTION, PROJECT_NAME } from '@/shared/consts/common'
import '@workspace/ui/web.css'
import { Metadata } from 'next'
import localFont from 'next/font/local'
import { GsapProvider } from '@/shared/providers/GsapProvider'
import Scene from '@/features/home/canvas/scene/Scene'
import Loading from '@/shared/components/Loading'
import StarGalaxy from '@/features/home/canvas/scene/StarGalaxy'
import SceneCursor from '@/features/home/canvas/scene/SceneCursor'
import { getHomeContent } from '@/server/homeContent'

const ibmPlexSansCondensed = localFont({
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

const oswald = localFont({
    src: [
        {
            path: '../shared/fonts/Oswald-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../shared/fonts/Oswald-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
    ],
    variable: '--font-primary',
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const data = await getHomeContent()

    return (
        <html
            lang="en"
            translate="no"
            suppressHydrationWarning
            className={`${ibmPlexSansCondensed.variable} ${oswald.variable}`}
        >
            <head>
                <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </head>
            <body className="antialiased">
                <GsapProvider>
                    <Loading>{children}</Loading>
                    {/* {children} */}
                    <Scene data={data?.projects.projectList} />
                    <SceneCursor />
                    <StarGalaxy />
                </GsapProvider>
            </body>
        </html>
    )
}
