'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/src/components/Card'
import { FieldGroup } from '@workspace/ui/src/components/Field'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/src/components/Form'
import { Button } from '@workspace/ui/src/components/Button'
import { Input, TextArea } from '@workspace/ui/src/components/Textfield'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { HomeContentForm } from './types'
import { ImagePicker } from '@/shared/components/ImagePicker'
import { useState, useEffect } from 'react'

interface SeoSidebarProps {
    form: UseFormReturn<HomeContentForm>
}

export default function SeoSidebar({ form }: SeoSidebarProps) {
    const seoImage = form.watch('seo.image')
    const [selectedImage, setSelectedImage] = useState<{
        url: string
        name: string
        key: string
        size: number
    } | null>(null)

    // Initialize selected image from form value
    useEffect(() => {
        if (seoImage) {
            // Create a minimal image object from the URL
            // The ImagePicker will try to match this with available images
            setSelectedImage({
                url: seoImage,
                name: seoImage.split('/').pop() || 'Selected Image',
                key: seoImage, // Use URL as key for matching
                size: 0,
            })
        } else {
            setSelectedImage(null)
        }
    }, [seoImage])

    const handleImageSelection = (
        images: { url: string; name: string; key: string; size: number }[],
    ) => {
        if (images.length > 0) {
            const image = images[0]
            form.setValue('seo.image', image.url, { shouldValidate: true })
            setSelectedImage(image)
        } else {
            form.setValue('seo.image', '', { shouldValidate: true })
            setSelectedImage(null)
        }
    }

    return (
        <div className="sticky top-6 h-fit">
            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Configure SEO metadata for your home page</CardDescription>
                </CardHeader>
                <div className="h-fit max-h-[85vh] overflow-y-auto">
                    <CardContent>
                        <FieldGroup>
                            <FormField
                                control={form.control}
                                name="seo.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>The page title for SEO</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="seo.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <TextArea {...field} rows={3} />
                                        </FormControl>
                                        <FormDescription>Meta description for SEO</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="seo.image"
                                render={({ field: _field }) => (
                                    <FormItem>
                                        <FormLabel>OG Image</FormLabel>
                                        <FormControl>
                                            <ImagePicker
                                                selectedImages={
                                                    selectedImage ? [selectedImage] : []
                                                }
                                                onSelectionChange={handleImageSelection}
                                                multiple={false}
                                                maxSelection={1}
                                                title="Select SEO Image"
                                                description="Choose an image for social media sharing (Open Graph)"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Image for social media sharing (og:image)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="seo.keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {field.value?.map((keyword, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={keyword}
                                                            onChange={(e) => {
                                                                const newKeywords = [...field.value]
                                                                newKeywords[index] = e.target.value
                                                                field.onChange(newKeywords)
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                const newKeywords =
                                                                    field.value.filter(
                                                                        (_, i) => i !== index,
                                                                    )
                                                                field.onChange(newKeywords)
                                                            }}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        field.onChange([...field.value, ''])
                                                    }}
                                                >
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                    Add Keyword
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            SEO keywords for your page
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FieldGroup>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}
