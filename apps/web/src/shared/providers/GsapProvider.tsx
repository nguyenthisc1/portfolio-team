'use client'

import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
import { useGlobal } from '../stores/global'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    children: React.ReactNode
}

export function GsapProvider({ children }: Props): React.JSX.Element {
    const lenisRef = useRef<Lenis | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1 })
        lenisRef.current = lenis

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        function updateScrollTrigger() {
            ScrollTrigger.update()
        }

        lenis.on('scroll', updateScrollTrigger)

        ScrollTrigger.defaults({ markers: false })
        ScrollTrigger.config({ ignoreMobileResize: true })

        // Setup ScrollTrigger's scrollerProxy
        if (ScrollTrigger.scrollerProxy) {
            ScrollTrigger.scrollerProxy(document.body, {
                scrollTop(value) {
                    if (typeof value !== 'undefined') {
                        lenis.scrollTo(value, { immediate: true })
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
        }

        // Stop/start Lenis based on isAccess
        if (isAccess) {
            lenis.stop()
        } else {
            lenis.start()
        }

        return () => {
            lenis.off('scroll', updateScrollTrigger)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [isAccess])

    return <>{children}</>
}
