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

export const generateMetadata = async () => {
    const data = await getHomeContent()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-team-web.vercel.app/'

    if (!data || !data.seo) {
        return {
            title: '',
            description: '',
            keywords: [],
            openGraph: {
                title: '',
                description: '',
                images: [],
            },
        }
    }

    return {
        metadataBase: new URL(baseUrl),
        title: data.seo.title ?? '',
        description: data.seo.description ?? '',
        keywords: data.seo.keywords ?? [],
        authors: [{ name: 'Portfolio Team' }],
        creator: 'Portfolio Team',
        publisher: 'Portfolio Team',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: baseUrl,
            title: data.seo.title ?? '',
            description: data.seo.description ?? '',
            siteName: data.seo.title ?? '',
            images: data.seo.image
                ? [
                      {
                          url: data.seo.image,
                          width: 1200,
                          height: 630,
                          alt: data.seo.title ?? '',
                      },
                  ]
                : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.seo.title ?? '',
            description: data.seo.description ?? '',
            images: data.seo.image ? [data.seo.image] : [],
        },
        verification: {
            // Add your verification tokens here when you have them
            // google: 'your-google-verification-token',
            // yandex: 'your-yandex-verification-token',
            // bing: 'your-bing-verification-token',
        },
    }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const data = await getHomeContent()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-team-web.vercel.app/'

    // Generate JSON-LD structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data?.seo?.title ?? '',
        description: data?.seo?.description ?? '',
        url: baseUrl,
        author: {
            '@type': 'Organization',
            name: 'Portfolio Team',
            url: baseUrl,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/?s={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    // Person/Team structured data
    const organizationJsonLd = data?.about?.teamMembers
        ? {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: data.about.title ?? 'Our Team',
              description: data.about.description ?? '',
              url: baseUrl,
              member: data.about.teamMembers.map((member) => ({
                  '@type': 'Person',
                  name: member.name,
                  jobTitle: member.position,
                  image: member.image,
              })),
          }
        : null

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
                <link rel="canonical" href={baseUrl} />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {organizationJsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                    />
                )}
            </head>
            <body className="antialiased">
                <GsapProvider>
                    <Loading data={data}>{children}</Loading>
                    <Scene data={data?.projects?.projectList} />
                    <SceneCursor />
                    <StarGalaxy />
                    <SoundBar />
                </GsapProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
