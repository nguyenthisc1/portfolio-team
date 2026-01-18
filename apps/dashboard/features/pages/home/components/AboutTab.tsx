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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/Form'
import { Input, TextArea } from '@workspace/ui/components/Textfield'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FieldArrayWithId, UseFormReturn, useFieldArray } from 'react-hook-form'
import { HomeContentForm } from './types'

interface AboutTabProps {
    form: UseFormReturn<HomeContentForm>
}

interface TeamMemberImageFieldProps {
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

function TeamMemberImageField({ value, onChange }: TeamMemberImageFieldProps) {
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
            title="Select Team Member Image"
            description="Choose an image for this team member"
        />
    )
}

export default function AboutTab({ form }: AboutTabProps) {
    // useFieldArray hook must be used directly, not from form
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'about.teamMembers',
    })

    const addTeamMember = () => {
        append({
            image: '',
            name: '',
            position: '',
            experience: 0,
            projects: 0,
            customers: 0,
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>About / Team</CardTitle>
                <CardDescription>Manage team members information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Section Title and Description */}
                <FieldGroup>
                    <FormField
                        control={form.control}
                        name="about.title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section Title</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Meet Our Team" />
                                </FormControl>
                                <FormDescription>
                                    The title for the about/team section
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="about.description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section Description</FormLabel>
                                <FormControl>
                                    <TextArea
                                        {...field}
                                        rows={3}
                                        placeholder="We are a team of passionate professionals..."
                                    />
                                </FormControl>
                                <FormDescription>A brief description of your team</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FieldGroup>

                {/* Team Members List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Team Members</h3>
                        <Button type="button" onClick={addTeamMember} variant="outline" size="sm">
                            <PlusCircle className="mr-2 size-4" />
                            Add Team Member
                        </Button>
                    </div>

                    {fields.length === 0 && (
                        <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                            <p>
                                No team members yet. Click &ldquo;Add Team Member&rdquo; to get
                                started.
                            </p>
                        </div>
                    )}

                    {fields.map(
                        (
                            field: FieldArrayWithId<HomeContentForm['about'], 'teamMembers', 'id'>,
                            index: number,
                        ) => (
                            <Card key={field.id} className="relative">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
                                            Team Member #{index + 1}
                                        </CardTitle>
                                        <Button
                                            type="button"
                                            onClick={() => remove(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <MinusCircle className="mr-2 size-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <FormField
                                            control={form.control}
                                            name={`about.teamMembers.${index}.image`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Team Member Image</FormLabel>
                                                    <FormControl>
                                                        <TeamMemberImageField
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`about.teamMembers.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="John Doe" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`about.teamMembers.${index}.position`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Position</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="FRONTEND DEVELOPER"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`about.teamMembers.${index}.experience`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Experience (years)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min="0"
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`about.teamMembers.${index}.projects`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Projects</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min="0"
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`about.teamMembers.${index}.customers`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Customers</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min="0"
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(e.target.value) ||
                                                                            0,
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        ),
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
