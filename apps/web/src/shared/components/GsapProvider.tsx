'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    children: React.ReactNode
}

export function GsapProvider({ children }: Props): React.JSX.Element {
    useEffect(() => {
        ScrollTrigger.defaults({ markers: false })
        ScrollTrigger.config({ ignoreMobileResize: true })
    }, [])

    return <>{children}</>
}
