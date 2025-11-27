'use server'

import { getCollection } from '@/shared/lib/mongodb'
import { Metadata } from 'next'
import { HomePageData } from 'types'

export async function getHomeContent(): Promise<HomePageData | null> {
    const col = await getCollection<HomePageData>('home_content')
    const data = await col.findOne()
    return data
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getHomeContent()
    return {
        title: data?.seo?.title || 'Home',
        description: data?.seo?.description || '',
        ...(data?.seo?.keywords && { keywords: data.seo.keywords }),
        openGraph: {
            images: data?.seo?.image ? [data.seo.image] : [],
            title: data?.seo?.title || 'Home',
            description: data?.seo?.description || '',
        },
        twitter: {
            card: 'summary_large_image',
            title: data?.seo?.title || 'Home',
            description: data?.seo?.description || '',
            images: data?.seo?.image ? [data.seo.image] : [],
        },
    }
}
