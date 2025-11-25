import PagesPage from 'features/pages/components/PagesPage'
import { Suspense } from 'react'

export default async function page(props: {
    searchParams: Promise<Record<string, string | string[]>>
}) {
    return (
        <Suspense fallback={null}>
            <PagesPage />
        </Suspense>
    )
}
