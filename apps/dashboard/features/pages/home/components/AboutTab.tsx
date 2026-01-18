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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/Form'
import { Input, TextArea } from '@workspace/ui/components/Textfield'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { FieldArrayWithId, UseFormReturn, useFieldArray } from 'react-hook-form'
import { HomeContentForm } from './types'

interface AboutTabProps {
    form: UseFormReturn<HomeContentForm>
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
                            <p>No team members yet. Click "Add Team Member" to get started.</p>
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
                                                    <FormLabel>Image URL</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="/images/team-member.png"
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
