'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/src/components/Button'
import { Form } from '@workspace/ui/src/components/Form'
import { toast } from '@workspace/ui/src/components/Sonner'
import { Tab, TabList, TabPanel, Tabs } from '@workspace/ui/src/components/Tabs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { homeContentSchema, HomeContentForm } from './types'
import HeroTab from './HeroTab'
import PhilosophyTab from './PhilosophyTab'
import ProjectsTab from './ProjectsTab'
import SkillsTab from './SkillsTab'
import SeoSidebar from './SeoSidebar'

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const form = useForm<HomeContentForm>({
        resolver: zodResolver(homeContentSchema),
        defaultValues: {
            seo: {
                title: '',
                description: '',
                image: '',
                keywords: [],
            },
            hero: {
                title: '',
                description: '',
            },
            philosophy: {
                text: '',
            },
            projects: {
                title: '',
                description: '',
                projectList: [],
            },
            skills: [],
        },
    })

    // Load data from API
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/api/content')
                if (response.ok) {
                    const data = await response.json()
                    form.reset(data)
                } else {
                    toast.error({ title: 'Failed to load content' })
                }
            } catch (error) {
                console.error('Error loading data:', error)
                toast.error({ title: 'Failed to load content' })
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [form])

    const onSubmit = async (data: HomeContentForm) => {
        console.log('Form submitted with data:', data)
        setIsSaving(true)
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const responseData = await response.json()
            console.log('API response:', response.status, responseData)

            if (response.ok) {
                toast.success({ title: 'Content saved successfully' })
            } else {
                toast.error({
                    title: 'Failed to save content',
                    description:
                        responseData.error ||
                        responseData.details ||
                        'An error occurred while saving',
                })
            }
        } catch (error) {
            console.error('Error saving data:', error)
            toast.error({
                title: 'Failed to save content',
                description:
                    error instanceof Error ? error.message : 'An unexpected error occurred',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmitClick = () => {
        form.handleSubmit(onSubmit, (errors) => {
            console.error('Form validation errors:', errors)
            // Get the first error message
            const errorMessages: string[] = []
            const extractErrors = (obj: any, path = '') => {
                Object.keys(obj).forEach((key) => {
                    const currentPath = path ? `${path}.${key}` : key
                    if (obj[key]?.message) {
                        errorMessages.push(`${currentPath}: ${obj[key].message}`)
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        extractErrors(obj[key], currentPath)
                    }
                })
            }
            extractErrors(errors)

            toast.error({
                title: 'Validation Error',
                description: errorMessages[0] || 'Please check the form for errors',
            })
        })()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Home Content Manager</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage your home page content
                    </p>
                </div>
                <Button onClick={handleSubmitClick} isDisabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                        {/* Main Content Area */}
                        <div className="space-y-6">
                            <Tabs defaultSelectedKey="hero" className="w-full">
                                <TabList>
                                    <Tab id="hero">Hero</Tab>
                                    <Tab id="philosophy">Philosophy</Tab>
                                    <Tab id="projects">Projects</Tab>
                                    <Tab id="skills">Skills</Tab>
                                </TabList>

                                <TabPanel id="hero">
                                    <HeroTab form={form} />
                                </TabPanel>

                                <TabPanel id="philosophy">
                                    <PhilosophyTab form={form} />
                                </TabPanel>

                                <TabPanel id="projects">
                                    <ProjectsTab form={form} />
                                </TabPanel>

                                <TabPanel id="skills">
                                    <SkillsTab form={form} />
                                </TabPanel>
                            </Tabs>
                        </div>

                        {/* Right Sidebar - SEO */}
                        <div className="lg:col-start-2">
                            <SeoSidebar form={form} />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
