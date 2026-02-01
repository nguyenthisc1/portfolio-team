'use client'

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
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { HomeContentForm } from './types'
import { ProjectCategoryItems } from './ProjectCategoryItems'

interface ProjectsTabProps {
    form: UseFormReturn<HomeContentForm>
}

export default function ProjectsTab({ form }: ProjectsTabProps) {
    // Track expanded/collapsed state for each category (by index)
    const [expandedCategories, setExpandedCategories] = useState<number[]>([])

    // Use useFieldArray for proper form state management
    const {
        fields: categories,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: 'projects.projectList',
    })

    // Reset expand all when list changes
    useEffect(() => {
        setExpandedCategories((prev) => prev.filter((idx) => idx < categories.length))
    }, [categories.length])

    const handleToggleCategory = (idx: number) => {
        setExpandedCategories((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
        )
    }

    // Calculate total number of projects across all categories
    const totalProjects =
        categories && Array.isArray(categories)
            ? categories.reduce(
                  (acc, cat) =>
                      acc + (Array.isArray((cat as any).items) ? (cat as any).items.length : 0),
                  0,
              )
            : 0

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

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-semibold">Project Categories</h3>
                                <span className="text-muted-foreground text-xs">{`Project Total: ${totalProjects}`}</span>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    append({
                                        category: '',
                                        items: [],
                                    })
                                    // Expand the newly added category
                                    setExpandedCategories((prev) => [...prev, categories.length])
                                }}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </div>

                        {categories.length === 0 && (
                            <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                                <p>
                                    No project categories yet. Click &ldquo;Add Category&rdquo; to
                                    get started.
                                </p>
                            </div>
                        )}

                        {categories.map((category, categoryIndex) => {
                            const expanded = expandedCategories.includes(categoryIndex)
                            // Show category name and project count in the header
                            const categoryNameDisplay =
                                category.category && category.category.trim() !== ''
                                    ? `${category.category}`
                                    : ''
                            const projectCount = Array.isArray(category.items)
                                ? category.items.length
                                : 0

                            return (
                                <Card key={category.id} className="p-4">
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
                                                        handleToggleCategory(categoryIndex)
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
                                                    {categoryNameDisplay && (
                                                        <> ({categoryNameDisplay})</>
                                                    )}{' '}
                                                    <span className="text-muted-foreground text-sm">
                                                        [Projects: {projectCount}]
                                                    </span>
                                                </h3>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => remove(categoryIndex)}
                                            >
                                                <TrashIcon className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>

                                        {expanded && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name={`projects.projectList.${categoryIndex}.category`}
                                                    render={({ field: categoryField }) => (
                                                        <FormItem>
                                                            <FormLabel>Category Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...categoryField} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <ProjectCategoryItems
                                                    form={form}
                                                    categoryIndex={categoryIndex}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
