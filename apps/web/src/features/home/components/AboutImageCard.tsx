'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { Pane } from 'tweakpane'

const config = {
    theme: 'system',
    swatches: 4,
    threshold: 120,
    start: 120,
    distance: 90,
    rotation: -5,
    out: 'power2.out',
    in: 'power4.in',
}

export default function AboutImageCard() {
    const listRef = useRef<HTMLUListElement>(null)
    const setters = useRef<any[]>([])

    useEffect(() => {
        const list = listRef.current
        if (!list) return

        const eases = {
            in: gsap.parseEase(config.in),
            out: gsap.parseEase(config.out),
        }

        const generateSwatches = () => {
            setters.current.length = 0
            list.innerHTML = `
        ${new Array(config.swatches)
            .fill('')
            .map((_, index) => {
                const color = `hsl(0, 0%, ${Math.round(
                    (0.25 + (index / config.swatches) * 0.75) * 100,
                )}%)`
                return `
                <li style="--color: ${color}; --i: ${index};">
                  <button data-color="${color}">
                    <span>${color}</span>
                  </button>
                </li>
              `
            })
            .join('')}
      `
            list.style.setProperty('--swatch-count', config.swatches.toString())
        }

        const syncWave = (event: any) => {
            let x = event.x
            if (event.type === 'focus') {
                x = event.target.getBoundingClientRect().left
            }
            for (let i = 0; i < list.children.length; i++) {
                if (!setters.current[i]) {
                    setters.current[i] = gsap.utils.pipe(
                        ({ distance, width }: any) => {
                            const clamped = gsap.utils.clamp(
                                -config.threshold,
                                config.threshold,
                                distance + width * 0.5,
                            )
                            return { clamped, width }
                        },
                        ({ clamped, width }: any) => {
                            const mapped = gsap.utils.mapRange(
                                -config.threshold,
                                config.threshold,
                                -1,
                                1,
                            )(clamped)
                            return { mapped, active: Math.abs(clamped) <= width * 0.4 }
                        },
                        ({ mapped, active }: any) => {
                            const offset = active ? 0 : 0
                            return mapped > 0
                                ? 1 - eases.in(mapped) - offset
                                : 1 - eases.out(Math.abs(mapped)) - offset
                        },
                        gsap.quickSetter(list.children[i] as HTMLElement, '--power') as any,
                    )
                }
                const child = list.children[i] as HTMLElement
                const { left, width } = child.getBoundingClientRect()
                setters.current[i]({
                    distance: x - (left + width * 0.5),
                    width,
                })
            }
        }

        const settleWave = () => {
            for (const setter of setters.current) setter(0)
        }

        const copyColor = (event: any) => {
            if (event.target.tagName === 'BUTTON') {
                navigator.clipboard
                    .writeText(event.target.dataset.color)
                    .then(() => {
                        const markup = event.target.innerHTML
                        event.target.innerHTML = '<span>Copied!</span>'
                        setTimeout(() => {
                            event.target.innerHTML = markup
                        }, 2000)
                    })
                    .catch((err) => {
                        console.error('Failed to copy text to clipboard:', err)
                    })
            }
        }

        list.addEventListener('click', copyColor)
        list.addEventListener('pointermove', syncWave)
        list.addEventListener('pointerleave', settleWave)
        list.addEventListener('focus', syncWave, true)
        list.addEventListener('blur', settleWave, true)
        // Add active class to clicked item and remove from others
        // Fix: Add class "active" to clicked <li> and remove from others on click
        list.addEventListener('click', (event: any) => {
            const li = event.target.closest('li')
            if (li && li.parentElement === list) {
                // Remove "active" from all items
                Array.from(list.children).forEach((child) => child.classList.remove('active'))
                // Add "active" to the clicked item
                li.classList.add('active')
            }
        })
        // Tweakpane
        const ctrl = new Pane({
            title: 'Config',
            expanded: false,
        }) as any

        const update = () => {
            document.documentElement.dataset.theme = config.theme
            list.style.setProperty('--offset-y', config.start.toString())
            list.style.setProperty('--distance', config.distance.toString())
            list.style.setProperty('--rotate', config.rotation.toString())
            eases.in = gsap.parseEase(config.in)
            eases.out = gsap.parseEase(config.out)
        }

        const sync = (event: any) => {
            if (
                !(document as any).startViewTransition ||
                event.target.controller.view.labelElement.innerText !== 'Theme'
            )
                return update()
            ;(document as any).startViewTransition(() => update())
        }

        const easings = {
            none: 'none',
            'power1.in': 'power1.in',
            'power2.in': 'power2.in',
            'power3.in': 'power3.in',
            'power4.in': 'power4.in',
            'power1.out': 'power1.out',
            'power2.out': 'power2.out',
            'power3.out': 'power3.out',
            'power4.out': 'power4.out',
            'power1.inOut': 'power1.inOut',
            'power2.inOut': 'power2.inOut',
            'power3.inOut': 'power3.inOut',
            'power4.inOut': 'power4.inOut',
            'back.in': 'back.in',
            'back.out': 'back.out',
            'back.inOut': 'back.inOut',
            'sine.in': 'sine.in',
            'sine.out': 'sine.out',
            'sine.inOut': 'sine.inOut',
            'circ.in': 'circ.in',
            'circ.out': 'circ.out',
            'circ.inOut': 'circ.inOut',
        }

        ctrl.addBinding(config, 'threshold', {
            label: 'Threshold',
            min: 50,
            max: 400,
            step: 1,
        })
        ctrl.addBinding(config, 'in', {
            label: 'Ease In',
            options: easings,
        })
        ctrl.addBinding(config, 'out', {
            label: 'Ease Out',
            options: easings,
        })
        ctrl.addBinding(config, 'start', {
            min: 50,
            max: 90,
            step: 1,
            label: 'Start',
        })
        ctrl.addBinding(config, 'distance', {
            min: 10,
            max: 60,
            step: 1,
            label: 'Travel',
        })
        ctrl.addBinding(config, 'rotation', {
            min: -15,
            max: 15,
            step: 1,
            label: 'Rotate',
        })
        ctrl.addBinding(config, 'swatches', {
            label: 'Count',
            min: 6,
            max: 20,
            step: 1,
        }).on('change', () => generateSwatches())
        ctrl.addBinding(config, 'theme', {
            label: 'Theme',
            options: {
                System: 'system',
                Light: 'light',
                Dark: 'dark',
            },
        })
        ctrl.on('change', sync)

        update()
        generateSwatches()

        // cleanup
        return () => {
            list.removeEventListener('click', copyColor)
            list.removeEventListener('pointermove', syncWave)
            list.removeEventListener('pointerleave', settleWave)
            list.removeEventListener('focus', syncWave, true)
            list.removeEventListener('blur', settleWave, true)
            ctrl.dispose()
        }
    }, [])

    return (
        <div className={`about-image-card`} style={{ cursor: 'pointer' }}>
            <ul className="swatches" ref={listRef}></ul>
            {/* Optionally, indicate "active" visually: */}
            {/* {active && <div className="active-indicator">Active</div>} */}
        </div>
    )
}
