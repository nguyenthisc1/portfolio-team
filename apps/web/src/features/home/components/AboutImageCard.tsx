'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

const config = {
    theme: 'system',
    threshold: 100,
    start: 30,
    distance: 16,
    rotation: -5,
    out: 'power2.out',
    in: 'power4.in',
}

interface Props {
    data: any
    activeIndex: number
    onSelect: Dispatch<SetStateAction<number>>
}

export default function AboutImageCard({ data, activeIndex, onSelect }: Props) {
    const listRef = useRef<HTMLUListElement>(null)
    const setters = useRef<any[]>([])
    const isAccess = useGlobal((state) => state.isAccess)

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
        ${data
            .map((item: any, idx: number) => {
                const color = `hsl(0, 0%, ${Math.round(
                    (0.25 + (idx / data.length) * 0.75) * 100,
                )}%)`
                // Add "active" class to the <li> if it's the activeIndex
                return `
                <li style="--color: ${color}; --i: ${idx};" class="${idx === activeIndex ? 'active' : ''}">
                  <button>
                    <div class="size-full">
                      <figure class="relative w-full space-y-2 pt-4 text-center">
                        <p class="text-primary h5 uppercase">
                            Tran Le Hoang Vu
                        </p>
                        <p class="text-xs font-thin uppercase">LEADER OF WEBSITE TEAM</p>
                    </figure>
                    </div>
                  </button>
                </li>
              `
            })
            .join('')}
      `
            list.style.setProperty('--swatch-count', data.length.toString())
        }

        const syncWave = (event: any) => {
            let x = event.x
            if (event.type === 'focus') {
                x = event.target.getBoundingClientRect().left
            }
            for (let i = 0; i < list.children.length; i++) {
                if (!setters.current[i]) {
                    const pipeline = gsap.utils.pipe(
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
                            return { mapped, active: Math.abs(clamped) <= width * 1 }
                        },
                        ({ mapped, active }: any) => {
                            const offset = active ? 0 : 0
                            return mapped > 0
                                ? 1 - eases.in(mapped) - offset
                                : 1 - eases.out(Math.abs(mapped)) - offset
                        },
                    )

                    const quick = gsap.quickSetter(
                        list.children[i] as HTMLElement,
                        '--power',
                    ) as any

                    setters.current[i] = (input: any) => {
                        const power = pipeline(input)
                        quick(power)
                        if (power > 0.85) {
                            // onSelect(i)
                        }
                    }
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

        const chooseItem = (event: any) => {
            // if (event.target.tagName === 'BUTTON') {
            //     navigator.clipboard
            //         .writeText(event.target.dataset.color)
            //         .then(() => {
            //             const markup = event.target.innerHTML
            //             event.target.innerHTML = '<span>Copied!</span>'
            //             setTimeout(() => {
            //                 event.target.innerHTML = markup
            //             }, 2000)
            //         })
            //         .catch((err) => {
            //             console.error('Failed to copy text to clipboard:', err)
            //         })
            // }
            const li = event.target.closest('li')
            if (li && li.parentElement === list) {
                // Remove "active" from all items
                Array.from(list.children).forEach((child) => child.classList.remove('active'))
                // Add "active" to the clicked item
                li.classList.add('active')
                // Set active index based on clicked <li>
                if (typeof onSelect === 'function') {
                    const idx = Array.from(list.children).indexOf(li)
                    if (idx !== -1) onSelect(idx)
                }
            }
        }

        list.addEventListener('click', chooseItem)
        list.addEventListener('pointermove', syncWave)
        list.addEventListener('pointerleave', settleWave)
        list.addEventListener('focus', syncWave, true)
        list.addEventListener('blur', settleWave, true)
        // Add active class to clicked item and remove from others
        // Fix: Add class "active" to clicked <li> and remove from others on click
        // Tweakpane
        // const ctrl = new Pane({
        //     title: 'Config',
        //     expanded: false,
        // }) as any

        const update = () => {
            document.documentElement.dataset.theme = config.theme
            list.style.setProperty('--offset-y', config.start.toString())
            list.style.setProperty('--distance', config.distance.toString())
            list.style.setProperty('--rotate', config.rotation.toString())
            eases.in = gsap.parseEase(config.in)
            eases.out = gsap.parseEase(config.out)
        }

        // const sync = (event: any) => {
        //     if (
        //         !(document as any).startViewTransition ||
        //         event.target.controller.view.labelElement.innerText !== 'Theme'
        //     )
        //         return update()
        //     ;(document as any).startViewTransition(() => update())
        // }

        // const easings = {
        //     none: 'none',
        //     'power1.in': 'power1.in',
        //     'power2.in': 'power2.in',
        //     'power3.in': 'power3.in',
        //     'power4.in': 'power4.in',
        //     'power1.out': 'power1.out',
        //     'power2.out': 'power2.out',
        //     'power3.out': 'power3.out',
        //     'power4.out': 'power4.out',
        //     'power1.inOut': 'power1.inOut',
        //     'power2.inOut': 'power2.inOut',
        //     'power3.inOut': 'power3.inOut',
        //     'power4.inOut': 'power4.inOut',
        //     'back.in': 'back.in',
        //     'back.out': 'back.out',
        //     'back.inOut': 'back.inOut',
        //     'sine.in': 'sine.in',
        //     'sine.out': 'sine.out',
        //     'sine.inOut': 'sine.inOut',
        //     'circ.in': 'circ.in',
        //     'circ.out': 'circ.out',
        //     'circ.inOut': 'circ.inOut',
        // }

        // ctrl.addBinding(config, 'threshold', {
        //     label: 'Threshold',
        //     min: 50,
        //     max: 400,
        //     step: 1,
        // })
        // ctrl.addBinding(config, 'in', {
        //     label: 'Ease In',
        //     options: easings,
        // })
        // ctrl.addBinding(config, 'out', {
        //     label: 'Ease Out',
        //     options: easings,
        // })
        // ctrl.addBinding(config, 'start', {
        //     min: 50,
        //     max: 90,
        //     step: 1,
        //     label: 'Start',
        // })
        // ctrl.addBinding(config, 'distance', {
        //     min: 10,
        //     max: 60,
        //     step: 1,
        //     label: 'Travel',
        // })
        // ctrl.addBinding(config, 'rotation', {
        //     min: -15,
        //     max: 15,
        //     step: 1,
        //     label: 'Rotate',
        // })
        // ctrl.addBinding(config, 'swatches', {
        //     label: 'Count',
        //     min: 6,
        //     max: 20,
        //     step: 1,
        // }).on('change', () => generateSwatches())
        // ctrl.addBinding(config, 'theme', {
        //     label: 'Theme',
        //     options: {
        //         System: 'system',
        //         Light: 'light',
        //         Dark: 'dark',
        //     },
        // })
        // ctrl.on('change', sync)

        update()
        generateSwatches()

        // Ensure the correct <li> is "active" on subsequent renders if activeIndex changes
        // (e.g. if parent changes activeIndex)
        if (list.children.length > 0 && typeof activeIndex === 'number') {
            Array.from(list.children).forEach((child) => child.classList.remove('active'))
            if (list.children[activeIndex]) {
                list.children[activeIndex].classList.add('active')
            }
        }

        // cleanup
        return () => {
            list.removeEventListener('click', chooseItem)
            list.removeEventListener('pointermove', syncWave)
            list.removeEventListener('pointerleave', settleWave)
            list.removeEventListener('focus', syncWave, true)
            list.removeEventListener('blur', settleWave, true)
            // ctrl.dispose()
        }
    }, [data, onSelect, activeIndex])

    return (
        <div className="about-image relative">
            {/* <ul className="about-info">
                {data.map((item: any, idx: number) => (
                    <li
                        key={item.name}
                        className={`absolute top-0 w-full opacity-0 ${activeIndex == idx && '!opacity-100'}`}
                    >
                        <div className="space-y-5 pb-10 text-center">
                            <figcaption className="text-primary h4 uppercase">
                                {item.name}
                            </figcaption>
                            <p className="text-2xl uppercase">{item.position}</p>
                        </div>
                    </li>
                ))}
            </ul> */}
            <div className="about-card min-h-full" style={{ cursor: 'pointer' }}>
                <ul className="swatches" ref={listRef}></ul>
            </div>
        </div>
    )
}
