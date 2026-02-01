'use client'

import { ImagePicker } from 'shared/components/ImagePicker'
import { Button } from '@workspace/ui/components/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/Card'
import { FieldGroup } from '@workspace/ui/components/Field'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/Form'
import { Input, TextArea } from '@workspace/ui/components/Textfield'
import { ChevronDown, ChevronRight, PlusIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { HomeContentForm } from './types'

interface ProjectsTabProps {
    form: UseFormReturn<HomeContentForm>
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

export default function ProjectsTab({ form }: ProjectsTabProps) {
    // Track expanded/collapsed state for each category (by index)
    const [expandedCategories, setExpandedCategories] = useState<number[]>([])

    // Reset expand all when list changes (optional: expand all on add)
    const watchedProjectList = form.watch('projects.projectList')
    const projectListLength = watchedProjectList?.length || 0
    useEffect(() => {
        setExpandedCategories((prev) => prev.filter((idx) => idx < projectListLength))
    }, [projectListLength])

    const handleToggleCategory = (idx: number) => {
        setExpandedCategories((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your project categories and items</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <FormField
                        control={form.control}
                        name="projects.title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Projects Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="projects.description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Projects Description</FormLabel>
                                <FormControl>
                                    <TextArea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="projects.projectList"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Categories</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        {field.value?.map(
                                            (category: any, categoryIndex: number) => {
                                                const expanded =
                                                    expandedCategories.includes(categoryIndex)
                                                return (
                                                    <Card key={categoryIndex} className={`p-4`}>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        type="button"
                                                                        aria-label={
                                                                            expanded
                                                                                ? 'Collapse category'
                                                                                : 'Expand category'
                                                                        }
                                                                        className="cursor-pointer focus:outline-none"
                                                                        tabIndex={0}
                                                                        onClick={() =>
                                                                            handleToggleCategory(
                                                                                categoryIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        {expanded ? (
                                                                            <ChevronDown className="h-5 w-5" />
                                                                        ) : (
                                                                            <ChevronRight className="h-5 w-5" />
                                                                        )}
                                                                    </button>
                                                                    <h3 className="font-semibold">
                                                                        Category {categoryIndex + 1}
                                                                    </h3>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newList =
                                                                            Array.isArray(
                                                                                field.value,
                                                                            )
                                                                                ? field.value.filter(
                                                                                      (
                                                                                          _: any,
                                                                                          i: number,
                                                                                      ) =>
                                                                                          i !==
                                                                                          categoryIndex,
                                                                                  )
                                                                                : []
                                                                        field.onChange(newList)
                                                                    }}
                                                                >
                                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                            {/* Only show details if expanded */}
                                                            {expanded && (
                                                                <>
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`projects.projectList.${categoryIndex}.category`}
                                                                        render={({
                                                                            field: categoryField,
                                                                        }) => (
                                                                            <FormItem>
                                                                                <FormLabel>
                                                                                    Category Name
                                                                                </FormLabel>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        {...categoryField}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />

                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium">
                                                                            Project Items
                                                                        </label>
                                                                        {Array.isArray(
                                                                            category?.items,
                                                                        )
                                                                            ? category.items.map(
                                                                                  (
                                                                                      item: any,
                                                                                      itemIndex: number,
                                                                                  ) => (
                                                                                      <Card
                                                                                          key={
                                                                                              itemIndex
                                                                                          }
                                                                                          className="p-3"
                                                                                      >
                                                                                          <div className="space-y-2">
                                                                                              <div className="flex justify-end">
                                                                                                  <Button
                                                                                                      type="button"
                                                                                                      variant="ghost"
                                                                                                      size="sm"
                                                                                                      onClick={() => {
                                                                                                          const newItems =
                                                                                                              Array.isArray(
                                                                                                                  category.items,
                                                                                                              )
                                                                                                                  ? category.items.filter(
                                                                                                                        (
                                                                                                                            _: any,
                                                                                                                            i: number,
                                                                                                                        ) =>
                                                                                                                            i !==
                                                                                                                            itemIndex,
                                                                                                                    )
                                                                                                                  : []
                                                                                                          const newList =
                                                                                                              Array.isArray(
                                                                                                                  field.value,
                                                                                                              )
                                                                                                                  ? [
                                                                                                                        ...field.value,
                                                                                                                    ]
                                                                                                                  : []
                                                                                                          if (
                                                                                                              newList[
                                                                                                                  categoryIndex
                                                                                                              ]
                                                                                                          ) {
                                                                                                              newList[
                                                                                                                  categoryIndex
                                                                                                              ] =
                                                                                                                  {
                                                                                                                      ...newList[
                                                                                                                          categoryIndex
                                                                                                                      ],
                                                                                                                      items: newItems,
                                                                                                                  }
                                                                                                              field.onChange(
                                                                                                                  newList,
                                                                                                              )
                                                                                                          }
                                                                                                      }}
                                                                                                  >
                                                                                                      <TrashIcon className="h-4 w-4" />
                                                                                                  </Button>
                                                                                              </div>
                                                                                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                                                                  <FormField
                                                                                                      control={
                                                                                                          form.control
                                                                                                      }
                                                                                                      name={`projects.projectList.${categoryIndex}.items.${itemIndex}.name`}
                                                                                                      render={({
                                                                                                          field: nameField,
                                                                                                      }) => (
                                                                                                          <FormItem>
                                                                                                              <FormLabel>
                                                                                                                  Project
                                                                                                                  Name
                                                                                                              </FormLabel>
                                                                                                              <FormControl>
                                                                                                                  <Input
                                                                                                                      {...nameField}
                                                                                                                  />
                                                                                                              </FormControl>
                                                                                                              <FormMessage />
                                                                                                          </FormItem>
                                                                                                      )}
                                                                                                  />

                                                                                                  <FormField
                                                                                                      control={
                                                                                                          form.control
                                                                                                      }
                                                                                                      name={`projects.projectList.${categoryIndex}.items.${itemIndex}.image`}
                                                                                                      render={({
                                                                                                          field: imageField,
                                                                                                      }) => (
                                                                                                          <FormItem>
                                                                                                              <FormLabel>
                                                                                                                  Project
                                                                                                                  Image
                                                                                                              </FormLabel>
                                                                                                              <FormControl>
                                                                                                                  <ProjectImageField
                                                                                                                      value={
                                                                                                                          imageField.value
                                                                                                                      }
                                                                                                                      onChange={
                                                                                                                          imageField.onChange
                                                                                                                      }
                                                                                                                  />
                                                                                                              </FormControl>
                                                                                                              <FormMessage />
                                                                                                          </FormItem>
                                                                                                      )}
                                                                                                  />
                                                                                              </div>

                                                                                              <FormField
                                                                                                  control={
                                                                                                      form.control
                                                                                                  }
                                                                                                  name={`projects.projectList.${categoryIndex}.items.${itemIndex}.link`}
                                                                                                  render={({
                                                                                                      field: linkField,
                                                                                                  }) => (
                                                                                                      <FormItem>
                                                                                                          <FormLabel>
                                                                                                              Website
                                                                                                              Link
                                                                                                          </FormLabel>
                                                                                                          <FormControl>
                                                                                                              <Input
                                                                                                                  {...linkField}
                                                                                                                  placeholder="https://example.com"
                                                                                                              />
                                                                                                          </FormControl>
                                                                                                          <FormMessage />
                                                                                                      </FormItem>
                                                                                                  )}
                                                                                              />
                                                                                          </div>
                                                                                      </Card>
                                                                                  ),
                                                                              )
                                                                            : null}

                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newList =
                                                                                    Array.isArray(
                                                                                        field.value,
                                                                                    )
                                                                                        ? [
                                                                                              ...field.value,
                                                                                          ]
                                                                                        : []

                                                                                if (
                                                                                    !(
                                                                                        newList[
                                                                                            categoryIndex
                                                                                        ] &&
                                                                                        Array.isArray(
                                                                                            newList[
                                                                                                categoryIndex
                                                                                            ].items,
                                                                                        )
                                                                                    )
                                                                                ) {
                                                                                    if (
                                                                                        !newList[
                                                                                            categoryIndex
                                                                                        ]
                                                                                    ) {
                                                                                        newList[
                                                                                            categoryIndex
                                                                                        ] = {
                                                                                            category:
                                                                                                '',
                                                                                            items: [],
                                                                                        }
                                                                                    } else {
                                                                                        newList[
                                                                                            categoryIndex
                                                                                        ].items = []
                                                                                    }
                                                                                }
                                                                                newList[
                                                                                    categoryIndex
                                                                                ].items.push({
                                                                                    image: '',
                                                                                    name: '',
                                                                                    link: '',
                                                                                })
                                                                                field.onChange(
                                                                                    newList,
                                                                                )
                                                                            }}
                                                                        >
                                                                            <PlusIcon className="mr-2 h-4 w-4" />
                                                                            Add Project Item
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Card>
                                                )
                                            },
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const newList = Array.isArray(field.value)
                                                    ? [
                                                          ...field.value,
                                                          {
                                                              category: '',
                                                              items: [],
                                                          },
                                                      ]
                                                    : [
                                                          {
                                                              category: '',
                                                              items: [],
                                                          },
                                                      ]
                                                field.onChange(newList)
                                                // Optionally, expand the new category
                                                setExpandedCategories((prev) => [
                                                    ...prev,
                                                    Array.isArray(field.value)
                                                        ? field.value.length
                                                        : 0,
                                                ])
                                            }}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Add Category
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
