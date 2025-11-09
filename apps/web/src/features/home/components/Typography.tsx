'use client'

import { setupSplitLinesAnimation } from '@/features/home/animations/animation'
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

interface Props {
    text: string
    className?: string
}

export default function Typography({ text, className }: Props) {
    const textRef = useRef<HTMLDivElement | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    useGSAP(() => {
        if (!textRef.current && !isAccess) return
        const cleanup = setupSplitLinesAnimation(textRef.current!)
        return () => {
            if (cleanup) cleanup()
        }
    }, [isAccess])

    return (
        <div ref={textRef} className={className}>
            {text}
        </div>
    )
}
