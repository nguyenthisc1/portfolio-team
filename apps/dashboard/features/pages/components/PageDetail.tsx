'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/src/components/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/src/components/Card'
import { FieldGroup } from '@workspace/ui/src/components/Field'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/src/components/Form'
import { Input } from '@workspace/ui/src/components/Textfield'
import { toast } from '@workspace/ui/src/components/Sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const pageSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    status: z.enum(['published', 'draft']),
})

type PageForm = z.infer<typeof pageSchema>

interface Page {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
    createdAt: string
    updatedAt: string
}

interface PageDetailProps {
    params: Promise<{ id: string }>
}

export default function PageDetail({ params }: PageDetailProps) {
    const router = useRouter()
    const [pageId, setPageId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [page, setPage] = useState<Page | null>(null)

    const form = useForm<PageForm>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            title: '',
            slug: '',
            status: 'draft',
        },
    })

    useEffect(() => {
        const loadParams = async () => {
            const resolvedParams = await params
            setPageId(resolvedParams.id)
        }
        loadParams()
    }, [params])

    useEffect(() => {
        if (!pageId) return

        const fetchPage = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/pages/${pageId}`)
                if (response.ok) {
                    const data = await response.json()
                    setPage(data)
                    form.reset({
                        title: data.title,
                        slug: data.slug,
                        status: data.status,
                    })
                } else {
                    toast.error({
                        title: 'Failed to load page',
                        description: 'Could not fetch page from server',
                    })
                    router.push('/pages')
                }
            } catch (error) {
                console.error('Error fetching page:', error)
                toast.error({
                    title: 'Failed to load page',
                    description: 'An error occurred while loading the page',
                })
                router.push('/pages')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPage()
    }, [pageId, form, router])

    const onSubmit = async (data: PageForm) => {
        if (!pageId) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const result = await response.json()
                setPage(result.data)
                toast.success({
                    title: 'Page updated',
                    description: 'Page has been updated successfully',
                })
            } else {
                const error = await response.json()
                toast.error({
                    title: 'Update failed',
                    description: error.error || 'Failed to update page',
                })
            }
        } catch (error) {
            console.error('Error updating page:', error)
            toast.error({
                title: 'Update failed',
                description: 'An error occurred while updating the page',
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading page...</div>
            </div>
        )
    }

    if (!page) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Page not found</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/pages')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Pages
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Page Details</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Edit page information</p>
                    </div>
                </div>
                <Button onClick={form.handleSubmit(onSubmit)} isDisabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Information</CardTitle>
                            <CardDescription>Update the page details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="border-input bg-background-secondary ring-offset-background placeholder:text-muted-foreground focus-visible:ring-primary flex h-8 w-full rounded-sm border px-3 py-1.5 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Page ID:</span>
                                    <code className="text-xs">{page.id}</code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{new Date(page.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated:</span>
                                    <span>{new Date(page.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
