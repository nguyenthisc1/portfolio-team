'use client'

import { Button } from '@workspace/ui/components/Button'
import { Card } from '@workspace/ui/components/Card'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/Form'
import { Input } from '@workspace/ui/components/Textfield'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { HomeContentForm } from './types'
import { ImagePicker } from 'shared/components/ImagePicker'
import { useEffect, useState } from 'react'

interface ProjectCategoryItemsProps {
    form: UseFormReturn<HomeContentForm>
    categoryIndex: number
}

interface ProjectImageFieldProps {
    value: string
    onChange: (value: string) => void
}

// Helper to check if string is a valid absolute or root-relative URL
function isValidImageUrl(url: string): boolean {
    if (!url) return false
    try {
        // Allow absolute URLs (http://, https://) and root-relative URLs (/...)
        return url.startsWith('/') || Boolean(new URL(url))
    } catch {
        return false
    }
}

function normalizeImageUrl(url: string): string {
    // Accept absolute URLs and root-relative; treat other kinds as invalid (return empty string)
    if (!url) return ''
    // Absolute
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    // Root-relative
    if (url.startsWith('/')) return url
    // Return empty if not valid
    return ''
}

function ProjectImageField({ value, onChange }: ProjectImageFieldProps) {
    const [selectedImage, setSelectedImage] = useState<{
        url: string
        name: string
        key: string
        size: number
    } | null>(null)

    // Initialize selected image from form value
    useEffect(() => {
        if (value && isValidImageUrl(value)) {
            setSelectedImage({
                url: normalizeImageUrl(value),
                name: value.split('/').pop() || 'Selected Image',
                key: value,
                size: 0,
            })
        } else {
            setSelectedImage(null)
        }
    }, [value])

    const handleImageSelection = (
        images: { url: string; name?: string; key?: string; size?: number }[],
    ) => {
        if (images.length > 0) {
            const image = images[0]!
            // Normalize URL before storing to avoid invalid URLs
            const safeUrl = normalizeImageUrl(image.url)
            onChange(safeUrl)
            // Defensive: fill in all props, fallback to '' or 0 if not available
            setSelectedImage({
                url: safeUrl,
                name: image.name ?? '',
                key: image.key ?? '',
                size: image.size ?? 0,
            })
        } else {
            onChange('')
            setSelectedImage(null)
        }
    }

    return (
        <ImagePicker
            selectedImages={selectedImage && selectedImage.url ? [selectedImage] : []}
            onSelectionChange={handleImageSelection}
            multiple={false}
            maxSelection={1}
            title="Select Project Image"
            description="Choose an image for this project"
        />
    )
}

export function ProjectCategoryItems({ form, categoryIndex }: ProjectCategoryItemsProps) {
    const {
        fields: items,
        append: appendItem,
        remove: removeItem,
    } = useFieldArray({
        control: form.control,
        name: `projects.projectList.${categoryIndex}.items`,
    })

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Project Items</label>
            {items.length === 0 && (
                <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No project items yet. Click &ldquo;Add Project Item&rdquo; below to get started.
                </div>
            )}

            {items.map((item, itemIndex) => (
                <Card key={item.id} className="p-3">
                    <div className="space-y-2">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(itemIndex)}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name={`projects.projectList.${categoryIndex}.items.${itemIndex}.name`}
                                render={({ field: nameField }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input {...nameField} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`projects.projectList.${categoryIndex}.items.${itemIndex}.image`}
                                render={({ field: imageField }) => (
                                    <FormItem>
                                        <FormLabel>Project Image</FormLabel>
                                        <FormControl>
                                            <ProjectImageField
                                                value={imageField.value || ''}
                                                onChange={imageField.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name={`projects.projectList.${categoryIndex}.items.${itemIndex}.link`}
                            render={({ field: linkField }) => (
                                <FormItem>
                                    <FormLabel>Website Link</FormLabel>
                                    <FormControl>
                                        <Input {...linkField} placeholder="https://example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                    appendItem({
                        image: '',
                        name: '',
                        link: '',
                    })
                }}
            >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Project Item
            </Button>
        </div>
    )
}
