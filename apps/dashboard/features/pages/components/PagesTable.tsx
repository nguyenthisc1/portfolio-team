'use client'

import {
    Card,
    CardContent,
    CardDescription,
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
import { PageRow } from './PageRow'

interface Page {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
    createdAt: string
    updatedAt: string
}

interface PagesTableProps {
    pages: Page[]
    // offset: number
    // totalPages: number
    isLoading: boolean
    onDelete: (id: string) => void
    onEdit: (page: Page) => void
    onView: (page: Page) => void
}

export function PagesTable({
    // offset,
    // totalPages,
    pages,
    isLoading,
    onDelete,
    onEdit,
    onView,
}: PagesTableProps) {
    // const router = useRouter()
    // const pagesPerPage = 10

    // const startIndex = Math.max(0, offset - pagesPerPage) + 1
    // const endIndex = Math.min(offset, totalPages)

    // function prevPage() {
    //     const newOffset = Math.max(pagesPerPage, offset - pagesPerPage)
    //     router.push(`/pages?offset=${newOffset}`, { scroll: false })
    // }

    // function nextPage() {
    //     const newOffset = offset + pagesPerPage
    //     router.push(`/pages?offset=${newOffset}`, { scroll: false })
    // }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>Manage your website pages</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Created</TableHead>
                            <TableHead className="hidden md:table-cell">Updated</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    No pages found
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <PageRow
                                    key={page.id}
                                    page={page}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onView={onView}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {/* {totalPages > 0 && (
                <CardFooter>
                    <div className="flex w-full items-center justify-between">
                        <div className="text-muted-foreground text-xs">
                            Showing{' '}
                            <strong>
                                {startIndex}-{endIndex}
                            </strong>{' '}
                            of <strong>{totalPages}</strong> pages
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevPage}
                                isDisabled={offset <= pagesPerPage}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Prev
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextPage}
                                isDisabled={offset >= totalPages}
                            >
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            )} */}
        </Card>
    )
}
