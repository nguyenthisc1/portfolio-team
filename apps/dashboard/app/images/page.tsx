import ImagesPage from 'features/images/components/ImagesPage'
import { getImages } from 'server/images'

export default async function Page(props: {
    searchParams: Promise<Record<string, string | string[]>>
}) {
    const searchParams = await props.searchParams

    return <ImagesPage />
}
