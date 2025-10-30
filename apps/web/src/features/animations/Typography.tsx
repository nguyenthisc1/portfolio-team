'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText)

interface Props {
    text: string
    className: string
}

type SplitTextInstance = {
    chars: Element[]
    revert: () => void
    [key: string]: any
}

export default function Typography({ text, className }: Props) {
    const textRef = useRef<HTMLDivElement | null>(null)
    const splitTextRef = useRef<SplitTextInstance | null>(null)

    useGSAP(() => {
        if (textRef.current) {
            // Create a new SplitText instance
            splitTextRef.current = new SplitText(textRef.current, {
                type: 'lines',
            }) as unknown as SplitTextInstance

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 70%',
                    end: 'bottom 20%',
                    scrub: true,
                    // markers: true,
                },
            })

            // Example animation: fade in characters
            tl.from(splitTextRef.current.lines, {
                opacity: 0.1,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power1.out',
            })
        }

        // Cleanup function: Revert SplitText when the component unmounts
        return () => {
            if (splitTextRef.current && typeof splitTextRef.current.revert === 'function') {
                splitTextRef.current.revert()
                splitTextRef.current = null
            }
        }
    }, [text]) // Re-run effect if 'text' prop changes

    return (
        <div ref={textRef} className={className}>
            {text}
        </div>
    )
}
