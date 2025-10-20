'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

type Props = {
    children: React.ReactNode
}

export function GsapProvider({ children }: Props): React.JSX.Element {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const smootherRef = useRef<ScrollSmoother | null>(null)

    useEffect(() => {
        ScrollTrigger.defaults({ markers: false })
        ScrollTrigger.config({ ignoreMobileResize: true })

        if (scrollerRef.current && !smootherRef.current) {
            smootherRef.current = ScrollSmoother.create({
                smooth: 1.2,
                // effects: true,
                content: scrollerRef.current,
            })
        }

        // cleanup on component unmount
        return () => {
            if (smootherRef.current) {
                smootherRef.current.kill()
                smootherRef.current = null
            }
        }
    }, [])

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content" ref={scrollerRef}>
                {children}
            </div>
        </div>
    )
}
