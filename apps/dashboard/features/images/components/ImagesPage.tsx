'use client'

import { Button } from '@workspace/ui/components/Button'
import {
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from '@workspace/ui/components/Dialog'
import { toast } from '@workspace/ui/components/Sonner'
import { CopyIcon, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ImageUploadDialog } from 'shared/components/ImageUploadDialog'
import type { UploadedImage } from 'shared/utils/types'
import { normalizeFiles } from 'shared/utils/utils'
import { ImagesTable } from './Table'

interface ImagesPageProps {
    initialImages: UploadedImage[]
    initialHasMore: boolean
    initialOffset: number
}

function estimateTotal(
    pageLength: number,
    offsetValue: number,
    hasMoreValue: boolean,
    perPage: number,
) {
    const startIndex = Math.max(offsetValue - perPage, 0)
    const currentCount = startIndex + pageLength
    return hasMoreValue ? currentCount + perPage : currentCount
}

export default function ImagesPage({
    initialImages,
    initialHasMore,
    initialOffset,
}: ImagesPageProps) {
    const imagesPerPage = 10
    const [images, setImages] = useState<UploadedImage[]>(initialImages)
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [offset, setOffset] = useState(initialOffset)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [totalImages, setTotalImages] = useState(
        estimateTotal(initialImages.length, initialOffset, initialHasMore, imagesPerPage),
    )

    useEffect(() => {
        setImages(initialImages)
        setHasMore(initialHasMore)
        setOffset(initialOffset)
        setTotalImages(
            estimateTotal(initialImages.length, initialOffset, initialHasMore, imagesPerPage),
        )
    }, [initialImages, initialHasMore, initialOffset, imagesPerPage])

    // Use server-passed initialImages/hasMore/offset; fetchImages only for CRUD updates
    const fetchImages = useCallback(
        async (targetOffset: number) => {
            const currentOffset = Math.max(targetOffset - imagesPerPage, 0)
            setIsLoading(true)
            try {
                const response = await fetch(
                    `/api/uploadthing/list?limit=${imagesPerPage}&offset=${currentOffset}`,
                    { cache: 'no-store' },
                )

                if (!response.ok) {
                    throw new Error(`Failed to fetch images: ${response.statusText}`)
                }

                const data = await response.json()
                const files = Array.isArray(data.files) ? data.files : []
                const formattedImages = normalizeFiles(files)

                setImages(formattedImages)
                setHasMore(Boolean(data.hasMore))
                setTotalImages(
                    estimateTotal(
                        formattedImages.length,
                        targetOffset,
                        Boolean(data.hasMore),
                        imagesPerPage,
                    ),
                )
            } catch (error) {
                console.error('Error fetching images:', error)
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

    const handleUploadComplete = useCallback(
        async (_files: UploadedImage[]) => {
            await fetchImages(offset)
        },
        [fetchImages, offset],
    )

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        toast.success({
            title: 'Copied to clipboard',
            description: 'Image URL copied to clipboard',
        })
    }

    const deleteImage = async (key: string) => {
        try {
            const response = await fetch('/api/uploadthing/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key }),
            })

            if (response.ok) {
                const data = await response.json()
                if (data.success) {
                    toast.success({
                        title: 'Image deleted',
                        description: 'Image has been deleted successfully',
                    })
                    await fetchImages(offset)
                } else {
                    toast.error({
                        title: 'Delete failed',
                        description: 'Failed to delete image',
                    })
                }
            } else {
                const error = await response.json()
                toast.error({
                    title: 'Delete failed',
                    description: error.error || 'Failed to delete image',
                })
            }
        } catch (error) {
            console.error('Error deleting image:', error)
            toast.error({
                title: 'Delete failed',
                description: 'An error occurred while deleting the image',
            })
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const openImageDialog = (image: UploadedImage) => {
        setSelectedImage(image)
        setIsDialogOpen(true)
    }

    return (
        <>
            <div className="mb-4 flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={() => setIsUploadOpen(true)}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Image
                        </span>
                    </Button>
                </div>
            </div>

            <ImagesTable
                images={images}
                offset={offset}
                totalImages={totalImages}
                hasMore={hasMore}
                isLoading={isLoading}
                onDelete={deleteImage}
                onView={openImageDialog}
                onCopy={copyToClipboard}
            />

            {/* Upload Dialog - Now using shared component */}
            <ImageUploadDialog
                isOpen={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onUploadComplete={handleUploadComplete}
            />

            {/* Image Preview Dialog */}
            {isDialogOpen && selectedImage && (
                <DialogOverlay isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedImage.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">URL:</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(selectedImage.url)}
                                    >
                                        <CopyIcon className="mr-2 h-4 w-4" />
                                        Copy URL
                                    </Button>
                                </div>
                                <div className="bg-muted rounded-md p-3">
                                    <code className="text-xs break-all">{selectedImage.url}</code>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Size: {formatFileSize(selectedImage.size)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        Key: {selectedImage.key}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </DialogOverlay>
            )}
        </>
    )
}
