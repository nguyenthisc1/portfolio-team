import Scene from '@/features/home/canvas/scene/Scene'
import SceneCursor from '@/features/home/canvas/scene/SceneCursor'
import StarGalaxy from '@/features/home/canvas/scene/StarGalaxy'
import { getHomeContent } from '@/server/homeContent'
import Loading from '@/shared/components/Loading'
import SoundBar from '@/shared/components/SoundBar'
import { GsapProvider } from '@/shared/providers/GsapProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@workspace/ui/web.css'
import localFont from 'next/font/local'

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const data = await getHomeContent()

    const seo = data?.seo || {
        title: 'Creative Website Developer - Smart & Purposeful Web Design',
        description:
            'Portfolio of a creative designer and developer specializing in smart, business-driving websites, digital products, and unique design solutions.',
        image: 'https://utfs.io/f/cuH9KLr6qOUNDavvj3BLWxFcPRGoIYwn59T2fgMyJQEiUS7O',
        keywords: [
            'website developer',
            'creative designer',
            'web development',
            'digital products',
            'portfolio',
            'business growth',
            'design solutions',
        ],
    }
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
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords?.join(', ')} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:image" content={seo.image} />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.image} />
            </head>
            <body className="antialiased">
                <GsapProvider>
                    <Loading>{children}</Loading>
                    <Scene data={data?.projects.projectList} />
                    <SceneCursor />
                    <StarGalaxy />
                    <SoundBar />
                </GsapProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
