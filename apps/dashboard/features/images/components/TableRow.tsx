'use client'

import Image from 'next/image'
import { Button } from '@workspace/ui/src/components/Button'
import { TableCell, TableRow } from '@workspace/ui/src/components/Table'
import {
    Menu,
    MenuItem,
    MenuTrigger,
    MenuPopover,
    MenuHeader,
} from '@workspace/ui/src/components/Menu'
import { confirm } from '@workspace/ui/src/components/ConfirmDialog'
import { MoreHorizontal, EyeIcon, CopyIcon, TrashIcon } from 'lucide-react'

interface UploadedImage {
    url: string
    name: string
    key: string
    size: number
}

interface ImageRowProps {
    image: UploadedImage
    onDelete: (key: string) => void
    onView: (image: UploadedImage) => void
    onCopy: (url: string) => void
}

export function ImageRow({ image, onDelete, onView, onCopy }: ImageRowProps) {
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

    const handleDelete = () => {
        confirm({
            title: 'Delete Image',
            description: `Are you sure you want to delete "${image.name}"? This action cannot be undone.`,
            variant: 'destructive',
            action: {
                label: 'Delete',
                onClick: () => onDelete(image.key),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {},
            },
        })
    }

    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <div className="relative h-16 w-16">
                    <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="rounded-md object-cover"
                        sizes="64px"
                    />
                </div>
            </TableCell>
            <TableCell className="font-medium">{image.name}</TableCell>
            <TableCell className="hidden md:table-cell">{formatFileSize(image.size)}</TableCell>
            <TableCell className="hidden md:table-cell">
                <code className="text-muted-foreground text-xs">{truncateUrl(image.url)}</code>
            </TableCell>
            <TableCell>
                <MenuTrigger>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <MenuPopover>
                        <Menu>
                            <MenuHeader>Actions</MenuHeader>
                            <MenuItem onAction={() => onView(image)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View
                            </MenuItem>
                            <MenuItem onAction={() => onCopy(image.url)}>
                                <CopyIcon className="mr-2 h-4 w-4" />
                                Copy URL
                            </MenuItem>
                            <MenuItem onAction={handleDelete} className="text-destructive">
                                <TrashIcon className="mr-2 h-4 w-4" />
                                Delete
                            </MenuItem>
                        </Menu>
                    </MenuPopover>
                </MenuTrigger>
            </TableCell>
        </TableRow>
    )
}
