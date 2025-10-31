'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register GSAP plugins once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText)
}

export function setupFooterAnimation(scopeElement: HTMLElement) {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: scopeElement,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            scrub: true,
        },
    })

    const contentWrappers = scopeElement.querySelectorAll('.footer-content-filled')
    contentWrappers.forEach((wrapper) => {
        timeline.to(
            wrapper,
            {
                clipPath: 'polygon(-5% 0%, 105% 0%, 105% 120%, -5% 120%)',
            },
            0,
        )
    })
}

export function setupHeadingAnimation(scopeElement: HTMLElement) {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: scopeElement,
            start: 'top 70%',
            end: 'bottom top',
            scrub: true,
        },
    })

    const filledElement = scopeElement.querySelector('.tt-heading-filled')
    if (filledElement) {
        timeline.to(filledElement, {
            clipPath: 'polygon(-5% 0%, 105% 0%, 105% 120%, -5% 120%)',
        })
    }
}

export function setupSplitLinesAnimation(scopeElement: HTMLElement) {
    // Create SplitText instance on the provided scope element
    const split = new SplitText(scopeElement, { type: 'lines' }) as unknown as {
        lines: Element[]
        revert: () => void
    }

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: scopeElement,
            start: 'top 70%',
            end: 'bottom 20%',
            scrub: true,
        },
    })

    timeline.from(split.lines, {
        opacity: 0.1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power1.out',
    })

    // Return cleanup handler for caller to use in effect cleanup
    return () => {
        if (typeof split.revert === 'function') split.revert()
    }
}
