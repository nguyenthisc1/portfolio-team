'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import AboutImageCard from './AboutImageCard'
import Heading from './Heading'

const aboutList = [
    {
        image: '/images/team-vu.png',
        name: 'Tran Le Hoang Vu',
        position: 'LEADER OF WEBSITE TEAM',
        experience: 6,
        projects: 10,
        customers: 100,
    },
    {
        image: '/images/team-vu.png',

        name: 'John Doe',
        position: 'BACKEND DEVELOPER',
        experience: 5,
        projects: 12,
        customers: 90,
    },
    {
        image: '/images/team-vu.png',
        name: 'Lisa Nguyen',
        position: 'UI/UX DESIGNER',
        experience: 3,
        projects: 7,
        customers: 60,
    },
]

export default function About() {
    const ref = useRef<HTMLDivElement>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const [activeIndex, setActiveIndex] = useState(0)

    useGSAP(() => {
        if (!ref.current) return

        // const timeline = setupAboutAnimation();
    }, [isAccess])

    return (
        <section ref={ref} id="about" aria-labelledby="about-team-heading" className="mb-32">
            <div className="text-primary mb-20 text-center uppercase">
                <Heading
                    id="about-team-heading"
                    as={2}
                    text={' About Team'}
                    className={'h2 uppercase'}
                />
            </div>

            <div className="container">
                <div className="relative flex h-screen items-center">
                    <div className="space-y-16">
                        <article className="grid grid-cols-1 gap-36 lg:grid-cols-2">
                            {aboutList.map((item, idx) => (
                                <figure
                                    key={item.name}
                                    className={`relative mb-6 rounded-4xl bg-neutral-800 pt-10 ${
                                        idx !== activeIndex ? 'hidden' : ''
                                    }`}
                                >
                                    <img
                                        className="size-full"
                                        src={item.image}
                                        alt={`${item.name} Portrait`}
                                        width={100}
                                        height={100}
                                    />
                                    <div className="absolute top-0 right-0 left-0 space-y-5 pt-6 text-center">
                                        <figcaption className="text-primary h4 uppercase">
                                            {item.name}
                                        </figcaption>
                                        <p className="uppercase">{item.position}</p>
                                    </div>
                                </figure>
                            ))}
                            <ul className="relative">
                                {aboutList.map((item, idx) => {
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
                                            key={item.name}
                                            className={`flex flex-wrap gap-y-24 opacity-0 transition-opacity duration-500 ${idx != 0 && 'absolute inset-0'} ${idx == activeIndex && '!opacity-100'} `}
                                        >
                                            {stats.map((stat, idx) => (
                                                <li
                                                    key={stat.label}
                                                    className={` ${
                                                        idx === 0
                                                            ? 'flex w-full flex-col space-y-5'
                                                            : 'flex w-1/2 flex-col space-y-5'
                                                    } `}
                                                >
                                                    <strong className="text-primary whitespace-nowrap">
                                                        <span className="h2">{stat.value}</span>{' '}
                                                        <span className="h3">{stat.unit}</span>
                                                    </strong>
                                                    <p className="uppercase">{stat.label}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                })}
                            </ul>
                        </article>

                        <div className="absolute bottom-0 w-full">
                            <AboutImageCard
                                data={aboutList}
                                onSelect={setActiveIndex}
                                activeIndex={activeIndex}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// import React from 'react'

// export default function AboutImageCard() {

//     return (<div className='about-image-card'>
//         <ul
//             style={{
//                 // CSS custom properties must be strings and camelCase or quoted
//                 ['--offset-y' as any]: '65',
//                 ['--distance' as any]: '50',
//                 ['--rotate' as any]: '-5',
//                 ['--swatch-count' as any]: '4',
//                 ['--power' as any]: '120'
//             }}
//         >
//             {Array.from({ length: 4 }).map((_, idx) => (
//                 <li key={idx}>
//                     <button>
//                         <figure className="relative bg-neutral-800 mb-6">
//                             <img
//                                 className="size-full"
//                                 src="/images/team-vu.png"
//                                 alt="Tran Le Hoang Vu Portrait"
//                                 width={100}
//                                 height={100}
//                             />
//                             {/* <div className="absolute right-0 bottom-0 left-0 space-y-5 pb-10 text-center">
//                                 <figcaption className="text-primary h4 uppercase">
//                                     Tran Le Hoang Vu
//                                 </figcaption>
//                                 <p className="text-2xl uppercase">LEADER OF WEBSITE TEAM</p>
//                             </div> */}
//                         </figure>
//                     </button>

//                 </li>
//             ))}
//         </ul>

//     </div >)

// }
