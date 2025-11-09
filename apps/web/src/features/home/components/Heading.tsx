'use client'

import { useGSAP } from '@gsap/react'
import React, { JSX, useRef } from 'react'
import { setupHeadingAnimation } from '@/features/home/animations/animation'
import { useGlobal } from '@/shared/stores/global'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    text: string
    className: string
    as?: HeadingLevel
}

export default function Heading({ text, className, as = 1, ...props }: Props) {
    const Tag = `h${as}` as keyof JSX.IntrinsicElements
    const ref = useRef<HTMLDivElement>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    useGSAP(() => {
        if (!ref.current && !isAccess) return
        setupHeadingAnimation(ref.current!)
    }, [isAccess])
    return (
        <div ref={ref} className="tt-heading-wrapper" {...props}>
            {React.createElement(Tag, { className: `tt-heading-stroke ${className}` }, text)}
            <span className={`tt-heading-filled ${className}`}>{text}</span>
        </div>
    )
}
