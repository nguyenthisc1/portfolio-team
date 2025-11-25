'use client'

import { UploadDropzone } from 'shared/lib/uploadthing'
import { CardDescription } from '@workspace/ui/components/Card'
import {
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from '@workspace/ui/components/Dialog'
import { toast } from '@workspace/ui/components/Sonner'

interface UploadedFile {
    url: string
    name: string
    key: string
    size: number
}

interface ImageUploadDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onUploadComplete?: (files: UploadedFile[]) => void
    onUploadError?: (error: Error) => void
    title?: string
    description?: string
    maxFiles?: number
}

export function ImageUploadDialog({
    isOpen,
    onOpenChange,
    onUploadComplete,
    onUploadError,
    title = 'Upload Images',
    description = 'Drag and drop images here or click to browse. Max file size: 4MB',
    maxFiles = 10,
}: ImageUploadDialogProps) {
    const handleUploadComplete = (
        res: Array<{ url: string; name: string; key: string; size: number }>,
    ) => {
        if (res && res.length > 0) {
            const uploadedFiles: UploadedFile[] = res.map((file) => ({
                url: file.url,
                name: file.name,
                key: file.key,
                size: file.size,
            }))

            toast.success({
                title: 'Upload successful',
                description: `${res.length} image(s) uploaded successfully`,
            })

            onUploadComplete?.(uploadedFiles)
            onOpenChange(false)
        }
    }

    const handleUploadError = (error: Error) => {
        toast.error({
            title: 'Upload failed',
            description: error.message || 'Failed to upload image',
        })
        onUploadError?.(error)
    }

    if (!isOpen) return null

    return (
        <DialogOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <CardDescription>
                        {description} {maxFiles > 1 && `(Up to ${maxFiles} files)`}
                    </CardDescription>
                    <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                        appearance={{
                            container: 'w-full cursor-pointer pb-8',
                            button: 'ut-ready:bg-primary p-1 ut-ready:text-white ut-ready:text-primary-foreground ut-uploading:cursor-not-allowed ut-uploading:opacity-50 bg-primary text-white button-3d hover:opacity-90 active:opacity-100 rounded-sm text-sm',
                            allowedContent: 'text-muted-foreground text-xs',
                        }}
                    />
                </div>
            </DialogContent>
        </DialogOverlay>
    )
}
