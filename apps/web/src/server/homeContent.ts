import { unstable_cache } from 'next/cache'

import { getCollection } from '@/shared/lib/mongodb'
import { HomePageData } from 'types'

export const getHomeContent = unstable_cache(
    async () => {
        const col = await getCollection<HomePageData>('home_content')
        return col.findOne()
    },
    ['home-content'],
    {
        tags: ['home-content'],
    },
)
