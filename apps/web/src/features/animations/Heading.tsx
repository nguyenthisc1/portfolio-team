'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import React, { JSX, useRef } from 'react'
gsap.registerPlugin(ScrollTrigger)

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
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 70%',
                    end: 'bottom top',
                    scrub: true,
                    // markers: true,
                },
            })

            const filledElement = ref.current.querySelector('.tt-heading-filled')
            if (filledElement) {
                tl.to(filledElement, {
                    clipPath: 'polygon(-5% 0%, 105% 0%, 105% 120%, -5% 120%)',
                })
            }
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
