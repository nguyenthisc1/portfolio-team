'use client'

import { useIsMobile } from '@/shared/hooks/useMobile'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { SkillCategory } from 'types'
import { setupCardSkillAnimation } from '../animations/animation'
import Heading from './Heading'

type SkillCardProps = {
    id: string
    imgSrc: string
    imgAlt: string
    title: string
    items: string[]
    index?: number
}

function CardSkill({ id, imgSrc, imgAlt, title, items, index = 0 }: SkillCardProps) {
    return (
        <div className="glint-card-hover">
            <article
                style={{ zIndex: index + 1 }}
                aria-labelledby={id}
                className="glint-card h-[500px]"
            >
                <div className="glint-card-front max-lg:hidden">
                    <div className="glint-card-wrapper">
                        <div className="glint-card-content">
                            <header>
                                <img
                                    className="w-48 object-contain"
                                    src={imgSrc}
                                    alt={imgAlt}
                                    width={64}
                                    height={64}
                                />
                                <h5 className="glint-card-title" id={id}>
                                    {title}
                                </h5>
                            </header>
                        </div>
                    </div>
                </div>

                <div className="glint-card-back max-lg:!rotate-y-0">
                    <div className="glint-card-wrapper">
                        <div className="glint-card-content">
                            <ul className="skill-card">
                                {items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default function Skill({ data }: { data: SkillCategory[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile({ breakpoint: 1023 })

    useGSAP(
        () => {
            if (!ref.current) return
            setupCardSkillAnimation(ref.current)
        },
        { scope: ref },
    )

    // For each skill category, get img from local (based on title) and get title from data
    const skillData = (data || []).map((cat, idx) => ({
        id: `skill-${idx}`,
        imgSrc: `/images/img_skill_${idx + 1}.svg`,
        imgAlt: cat.title,
        title: cat.title,
        items: cat.skills,
    }))

    return (
        <section
            ref={ref}
            aria-labelledby="skills-heading"
            className="lg:flex lg:h-screen lg:items-center"
        >
            <div className="mx-auto mb-20 max-w-5xl text-center lg:hidden">
                <Heading as={2} text="Skills" className="h2 uppercase" />
            </div>

            <div className="container">
                {!isMobile && (
                    <div className="glint-card-desktop grid grid-cols-1 gap-x-20 gap-y-10 lg:grid-cols-3">
                        {skillData.map((skill, idx) => (
                            <CardSkill key={skill.id} index={skillData.length - idx} {...skill} />
                        ))}
                    </div>
                )}

                {isMobile && (
                    <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-10">
                        {skillData.map((skill, idx) => (
                            <CardSkill key={skill.id} index={skillData.length - idx} {...skill} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
