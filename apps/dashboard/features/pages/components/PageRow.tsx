'use client'

import { useRouter } from 'next/navigation'
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
import { Badge } from '@workspace/ui/src/components/Badge'
import { toast } from '@workspace/ui/src/components/Sonner'
import { MoreHorizontal, EyeIcon, PencilIcon, TrashIcon, CopyIcon } from 'lucide-react'

interface Page {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
    createdAt: string
    updatedAt: string
}

interface PageRowProps {
    page: Page
    onDelete: (id: string) => void
    onEdit: (page: Page) => void
    onView: (page: Page) => void
}

export function PageRow({ page, onDelete, onEdit, onView }: PageRowProps) {
    const router = useRouter()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const handleTitleClick = () => {
        router.push(`/pages/${page.id}`)
    }

    const handleDelete = () => {
        confirm({
            title: 'Delete Page',
            description: `Are you sure you want to delete "${page.title}"? This action cannot be undone.`,
            variant: 'destructive',
            action: {
                label: 'Delete',
                onClick: () => onDelete(page.id),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {},
            },
        })
    }

    const copySlug = () => {
        navigator.clipboard.writeText(page.slug)
        toast.success({
            title: 'Copied to clipboard',
            description: 'Page slug copied to clipboard',
        })
    }

    return (
        <TableRow>
            <TableCell className="font-medium">
                <button
                    onClick={handleTitleClick}
                    className="hover:text-primary cursor-pointer text-left transition-colors"
                >
                    {page.title}
                </button>
            </TableCell>
            <TableCell>
                <code className="text-muted-foreground text-xs">{page.slug}</code>
            </TableCell>
            <TableCell>
                <Badge
                    variant={page.status === 'published' ? 'default' : 'outline'}
                    className="capitalize"
                >
                    {page.status}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(page.createdAt)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(page.updatedAt)}</TableCell>
            <TableCell>
                <MenuTrigger>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <MenuPopover>
                        <Menu>
                            <MenuHeader>Actions</MenuHeader>
                            <MenuItem onAction={() => onView(page)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View
                            </MenuItem>
                            <MenuItem onAction={() => onEdit(page)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit
                            </MenuItem>
                            <MenuItem onAction={copySlug}>
                                <CopyIcon className="mr-2 h-4 w-4" />
                                Copy Slug
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
