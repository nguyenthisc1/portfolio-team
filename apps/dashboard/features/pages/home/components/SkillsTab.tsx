'use client'

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
import { Button } from '@workspace/ui/components/Button'
import { Input } from '@workspace/ui/components/Textfield'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { HomeContentForm } from './types'

interface SkillsTabProps {
    form: UseFormReturn<HomeContentForm>
}

export default function SkillsTab({ form }: SkillsTabProps) {
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
                                        {field.value?.map((skill, skillIndex) => (
                                            <Card key={skillIndex} className="p-4">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold">
                                                            Skill Section {skillIndex + 1}
                                                        </h3>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newSkills =
                                                                    field.value.filter(
                                                                        (_, i) => i !== skillIndex,
                                                                    )
                                                                field.onChange(newSkills)
                                                            }}
                                                        >
                                                            <TrashIcon className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </Button>
                                                    </div>

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
                                                        {skill.skills?.map(
                                                            (skillItem, skillItemIndex) => (
                                                                <div
                                                                    key={skillItemIndex}
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={skillItem}
                                                                        onChange={(e) => {
                                                                            const newSkills = [
                                                                                ...field.value,
                                                                            ]
                                                                            newSkills[
                                                                                skillIndex
                                                                            ].skills[
                                                                                skillItemIndex
                                                                            ] = e.target.value
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
                                                                            const newSkills = [
                                                                                ...field.value,
                                                                            ]
                                                                            newSkills[
                                                                                skillIndex
                                                                            ].skills =
                                                                                skill.skills.filter(
                                                                                    (_, i) =>
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
                                                                const newSkills = [...field.value]
                                                                newSkills[skillIndex].skills.push(
                                                                    '',
                                                                )
                                                                field.onChange(newSkills)
                                                            }}
                                                        >
                                                            <PlusIcon className="mr-2 h-4 w-4" />
                                                            Add Skill
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}

                                        <Button
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
