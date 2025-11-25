'use client'

import { Button } from '@workspace/ui/components/Button'
import { toast } from '@workspace/ui/components/Sonner'
import { PlusCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PagesTable } from './PagesTable'

interface Page {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
    createdAt: string
    updatedAt: string
}

export default function PagesPage() {
    const searchParams = useSearchParams()
    const offsetParam = searchParams.get('offset')
    const initialOffset = offsetParam ? parseInt(offsetParam, 10) : 10

    const [pages, setPages] = useState<Page[]>([])
    const [offset, setOffset] = useState(initialOffset)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setOffset(initialOffset)
    }, [initialOffset])

    // Fetch pages from API
    const fetchPages = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/pages')
            if (response.ok) {
                const data = await response.json()
                setPages(data)
            } else {
                toast.error({
                    title: 'Failed to load pages',
                    description: 'Could not fetch pages from server',
                })
            }
        } catch (error) {
            console.error('Error fetching pages:', error)
            toast.error({
                title: 'Failed to load pages',
                description: 'An error occurred while loading pages',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPages()
    }, [])

    const pagesPerPage = 10
    const paginatedPages = pages.slice(offset - pagesPerPage, offset)
    const totalPages = pages.length

    const deletePage = async (id: string) => {
        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success({
                    title: 'Page deleted',
                    description: 'Page has been deleted successfully',
                })
                // Refresh the pages list
                await fetchPages()
            } else {
                const error = await response.json()
                toast.error({
                    title: 'Delete failed',
                    description: error.error || 'Failed to delete page',
                })
            }
        } catch (error) {
            console.error('Error deleting page:', error)
            toast.error({
                title: 'Delete failed',
                description: 'An error occurred while deleting the page',
            })
        }
    }

    const handleEdit = (page: Page) => {
        // TODO: Implement edit functionality
        toast.info({
            title: 'Edit page',
            description: `Editing page: ${page.title}`,
        })
    }

    const handleView = (page: Page) => {
        // Navigate to page detail
        window.location.href = `/pages/${page.id}`
    }

    return (
        <>
            <div className="mb-4 flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                            // TODO: Implement add page functionality
                            toast.info({
                                title: 'Add page',
                                description: 'Add page functionality coming soon',
                            })
                        }}
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Page
                        </span>
                    </Button>
                </div>
            </div>

            <PagesTable
                pages={paginatedPages}
                offset={offset}
                isLoading={isLoading}
                totalPages={totalPages}
                onDelete={deletePage}
                onEdit={handleEdit}
                onView={handleView}
            />
        </>
    )
}
