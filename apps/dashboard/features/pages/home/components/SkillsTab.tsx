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
import { UseFormReturn } from 'react-hook-form'
import { HomeContentForm } from './types'

interface SkillsTabProps {
    form: UseFormReturn<HomeContentForm>
}

export default function SkillsTab({ form }: SkillsTabProps) {
    const [expandedSections, setExpandedSections] = useState<number[]>([])

    // Keep expandedSections to only include indices for existing sections
    const skillsLength = form.watch('skills')?.length || 0
    useEffect(() => {
        setExpandedSections((prev) => prev.filter((idx) => idx < skillsLength))
    }, [skillsLength])

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
                    <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skills Sections</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        {field.value?.map((skill, skillIndex) => {
                                            const expanded = expandedSections.includes(skillIndex)
                                            return (
                                                <Card key={skillIndex} className="p-4">
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
                                                                    onClick={() =>
                                                                        handleToggleSection(
                                                                            skillIndex,
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
                                                                    Skill Section {skillIndex + 1}
                                                                </h3>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newSkills =
                                                                        field.value.filter(
                                                                            (_: any, i: number) =>
                                                                                i !== skillIndex,
                                                                        )
                                                                    field.onChange(newSkills)
                                                                }}
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
                                                                    render={({
                                                                        field: titleField,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormLabel>
                                                                                Title
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...titleField}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name={`skills.${skillIndex}.name`}
                                                                    render={({
                                                                        field: nameField,
                                                                    }) => (
                                                                        <FormItem>
                                                                            <FormLabel>
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

                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-medium">
                                                                        Skills
                                                                    </label>
                                                                    {skill.skills?.map(
                                                                        (
                                                                            skillItem: string,
                                                                            skillItemIndex: number,
                                                                        ) => (
                                                                            <div
                                                                                key={skillItemIndex}
                                                                                className="flex gap-2"
                                                                            >
                                                                                <Input
                                                                                    value={
                                                                                        skillItem
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) => {
                                                                                        const newSkills =
                                                                                            [
                                                                                                ...field.value,
                                                                                            ]
                                                                                        newSkills[
                                                                                            skillIndex
                                                                                        ].skills[
                                                                                            skillItemIndex
                                                                                        ] =
                                                                                            e.target.value
                                                                                        field.onChange(
                                                                                            newSkills,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="icon"
                                                                                    onClick={() => {
                                                                                        const newSkills =
                                                                                            [
                                                                                                ...field.value,
                                                                                            ]
                                                                                        newSkills[
                                                                                            skillIndex
                                                                                        ].skills =
                                                                                            skill.skills.filter(
                                                                                                (
                                                                                                    _: any,
                                                                                                    i: number,
                                                                                                ) =>
                                                                                                    i !==
                                                                                                    skillItemIndex,
                                                                                            )
                                                                                        field.onChange(
                                                                                            newSkills,
                                                                                        )
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
                                                                            const newSkills = [
                                                                                ...field.value,
                                                                            ]
                                                                            newSkills[
                                                                                skillIndex
                                                                            ].skills.push('')
                                                                            field.onChange(
                                                                                newSkills,
                                                                            )
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
                                        {/* <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                field.onChange([
                                                    ...field.value,
                                                    {
                                                        title: '',
                                                        name: '',
                                                        skills: [],
                                                    },
                                                ])
                                            }}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Add Skill Section
                                        </Button> */}
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
