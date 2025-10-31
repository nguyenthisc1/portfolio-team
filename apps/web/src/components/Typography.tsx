'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { setupSplitLinesAnimation } from '@/features/home/animations/animation'

interface Props {
    text: string
    className: string
}

export default function Typography({ text, className }: Props) {
    const textRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!textRef.current) return
        const cleanup = setupSplitLinesAnimation(textRef.current)
        return () => {
            if (cleanup) cleanup()
        }
    }, [text])

    return (
        <div ref={textRef} className={className}>
            {text}
        </div>
    )
}
