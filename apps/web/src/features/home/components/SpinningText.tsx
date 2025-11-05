'use client'

import { setupSpinningText } from '@/features/animations/animation'
import { useGSAP } from '@gsap/react'
import React, { JSX, useRef } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    text: string
    className?: string
    as?: HeadingLevel
}

export default function SpinningText({ text, className, as = 1, ...props }: Props) {
    const Tag = `h${as}` as keyof JSX.IntrinsicElements

    const textRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!textRef.current) return
        const cleanup = setupSpinningText(textRef.current)
        return () => {
            if (cleanup) cleanup()
        }
    }, [text])
    return (
        <div className={`text-primary spinning-text uppercase ${className || ''}`} {...props}>
            {React.createElement(Tag, { ref: textRef }, React.createElement('span', null, text))}
        </div>
    )
}
