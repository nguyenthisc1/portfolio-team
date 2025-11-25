'use client'

import { ImageUploadDialog } from '@/shared/components/ImageUploadDialog'
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
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImagesTable } from './Table'

interface UploadedImage {
    url: string
    name: string
    key: string
    size: number
}

export default function ImagesPage() {
    const searchParams = useSearchParams()
    const offsetParam = searchParams.get('offset')
    const initialOffset = offsetParam ? parseInt(offsetParam, 10) : 10

    const [images, setImages] = useState<UploadedImage[]>([])
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [offset, setOffset] = useState(initialOffset)
    const [isLoading, setIsLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)
    const [totalImages, setTotalImages] = useState(0)

    useEffect(() => {
        setOffset(initialOffset)
    }, [initialOffset])

    const imagesPerPage = 10

    // Fetch images from API with server-side pagination
    const fetchImages = async (currentOffset: number) => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `/api/uploadthing/list?limit=${imagesPerPage}&offset=${currentOffset}`,
            )
            if (response.ok) {
                const data = await response.json()
                // Handle the response structure from our API
                const files = Array.isArray(data.files) ? data.files : []

                // Transform the response to match our UploadedImage interface
                // According to UploadThing API, files have: key, name, size, url (or ufsUrl)
                const formattedImages: UploadedImage[] = files
                    .filter((file: any) => file && (file.url || file.ufsUrl || file.key)) // Include files with URL or key
                    .map((file: any) => {
                        // UploadThing files may have url, ufsUrl, or we construct from key
                        const url =
                            file.url ||
                            file.ufsUrl ||
                            (file.key ? `https://utfs.io/f/${file.key}` : '')
                        // Extract filename from key if name is not available
                        const name =
                            file.name ||
                            (file.key
                                ? file.key.split('_').pop()?.split('/').pop() || 'Untitled'
                                : 'Untitled')
                        return {
                            url,
                            name,
                            key: file.key || file.id || '',
                            size: file.size || 0,
                        }
                    })

                setImages(formattedImages)
                setHasMore(data.hasMore || false)
                // For total, we'll estimate based on hasMore or use a separate count endpoint
                // Since UploadThing doesn't provide total count directly, we'll track it differently
                setTotalImages(formattedImages.length + currentOffset)
            } else {
                toast.error({
                    title: 'Failed to load images',
                    description: 'Could not fetch images from server',
                })
            }
        } catch (error) {
            console.error('Error fetching images:', error)
            toast.error({
                title: 'Failed to load images',
                description: 'An error occurred while loading images',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const currentOffset = offset - imagesPerPage
        fetchImages(currentOffset)
    }, [offset, imagesPerPage])

    const handleUploadComplete = async (_files: UploadedImage[]) => {
        // Refresh the images list with current offset
        await fetchImages(offset - imagesPerPage)
    }

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
                    // Refresh the images list with current offset
                    await fetchImages(offset - imagesPerPage)
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
