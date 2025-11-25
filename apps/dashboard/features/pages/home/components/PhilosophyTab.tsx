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
import { TextArea } from '@workspace/ui/src/components/Textfield'
import { UseFormReturn } from 'react-hook-form'
import { HomeContentForm } from './types'

interface PhilosophyTabProps {
    form: UseFormReturn<HomeContentForm>
}

export default function PhilosophyTab({ form }: PhilosophyTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Philosophy</CardTitle>
                <CardDescription>Your design philosophy statement</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <FormField
                        control={form.control}
                        name="philosophy.text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Philosophy Text</FormLabel>
                                <FormControl>
                                    <TextArea {...field} rows={4} />
                                </FormControl>
                                <FormDescription>Your design philosophy statement</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
