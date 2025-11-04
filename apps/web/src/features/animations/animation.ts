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

export function setupCardSkillAnimation(scopeElement: HTMLElement) {
    const cards = Array.from(scopeElement.querySelectorAll('.glint-card'))

    const floatingAnim = gsap.to(cards, {
        yPercent: -5,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.inOut',
        stagger: {
            each: 0.15,
            amount: 0.5,
            from: 'random',
        },
        yoyo: true,
        paused: true,
    })

    const timelineDefaults = {
        ease: 'power1.inOut',
    }

    const showCardTl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
            trigger: scopeElement,
            id: 'skill-pin',
            start: 'top 10%',
            end: '200% top',
            pin: true,
            scrub: true,
            // markers: true,
            onEnterBack: () => floatingAnim.play(),
        },
    })

    const introTl = gsap.timeline({
        defaults: timelineDefaults,
        scrollTrigger: {
            trigger: scopeElement,
            id: 'intro',
            start: '-30% 40%',
            end: '-10% top',
            scrub: true,
            // markers: true,
            onEnter: () => floatingAnim.play(),
            onLeaveBack: () => floatingAnim.pause(),
        },
    })

    const introCardConfigs = [
        {
            from: { y: '-120%', x: '130%', rotate: '-10deg', scale: 0.4, opacity: 0 },
            to: { y: '30%', rotate: '-5deg', scale: 1, opacity: 1 },
            delay: 0,
        },
        {
            from: { y: '-130%', x: '20%', rotate: '2deg', scale: 0.4, opacity: 0 },
            to: { y: '20%', rotate: '0deg', scale: 1, opacity: 1 },
            delay: 0.03,
        },
        {
            from: { y: '-140%', x: '-90%', rotate: '6deg', scale: 0.4, opacity: 0 },
            to: { y: '10%', rotate: '3deg', scale: 1, opacity: 1 },
            delay: 0.06,
        },
    ]

    introCardConfigs.forEach(({ from, to, delay }, idx) => {
        if (cards[idx]) {
            introTl.fromTo(cards[idx]!, from, to, delay)
        }
    })

    const cardConfigs = [
        { yStart: '30%', index: 0, delay: 0, initialDuration: 0.1, yTo: '-20%' },
        { yStart: '30%', index: 1, delay: 0.03, initialDuration: 0.1, yTo: '-20%' },
        { yStart: '30%', index: 2, delay: 0.06, initialDuration: 0.1, yTo: '-20%' },
    ]

    cardConfigs.forEach(({ yStart, index, delay, initialDuration = 0.1, yTo }) => {
        showCardTl
            .to(
                cards[index]!,
                {
                    y: yStart,
                    duration: initialDuration,
                },
                delay,
            )
            .to(cards[index]!, { y: yTo, rotate: 0 }, index === 0 ? '>' : `>+=${delay.toFixed(2)}`)
            .to(
                cards[index]!,
                {
                    transformOrigin: 'center',
                    rotateY: -190,
                    x: 0,
                },
                index === 0 ? '>' : `>+=${delay.toFixed(2)}`,
            )
            .to(
                cards[index]!,
                { transformOrigin: 'center', rotateY: -180 },
                index === 0 ? '>' : `>+=${delay.toFixed(2)}`,
            )
    })
}

export function setupLoadingPage(
    texts: string[],
    onTextChange: (index: number) => void,
    onLoadingChange?: (loading: boolean) => void,
) {
    const obj = { i: 0 }
    const tl = gsap.to(obj, {
        i: texts.length,
        duration: texts.length * 0.3,
        ease: 'none',
        repeat: -1,
        modifiers: {
            i: (i) => Math.floor(Number(i)) % texts.length,
        },
        onUpdate: () => {
            onTextChange(Math.floor(obj.i) % texts.length)
        },
    })

    const handleLoaded = () => {
        if (document.readyState === 'complete') {
            // Wait for one more "run" of the animation before ending loading
            setTimeout(
                () => {
                    tl.pause(0)
                    onLoadingChange?.(false)
                },
                texts.length * 0.3 * 1000,
            )
        }
    }

    window.addEventListener('load', handleLoaded)
    handleLoaded()

    // Return cleanup handler
    return () => {
        window.removeEventListener('load', handleLoaded)
        tl.kill()
    }
}
