'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register GSAP plugins once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText)
}

export function setupIntroHomeAnimation(scopeElement: HTMLElement) {
    const cleanups: (() => void)[] = []

    const timeline = gsap.timeline({ paused: true, delay: 0.5 })

    const introHeading = scopeElement.querySelector('.intro-heading') as HTMLElement | null
    if (introHeading) {
        gsap.set(introHeading, { autoAlpha: 0 })

        // Reveal with delay
        timeline.to(introHeading, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0)

        const cleanupSpinning = setupSpinningText(introHeading, 0.5)
        if (typeof cleanupSpinning === 'function') cleanups.push(cleanupSpinning)
    }

    const introDescription = scopeElement.querySelector('.intro-description') as HTMLElement | null
    if (introDescription) {
        const split = new SplitText(introDescription, { type: 'lines' }) as unknown as {
            lines: Element[]
            revert: () => void
        }

        timeline.from(
            split.lines,
            {
                autoAlpha: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power1.out',
            },
            0,
        )

        // Clean up SplitText afterwards to prevent DOM leak
        cleanups.push(() => {
            split.revert()
        })
    }

    // Make timelineRef compatibility:
    // Add .pause, .play, .cleanup directly onto timeline for ref forwarding like a real Timeline instance
    const withExtras = timeline as typeof timeline & {
        cleanup: () => void
    }
    withExtras.cleanup = () => {
        timeline.kill()
        cleanups.forEach((fn) => typeof fn === 'function' && fn())
    }

    return withExtras
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
            // end: 'bottom top',
            // scrub: true,
        },
    })

    const filledElement = scopeElement.querySelector('.tt-heading-filled')
    if (filledElement) {
        timeline.to(filledElement, {
            clipPath: 'polygon(-5% 0%, 105% 0%, 105% 120%, -5% 120%)',
            duration: 1,
            ease: 'power2.in',
        })
    }
}

export function setupSpinningText(scopeElement: HTMLElement, delay?: number) {
    const tl = gsap.timeline({ paused: true })

    const split = new SplitText(scopeElement, {
        type: 'lines, chars',
        linesClass: 'line',
        charsClass: 'char',
    }) as unknown as {
        chars: Element[]
        lines: Element[]
        revert: () => void
    }

    split.lines.forEach((line, lineIdx) => {
        const lineChars = Array.from(line.querySelectorAll('.char'))

        lineChars.forEach((obj) => {
            const txt = obj.textContent || ''
            // Create two clones, each with increasing yOffset: -100 (1st clone), -200 (2nd clone)
            const clone1 = `<div class="clone-text">${txt}</div>`
            const clone2 = `<div class="clone-text">${txt}</div>`
            const newHTML = `<div class="original-text">${txt}</div>${clone1}${clone2}`
            obj.innerHTML = newHTML

            const originalNode = obj.childNodes[0]
            const cloneNode1 = obj.childNodes[1]
            const cloneNode2 = obj.childNodes[2]

            // Assign a random direction and speed for each char
            const up = Math.random() < 0.5
            // random duration between 2 and 5 seconds per char
            const charDuration = 1 + Math.random() * 3

            // Set initial positions for original and clones based on direction
            const baseYOffset = up ? -100 : 100

            gsap.set(originalNode!, {
                yPercent: baseYOffset,
            })
            gsap.set(cloneNode1!, {
                yPercent: baseYOffset + (up ? -100 : 100),
            })
            gsap.set(cloneNode2!, {
                yPercent: baseYOffset + (up ? -200 : 200),
            })

            // Stagger based on line index
            const lineDelay = (typeof delay === 'number' ? delay : 0) + lineIdx * 0.2 // 0.2s delay per line

            const tween = gsap.to([originalNode, cloneNode1, cloneNode2], {
                yPercent: up ? `+=300` : `-=300`,
                ease: 'power2.inOut',
                duration: charDuration,
                delay: lineDelay,
            })

            tl.add(tween, lineIdx + 0.2)
        })
    })

    tl.play()

    return () => {
        if (typeof split.revert === 'function') split.revert()
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
            start: 'top 90%',
            end: 'bottom center',
            scrub: true,
            // markers: true,
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
        ease: 'sine.inOut',
        stagger: {
            each: 0.15,
            amount: 0.5,
            from: 'random',
        },
        yoyo: true,
        paused: true,
    })

    const timelineDefaults = {
        // ease: 'sine.inOut',
    }

    const showCardTl = gsap.timeline({
        defaults: {
            ease: 'power1.inOut',
        },
        scrollTrigger: {
            trigger: scopeElement,
            id: 'skill-pin',
            start: '10% 10%',
            end: '200% top',
            pin: true,
            scrub: true,
            // markers: true,
            onEnterBack: () => floatingAnim.play(),
        },
    })

    const introTl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: {
            trigger: scopeElement,
            id: 'intro',
            start: '-50% 30%',
            end: '-10% -20%',
            scrub: true,
            // markers: true,
            onEnter: () => floatingAnim.play(),
            onLeaveBack: () => floatingAnim.pause(),
        },
    })

    const introCardConfigs = [
        {
            from: { y: '-200%', x: '130%', rotate: '-10deg', scale: 0.4, opacity: 0 },
            to: { y: '30%', rotate: '-5deg', scale: 1, opacity: 1 },
            delay: 0,
        },
        {
            from: { y: '-210%', x: '20%', rotate: '2deg', scale: 0.4, opacity: 0 },
            to: { y: '20%', rotate: '0deg', scale: 1, opacity: 1 },
            delay: 0.03,
        },
        {
            from: { y: '-220%', x: '-90%', rotate: '6deg', scale: 0.4, opacity: 0 },
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
        { yStart: '30%', index: 0, delay: 0, initialDuration: 0, yTo: '-10%' },
        { yStart: '30%', index: 1, delay: 0.03, initialDuration: 0, yTo: '-10%' },
        { yStart: '30%', index: 2, delay: 0.06, initialDuration: 0, yTo: '-10%' },
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
