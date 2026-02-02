'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import Heading from './Heading'

import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AboutSection } from 'types'

gsap.registerPlugin(Flip)

// Sync Person interface with AboutSection's teamMembers structure
interface Person {
    image: string
    name: string
    position: string
    experience: number
    projects: number
    customers: number
    color?: string
    [key: string]: any
}

interface DisplayItem {
    item: Person
    originalIdx: number
}

// Memoized sub-components for presentational clarity

const MemberFigure = memo(function MemberFigure({
    item,
    isActive,
    isFirst,
}: {
    item: Person
    isActive: boolean
    isFirst: boolean
}) {
    return (
        <div
            style={{
                position: !isFirst ? 'absolute' : undefined,
                inset: !isFirst ? 0 : undefined,
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
                transition: 'opacity 0.5s ease',
                height: '100%',
            }}
        >
            <figure
                className={`tt-image relative mb-6 h-full rounded-4xl bg-neutral-800 pt-10 pb-[100%] transition-opacity duration-500 md:pb-[55%] lg:pb-[80%] xl:pb-[100%]`}
                style={{}}
            >
                <img
                    src={item.image}
                    alt={`${item.name} Portrait`}
                    width={100}
                    height={100}
                    className="mt-20 object-top"
                />
                <div className="absolute top-0 right-0 left-0 space-y-5 pt-6 text-center">
                    <figcaption className="text-primary h4 uppercase">{item.name}</figcaption>
                    <p className="uppercase">{item.position}</p>
                </div>
            </figure>
        </div>
    )
})

const MemberStats = memo(function MemberStats({
    item,
    isActive,
    isFirst,
}: {
    item: Person
    isActive: boolean
    isFirst: boolean
}) {
    const stats = [
        {
            label: 'Years Experience',
            value: item.experience,
            unit: '+',
        },
        {
            label: 'Projects',
            value: item.projects,
            unit: '+',
        },
        {
            label: 'Customers',
            value: item.customers,
            unit: '+',
        },
    ]

    return (
        <ul
            className={`grid h-full grid-cols-3 gap-y-24 opacity-0 transition-opacity duration-500 lg:flex lg:flex-wrap lg:justify-center ${!isFirst && 'absolute inset-0'} ${isActive && '!opacity-100'} `}
        >
            {stats.map((stat, statIdx) => (
                <li
                    key={stat.label}
                    className={`h-fit justify-self-center ${
                        statIdx === 0
                            ? 'flex w-full flex-col space-y-5'
                            : 'flex w-1/2 flex-col space-y-5'
                    }`}
                >
                    <strong className="text-primary whitespace-nowrap">
                        <span className="h2 max-md:!text-4xl">{stat.value}</span>{' '}
                        <span className="h3 max-md:!text-4xl">{stat.unit}</span>
                    </strong>
                    <p className="uppercase">{stat.label}</p>
                </li>
            ))}
        </ul>
    )
})

const SwatchList = memo(function SwatchList({
    displayData,
    activeIndex,
    handleSelect,
    listRef,
}: {
    displayData: DisplayItem[]
    activeIndex: number
    handleSelect: (idx: number) => void
    listRef: React.RefObject<HTMLUListElement | null>
}) {
    return (
        <ul
            className="swatches"
            ref={listRef as React.RefObject<HTMLUListElement>}
            style={{
                ['--swatch-count' as any]: displayData.length,
            }}
        >
            {displayData.map(({ item, originalIdx }, displayIdx) => {
                const color = item.color || '#000'
                return (
                    <li
                        key={item.name}
                        style={{ ['--color' as any]: color, ['--i' as any]: displayIdx }}
                        data-active={originalIdx === activeIndex}
                        data-flip-id={`card-${originalIdx}`}
                    >
                        <button
                            onClick={() => handleSelect(originalIdx)}
                            type="button"
                            tabIndex={0}
                            aria-label={`Select ${item.name}`}
                        >
                            <div className="size-full">
                                <figure className="relative w-full space-y-2 pt-4 text-center">
                                    <p className="text-primary h5 uppercase">{item.name}</p>
                                    <p className="text-xs font-thin uppercase">{item.position}</p>
                                </figure>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
})

export default function About({ data }: { data: AboutSection }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const aboutList: Person[] = Array.isArray(data?.teamMembers) ? data.teamMembers : []
    const ref = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    const flipState = useRef<Flip.FlipState | null>(null)
    const displayRef = useRef<DisplayItem[]>([])
    const isAccess = useGlobal((state) => state.isAccess)
    const [activeIndex, setActiveIndex] = useState(aboutList.length > 0 ? aboutList.length - 1 : 0)

    // Pin section on scroll
    useGSAP(() => {
        if (!isAccess || !ref.current) return

        const container = ref.current.querySelector('.about-wrapper')
        if (!container) return

        gsap.to(container, {
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: '+=500',
                pin: true,
                pinSpacing: true,
                scrub: false,
                anticipatePin: 1.5,
                onEnter: () => container.classList.add('active-scroll'),
                onLeave: () => container.classList.remove('active-scroll'),
                onEnterBack: () => container.classList.add('active-scroll'),
                onLeaveBack: () => container.classList.remove('active-scroll'),
            },
        })
    }, [isAccess])

    // Handles selection and triggers FLIP animation states
    const handleSelect = (index: number) => {
        if (listRef.current) {
            flipState.current = Flip.getState(listRef.current.querySelectorAll('li'))
        }
        setActiveIndex(index)
    }

    // Memoized display data, reordering so active is always last (top in UI)
    const displayData = useMemo(() => {
        if (!aboutList.length) return []

        // On first render or if displayRef.current not set
        if (displayRef.current.length === 0) {
            displayRef.current = aboutList.map((item, idx) => ({
                item,
                originalIdx: idx,
            }))
            return displayRef.current
        }

        const current = [...displayRef.current]

        const activePos = current.findIndex((i) => i.originalIdx === activeIndex)

        if (activePos === -1) return current

        const [removed] = current.splice(activePos, 1)
        current.push(removed!)

        displayRef.current = current
        return current
    }, [activeIndex, aboutList])

    // FLIP animation after state changes
    useLayoutEffect(() => {
        if (!flipState.current) return

        Flip.from(flipState.current, {
            duration: 0.6,
            ease: 'power3.inOut',
            stagger: 0.05,
        })

        flipState.current = null
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayData.map((i) => i.originalIdx).join('-')])

    return (
        <section
            ref={ref}
            id="about"
            aria-labelledby="about-team-heading"
            className="overflow-hidden lg:mb-32"
        >
            <div className="text-primary mb-20 text-center uppercase">
                <Heading
                    id="about-team-heading"
                    as={2}
                    text={data?.title ?? 'About Team'}
                    className={'h2 uppercase'}
                />
            </div>

            <div className="container">
                <div className="about-wrapper relative flex h-screen lg:items-center xl:min-h-[850px]">
                    <div className="w-full space-y-16 max-lg:pt-4">
                        <article className="grid grid-cols-1 max-xl:h-[60vh] lg:grid-cols-2 lg:gap-36">
                            <div className="relative">
                                {aboutList.map((item, idx) => (
                                    <MemberFigure
                                        key={item.name}
                                        item={item}
                                        isActive={idx === activeIndex}
                                        isFirst={idx === 0}
                                    />
                                ))}
                            </div>

                            <ul className="relative max-lg:mt-6 lg:flex lg:items-center">
                                {aboutList.map((item, idx) => (
                                    <MemberStats
                                        key={item.name}
                                        item={item}
                                        isActive={idx === activeIndex}
                                        isFirst={idx === 0}
                                    />
                                ))}
                            </ul>
                        </article>

                        <div className="w-full max-lg:h-[50vh] lg:absolute lg:bottom-0">
                            <div className="about-list relative">
                                <div
                                    className="about-card min-h-full"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <SwatchList
                                        displayData={displayData}
                                        activeIndex={activeIndex}
                                        handleSelect={handleSelect}
                                        listRef={listRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
