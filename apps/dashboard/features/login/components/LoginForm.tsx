'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '@workspace/ui/components/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/Card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@workspace/ui/components/Field'
import { Input } from '@workspace/ui/components/Input'

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = String(formData.get('username') ?? '').trim()
        const password = String(formData.get('password') ?? '')

        if (!username || !password) {
            setError('Please provide both username and password.')
            return
        }

        setIsLoading(true)
        setError(null)

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
            callbackUrl: '/dashboard',
        })

        if (!result || result.error) {
            setError(
                result?.error === 'CredentialsSignin'
                    ? 'Invalid username or password.'
                    : (result?.error ?? 'Unable to sign in. Please try again.'),
            )
            setIsLoading(false)
            return
        }

        router.push(result.url ?? '/dashboard')
        router.refresh()
    }
    const oauthError = searchParams.get('error')
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your credentials to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FieldGroup>
                                {(error || oauthError) && (
                                    <Field>
                                        <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
                                            {error || oauthError}
                                        </div>
                                    </Field>
                                )}
                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                        disabled={isLoading}
                                    />
                                </Field>
                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        disabled={isLoading}
                                    />
                                </Field>
                                <Field>
                                    <Button type="submit" isDisabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account? <a href="#">Sign up</a>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
