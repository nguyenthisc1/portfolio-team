import HomePage from '@/features/home/components/HomePage'
import HomeStoreHydrator from '@/features/home/components/HomeStoreHydrator'
import { getHomeContent } from '@/server/homeContent'

export default async function Home() {
    const data = await getHomeContent()

    return (
        <>
            <HomeStoreHydrator data={data} />
            {data && <HomePage data={data} />}
        </>
    )
}
