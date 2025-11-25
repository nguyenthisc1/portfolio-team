import ImagesPage from 'features/images/components/ImagesPage'
import { Suspense } from 'react'
import { ImagesResponse } from 'shared/utils/types'
import { normalizeFiles, resolveBaseUrl } from 'shared/utils/utils'

async function fetchImages(limit: number, offset: number) {
    const baseUrl = resolveBaseUrl()

    try {
        const response = await fetch(
            `${baseUrl}/api/uploadthing/list?limit=${limit}&offset=${offset}`,
            {
                cache: 'no-store',
            },
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.statusText}`)
        }

        const data: ImagesResponse = await response.json()
        const rawFiles = Array.isArray(data.files) ? data.files : []
        const images = normalizeFiles(rawFiles)
        const hasMore = images.length === limit

        return { images, hasMore }
    } catch (error) {
        console.error('Error fetching images on the server:', error)
        return { images: [], hasMore: false }
    }
}

export default async function ImagesRoute({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const imagesPerPage = 10
    const rawOffset = searchParams?.offset
    const offset = Array.isArray(rawOffset)
        ? parseInt(rawOffset[0] ?? `${imagesPerPage}`, 10)
        : parseInt(rawOffset ?? `${imagesPerPage}`, 10)
    const resolvedOffset = Number.isFinite(offset) ? offset : imagesPerPage
    const currentOffset = Math.max(resolvedOffset - imagesPerPage, 0)

    const { images, hasMore } = await fetchImages(imagesPerPage, currentOffset)

    return (
        <Suspense
            fallback={<div className="text-muted-foreground p-4 text-sm">Loading images...</div>}
        >
            <ImagesPage
                initialImages={images}
                initialHasMore={hasMore}
                initialOffset={resolvedOffset}
            />
        </Suspense>
    )
}

export const dynamic = 'force-dynamic'
