'use client'

import { useEffect } from 'react'
import { HomePageData } from 'types'
import { useHomeStore } from '@/shared/stores/home'

type Props = {
    data: HomePageData | null
}

export default function HomeStoreHydrator({ data }: Props) {
    const setData = useHomeStore((state) => state.setData)

    useEffect(() => {
        setData(data)
    }, [data, setData])

    return null
}
