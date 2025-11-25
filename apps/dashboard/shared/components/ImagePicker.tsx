'use client'

import { Button } from '@workspace/ui/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/Card'
import {
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from '@workspace/ui/components/Dialog'
import { Check, Image as ImageIcon, PlusCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ImageUploadDialog } from './ImageUploadDialog'

interface UploadedImage {
    url: string
    name: string
    key: string
    size: number
}

interface ImagePickerProps {
    selectedImages?: UploadedImage[]
    onSelectionChange?: (images: UploadedImage[]) => void
    maxSelection?: number
    multiple?: boolean
    title?: string
    description?: string
}

export function ImagePicker({
    selectedImages = [],
    onSelectionChange,
    maxSelection,
    multiple = true,
    title = 'Choose Images',
    description = 'Select images from your uploaded files',
}: ImagePickerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [availableImages, setAvailableImages] = useState<UploadedImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
        new Set(selectedImages.map((img) => img.key)),
    )

    // Fetch available images
    const fetchImages = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/uploadthing/list')
            if (response.ok) {
                const data = await response.json()
                const files = Array.isArray(data) ? data : data.files || []
                const formattedImages: UploadedImage[] = files
                    .filter((file: any) => file && (file.url || file.ufsUrl || file.key))
                    .map((file: any) => {
                        const url =
                            file.url ||
                            file.ufsUrl ||
                            (file.key ? `https://utfs.io/f/${file.key}` : '')
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
                setAvailableImages(formattedImages)
            }
        } catch (error) {
            console.error('Error fetching images:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isDialogOpen) {
            fetchImages()
        }
    }, [isDialogOpen])

    // Sync selectedKeys when selectedImages prop changes
    // Match by both key and URL to handle cases where URL is stored instead of key
    useEffect(() => {
        if (selectedImages.length > 0) {
            const keys = new Set<string>()
            selectedImages.forEach((img) => {
                keys.add(img.key)
                if (img.url && img.url !== img.key) {
                    keys.add(img.url)
                }
            })
            setSelectedKeys(keys)
        } else {
            setSelectedKeys(new Set())
        }
    }, [selectedImages])

    const handleImageToggle = (image: UploadedImage) => {
        const newSelectedKeys = new Set(selectedKeys)
        const isSelected = newSelectedKeys.has(image.key) || newSelectedKeys.has(image.url)

        if (isSelected) {
            newSelectedKeys.delete(image.key)
            newSelectedKeys.delete(image.url)
        } else {
            if (!multiple) {
                newSelectedKeys.clear()
            }
            if (!maxSelection || newSelectedKeys.size < maxSelection) {
                newSelectedKeys.add(image.key)
                if (image.url && image.url !== image.key) {
                    newSelectedKeys.add(image.url)
                }
            }
        }

        setSelectedKeys(newSelectedKeys)

        const selectedFromAvailable = availableImages.filter(
            (img) => newSelectedKeys.has(img.key) || newSelectedKeys.has(img.url),
        )
        const selectedFromProps = selectedImages.filter(
            (img) =>
                (newSelectedKeys.has(img.key) || newSelectedKeys.has(img.url)) &&
                !availableImages.some(
                    (available) => available.key === img.key || available.url === img.url,
                ),
        )

        onSelectionChange?.([...selectedFromAvailable, ...selectedFromProps])
    }

    const handleUploadComplete = async (_files: UploadedImage[]) => {
        await fetchImages()
    }

    const selectedImagesList = [
        ...availableImages.filter((img) => selectedKeys.has(img.key) || selectedKeys.has(img.url)),
        ...selectedImages.filter(
            (img) =>
                !availableImages.some(
                    (available) => available.key === img.key || available.url === img.url,
                ) &&
                (selectedKeys.has(img.key) || selectedKeys.has(img.url)),
        ),
    ]

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const truncateUrl = (url: string, maxLength: number = 50) => {
        if (url.length <= maxLength) return url
        return url.substring(0, maxLength) + '...'
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {/* <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div> */}
                <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Choose Image
                    </span>
                </Button>
            </div>

            {selectedImagesList.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Selected Image{multiple ? 's' : ''} ({selectedImagesList.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-2">
                            {selectedImagesList.map((image) => (
                                <div key={image.key} className="group relative">
                                    <div className="border-primary relative aspect-square overflow-hidden rounded-md border-2 p-1">
                                        <Image
                                            src={image.url}
                                            alt={image.name}
                                            fill
                                            className="size-full object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                                        />
                                        {/* <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <Check className="h-6 w-6 text-primary-foreground" />
                                        </div> */}
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleImageToggle(image)
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Dialog for choosing and uploading images */}
            <DialogOverlay isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="md:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>
                            {multiple
                                ? `Choose Images${maxSelection ? ` (max ${maxSelection})` : ''}`
                                : `Choose Image`}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                            {availableImages.length === 0
                                ? 'No images available.'
                                : `Click on an image to select image${multiple ? 's' : ''}${
                                      maxSelection ? ` (max ${maxSelection})` : ''
                                  }`}
                        </span>
                        <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Upload Images
                        </Button>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">Loading images...</div>
                        </div>
                    ) : availableImages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-muted-foreground mb-4 text-sm">
                                No images available. Upload your first image.
                            </p>
                            <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Upload Images
                            </Button>
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {availableImages.map((image) => {
                                    const isSelected =
                                        selectedKeys.has(image.key) || selectedKeys.has(image.url)
                                    return (
                                        <div
                                            key={image.key}
                                            className={`group relative cursor-pointer rounded-lg border transition-shadow ${isSelected ? 'border-primary ring-primary/60 ring-2' : 'border-muted border-dashed'} hover:ring-primary/30 hover:ring-2`}
                                            onClick={() => handleImageToggle(image)}
                                        >
                                            <div className="relative aspect-square overflow-hidden rounded-md">
                                                <Image
                                                    src={image.url}
                                                    alt={image.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                                                />
                                                {isSelected && (
                                                    <div className="bg-primary/30 absolute inset-0 flex items-center justify-center">
                                                        <Check className="text-primary-foreground h-6 w-6 drop-shadow" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-2 py-1 text-xs">
                                                <div className="truncate font-medium">
                                                    {image.name}
                                                </div>
                                                <div className="text-muted-foreground hidden md:block">
                                                    {formatFileSize(image.size)}
                                                </div>
                                                <div className="text-muted-foreground hidden truncate md:block">
                                                    <code className="text-[10px]">
                                                        {truncateUrl(image.url, 30)}
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </DialogOverlay>
            <ImageUploadDialog
                isOpen={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onUploadComplete={handleUploadComplete}
            />
        </div>
    )
}
