'use client'

import { useGSAP } from '@gsap/react'
import React, { JSX, useRef } from 'react'
import { setupHeadingAnimation } from '@/features/animations/animation'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    text: string
    className: string
    as?: HeadingLevel
}

export default function Heading({ text, className, as = 1, ...props }: Props) {
    const Tag = `h${as}` as keyof JSX.IntrinsicElements
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!ref.current) return
            setupHeadingAnimation(ref.current)
        },
        { scope: ref },
    )
    return (
        <div ref={ref} className="tt-heading-wrapper" {...props}>
            {React.createElement(Tag, { className: `tt-heading-stroke ${className}` }, text)}
            <span className={`tt-heading-filled ${className}`}>{text}</span>
        </div>
    )
}
