'use client'

import { useEffect, useState } from 'react'
import HomePage from '../home/components/HomePage'
import PageDetail from './PageDetail'

interface PageDetailWrapperProps {
    params: Promise<{ id: string }>
}

export default function PageDetailWrapper({ params }: PageDetailWrapperProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isHomePage, setIsHomePage] = useState(false)

    useEffect(() => {
        const loadParams = async () => {
            const resolvedParams = await params
            const id = resolvedParams.id

            // Check if id is "home"
            if (id.toLowerCase() === 'home') {
                setIsHomePage(true)
                setIsLoading(false)
                return
            }

            // Fetch page to check if slug is "home"
            try {
                const response = await fetch(`/api/pages/${id}`)
                if (response.ok) {
                    const page = await response.json()
                    // If slug is "home", render HomePage
                    if (page.slug?.toLowerCase() === 'home') {
                        setIsHomePage(true)
                    }
                }
            } catch (error) {
                console.error('Error fetching page:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadParams()
    }, [params])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    // If it's the home page, render HomePage component
    if (isHomePage) {
        return <HomePage />
    }

    // Otherwise, render the regular PageDetail
    return <PageDetail params={params} />
}
