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
import { Input } from '@workspace/ui/components/Textfield'
import { ChevronDown, ChevronRight, PlusIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { HomeContentForm } from './types'

interface SkillsTabProps {
    form: UseFormReturn<HomeContentForm>
}

export default function SkillsTab({ form }: SkillsTabProps) {
    const [expandedSections, setExpandedSections] = useState<number[]>([])

    // Use useFieldArray for proper form state management
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: 'skills',
    })

    // Keep expandedSections to only include indices for existing sections
    useEffect(() => {
        setExpandedSections((prev) => prev.filter((idx) => idx < fields.length))
    }, [fields.length])

    const handleToggleSection = (idx: number) => {
        setExpandedSections((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your skills sections</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Skills Sections</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    append({
                                        title: '',
                                        name: '',
                                        skills: [],
                                    })
                                    // Expand the newly added section
                                    setExpandedSections((prev) => [...prev, fields.length])
                                }}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Skill Section
                            </Button>
                        </div>

                        {fields.length === 0 && (
                            <div className="text-muted-foreground rounded-lg border-2 border-dashed p-8 text-center">
                                <p>
                                    No skill sections yet. Click &ldquo;Add Skill Section&rdquo; to
                                    get started.
                                </p>
                            </div>
                        )}

                        {fields.map((field, skillIndex) => {
                            const expanded = expandedSections.includes(skillIndex)
                            const currentSkills = form.watch(`skills.${skillIndex}.skills`) || []

                            return (
                                <Card key={field.id} className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    aria-label={
                                                        expanded
                                                            ? 'Collapse section'
                                                            : 'Expand section'
                                                    }
                                                    className="cursor-pointer focus:outline-none"
                                                    tabIndex={0}
                                                    onClick={() => handleToggleSection(skillIndex)}
                                                >
                                                    {expanded ? (
                                                        <ChevronDown className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5" />
                                                    )}
                                                </button>
                                                <h3 className="font-semibold">
                                                    Skill Section #{skillIndex + 1}
                                                </h3>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => remove(skillIndex)}
                                            >
                                                <TrashIcon className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                        {expanded && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name={`skills.${skillIndex}.title`}
                                                    render={({ field: titleField }) => (
                                                        <FormItem>
                                                            <FormLabel>Title</FormLabel>
                                                            <FormControl>
                                                                <Input {...titleField} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`skills.${skillIndex}.name`}
                                                    render={({ field: nameField }) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...nameField} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Skills
                                                    </label>
                                                    {currentSkills.map(
                                                        (
                                                            skillItem: string,
                                                            skillItemIndex: number,
                                                        ) => (
                                                            <div
                                                                key={skillItemIndex}
                                                                className="flex gap-2"
                                                            >
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`skills.${skillIndex}.skills.${skillItemIndex}`}
                                                                    render={({
                                                                        field: skillField,
                                                                    }) => (
                                                                        <Input
                                                                            {...skillField}
                                                                            className="flex-1"
                                                                        />
                                                                    )}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        const currentSection =
                                                                            form.getValues(
                                                                                `skills.${skillIndex}`,
                                                                            )
                                                                        const updatedSkills =
                                                                            currentSection.skills.filter(
                                                                                (
                                                                                    _: any,
                                                                                    i: number,
                                                                                ) =>
                                                                                    i !==
                                                                                    skillItemIndex,
                                                                            )
                                                                        update(skillIndex, {
                                                                            ...currentSection,
                                                                            skills: updatedSkills,
                                                                        })
                                                                    }}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentSection = form.getValues(
                                                                `skills.${skillIndex}`,
                                                            )
                                                            update(skillIndex, {
                                                                ...currentSection,
                                                                skills: [
                                                                    ...currentSection.skills,
                                                                    '',
                                                                ],
                                                            })
                                                        }}
                                                    >
                                                        <PlusIcon className="mr-2 h-4 w-4" />
                                                        Add Skill
                                                    </Button>
                                                </div>
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
