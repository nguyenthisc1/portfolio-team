'use client'

import { Button } from '@workspace/ui/components/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/Card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/Table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ImageRow } from './TableRow'

interface UploadedImage {
    url: string
    name: string
    key: string
    size: number
}

interface ImagesTableProps {
    images: UploadedImage[]
    offset: number
    totalImages: number
    hasMore?: boolean
    isLoading: boolean
    onDelete: (key: string) => void
    onView: (image: UploadedImage) => void
    onCopy: (url: string) => void
}

export function ImagesTable({
    images,
    offset,
    totalImages,
    hasMore = false,
    isLoading,
    onDelete,
    onView,
    onCopy,
}: ImagesTableProps) {
    const router = useRouter()
    const imagesPerPage = 10

    const startIndex = Math.max(1, offset - imagesPerPage + 1)
    const endIndex = offset - imagesPerPage + images.length

    function prevPage() {
        const newOffset = Math.max(imagesPerPage, offset - imagesPerPage)
        router.push(`/images?offset=${newOffset}`, { scroll: false })
    }

    function nextPage() {
        const newOffset = offset + imagesPerPage
        router.push(`/images?offset=${newOffset}`, { scroll: false })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage your uploaded images</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Size</TableHead>
                            <TableHead className="hidden md:table-cell">URL</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    Loading...
                                </TableCell>{' '}
                                :
                            </TableRow>
                        ) : images.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    No images uploaded yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            images.map((image) => (
                                <ImageRow
                                    key={image.key}
                                    image={image}
                                    onDelete={onDelete}
                                    onView={onView}
                                    onCopy={onCopy}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {totalImages > 0 && (
                <CardFooter>
                    <div className="flex w-full items-center justify-between">
                        <div className="text-muted-foreground text-xs">
                            Showing{' '}
                            <strong>
                                {startIndex}-{endIndex}
                            </strong>{' '}
                            of <strong>{totalImages}</strong> images
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevPage}
                                isDisabled={offset <= imagesPerPage}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Prev
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextPage}
                                isDisabled={!hasMore && images.length === 0}
                            >
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
