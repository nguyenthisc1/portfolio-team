'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
// Add Lenis import
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    children: React.ReactNode
}

export function GsapProvider({ children }: Props): React.JSX.Element {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        const lenis = new Lenis({
            // smooth: true,
        })
        lenisRef.current = lenis

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Sync Lenis with ScrollTrigger
        function updateScrollTrigger() {
            ScrollTrigger.update()
        }
        lenis.on('scroll', updateScrollTrigger)

        ScrollTrigger.defaults({ markers: false })
        ScrollTrigger.config({ ignoreMobileResize: true })

        // Use Lenis as scroller for ScrollTrigger
        ScrollTrigger.scrollerProxy?.(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value!, { immediate: true })
                }
                return lenis.scroll
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
            },
        })

        return () => {
            lenis.off('scroll', updateScrollTrigger)
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
