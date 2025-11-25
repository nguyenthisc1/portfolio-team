import PageDetailWrapper from 'features/pages/components/PageDetailWrapper'

export default function PageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <PageDetailWrapper params={params} />
}
