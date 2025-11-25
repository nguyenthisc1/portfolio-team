import ImagesPage from 'features/images/components/ImagesPage'
import { getImages } from 'shared/lib/server/images'

export default async function Page(props: {
    searchParams: Promise<Record<string, string | string[]>>
}) {
    const searchParams = await props.searchParams

    const page = searchParams.page ? Number(searchParams.page) : 1
    const imagesPerPage = 10
    const offset = (page - 1) * imagesPerPage

    const { images, hasMore } = await getImages({
        limit: imagesPerPage,
        offset,
    })

    return <ImagesPage initialImages={images} initialHasMore={hasMore} />
}
export const dynamic = 'force-dynamic'
