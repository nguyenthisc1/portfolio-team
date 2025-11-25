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
import { useCallback, useEffect, useState } from 'react'
import { ImageUploadDialog } from 'shared/components/ImageUploadDialog'
import type { UploadedImage } from 'shared/utils/types'
import { copyToClipboard, estimateTotal, normalizeFiles } from 'shared/utils/utils'
import { ImagesTable } from './Table'

interface ImagesPageProps {
    initialImages: UploadedImage[]
    initialHasMore: boolean
}

export default function ImagesPage({ initialImages, initialHasMore }: ImagesPageProps) {
    const imagesPerPage = 10
    const searchParams = useSearchParams()

    /** PAGE FROM URL */
    const pageParam = searchParams.get('page')
    const page = pageParam ? parseInt(pageParam) : 1
    const offset = (page - 1) * imagesPerPage

    /** LOCAL STATES */
    const [images, setImages] = useState(initialImages)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    const [totalImages, setTotalImages] = useState(
        estimateTotal(initialImages.length, offset, initialHasMore, imagesPerPage),
    )

    /** 📌 Fetch images when page changes (but skip when page === 1 because server already gave initialImages) */
    const fetchImages = useCallback(
        async (requestedOffset: number) => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `/api/uploadthing/list?limit=${imagesPerPage}&offset=${requestedOffset}`,
                    { cache: 'no-store' },
                )

                if (!response.ok) throw new Error()

                const data = await response.json()
                const formatted = normalizeFiles(data.files || [])

                setImages(formatted)
                setHasMore(Boolean(data.hasMore))
                setTotalImages(
                    estimateTotal(
                        formatted.length,
                        requestedOffset,
                        Boolean(data.hasMore),
                        imagesPerPage,
                    ),
                )
            } catch (e) {
                toast.error({
                    title: 'Failed to load images',
                    description: 'Could not fetch images from server',
                })
            } finally {
                setIsLoading(false)
            }
        },
        [imagesPerPage],
    )

    /** 🔥 Main effect: only fetch if page != 1 */
    useEffect(() => {
        if (page !== 1) {
            fetchImages(offset)
        } else {
            // Page 1 = use initialImages
            setImages(initialImages)
            setHasMore(initialHasMore)
            setTotalImages(
                estimateTotal(initialImages.length, offset, initialHasMore, imagesPerPage),
            )
        }
    }, [page, offset, fetchImages, initialImages, initialHasMore])

    /** Upload → refresh page */
    const handleUploadComplete = async () => {
        await fetchImages(offset)
    }

    /** Delete → refresh page */
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
                await fetchImages(offset)
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
