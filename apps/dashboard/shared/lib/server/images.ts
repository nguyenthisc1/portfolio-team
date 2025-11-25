import { ImagesResponse } from 'shared/utils/types'
import { normalizeFiles, resolveBaseUrl } from 'shared/utils/utils'

export async function getImages({ limit, offset }: { limit: number; offset: number }) {
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
