'use client'

import { Button } from '@workspace/ui/components/Button'
import {
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from '@workspace/ui/components/Dialog'
import { toast } from '@workspace/ui/components/Sonner'
import { PlusCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImageUploadDialog } from 'shared/components/ImageUploadDialog'
import type { UploadedImage } from 'shared/utils/types'
import { copyToClipboard, estimateTotal, normalizeFiles } from 'shared/utils/utils'
import useSWR from 'swr'
import { ImagesTable } from './Table'

interface ImagesPageProps {}

interface ImagesSWRData {
    images: UploadedImage[]
    hasMore: boolean
    totalImages: number
}

const imagesFetcher =
    (imagesPerPage: number) =>
    async ([_key, offset]: [string, number]): Promise<ImagesSWRData> => {
        const response = await fetch(
            `/api/uploadthing/list?limit=${imagesPerPage}&offset=${offset}`,
            { cache: 'no-store' },
        )

        if (!response.ok) {
            throw new Error('Failed to fetch images')
        }

        const data = await response.json()
        const formatted = normalizeFiles(data.files || [])
        const hasMore = Boolean(data.hasMore)

        return {
            images: formatted,
            hasMore,
            totalImages: estimateTotal(formatted.length, offset, hasMore, imagesPerPage),
        }
    }

export default function ImagesPage() {
    const imagesPerPage = 10
    const searchParams = useSearchParams()

    // PAGE FROM URL
    const pageParam = searchParams.get('page')
    const page = pageParam ? parseInt(pageParam) : 1
    const offset = (page - 1) * imagesPerPage

    // LOCAL UI STATE (non-data)
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    // Fallback data state, set after client fetch
    const [fallbackData, setFallbackData] = useState<ImagesSWRData | undefined>(undefined)

    useEffect(() => {
        let cancelled = false

        const loadFallbackData = async () => {
            try {
                const response = await fetch(
                    `/api/uploadthing/list?limit=${imagesPerPage}&offset=${offset}`,
                    { cache: 'no-store' },
                )
                if (!response.ok) throw new Error('Failed to fetch images')
                const data = await response.json()
                const formatted = normalizeFiles(data.files || [])
                const hasMore = Boolean(data.hasMore)
                const totalImages = estimateTotal(formatted.length, offset, hasMore, imagesPerPage)
                if (!cancelled) {
                    setFallbackData({
                        images: formatted,
                        hasMore,
                        totalImages,
                    })
                }
            } catch {
                // ignore errors, fallbackData stays undefined
            }
        }

        loadFallbackData()
        return () => {
            cancelled = true
        }
    }, [imagesPerPage, offset])

    const { data, isLoading, mutate } = useSWR<ImagesSWRData>(
        ['images', offset],
        imagesFetcher(imagesPerPage),
        {
            fallbackData: fallbackData,
        },
    )

    const images = data?.images ?? []
    const hasMore = data?.hasMore ?? false
    const totalImages = data?.totalImages ?? 0

    // Upload → revalidate current page
    const handleUploadComplete = async () => {
        try {
            await mutate()
        } catch {
            toast.error({
                title: 'Failed to refresh images',
                description: 'Could not reload images after upload',
            })
        }
    }

    // Delete → call API then revalidate
    const deleteImage = async (key: string) => {
        try {
            const res = await fetch('/api/uploadthing/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
            })

            const data = await res.json()
            if (data.success) {
                toast.success({ title: 'Image deleted' })
                await mutate()
            } else {
                toast.error({ title: 'Delete failed' })
            }
        } catch {
            toast.error({ title: 'Delete failed' })
        }
    }

    const openImageDialog = (img: UploadedImage) => {
        setSelectedImage(img)
        setIsDialogOpen(true)
    }

    return (
        <>
            <div className="mb-4 flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Add Image</span>
                    </Button>
                </div>
            </div>

            <ImagesTable
                images={images}
                totalImages={totalImages}
                offset={offset}
                isLoading={isLoading}
                hasMore={hasMore}
                onDelete={deleteImage}
                onView={openImageDialog}
                onCopy={copyToClipboard}
            />

            <ImageUploadDialog
                isOpen={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onUploadComplete={handleUploadComplete}
            />

            {isDialogOpen && selectedImage && (
                <DialogOverlay isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedImage.name}</DialogTitle>
                        </DialogHeader>
                        {/* image content... */}
                    </DialogContent>
                </DialogOverlay>
            )}
        </>
    )
}
