import React from 'react'

type SkillData = {
    id: string
    imgSrc: string
    imgAlt: string
    title: string
    items: string[]
    index: number
}

const skillData: SkillData[] = [
    {
        id: 'strategy-skill',
        imgSrc: '/images/img_skill_1.svg',
        imgAlt: 'Strategy',
        title: 'Strategy',
        items: ['Visual Research', 'Wireframes', 'Content Mapping', 'User Flows', 'Sitemap'],
    },
    {
        id: 'design-skill',
        imgSrc: '/images/img_skill_2.svg',
        imgAlt: 'Design',
        title: 'Design',
        items: ['UI Design', 'UX Design', 'Design System', 'Prototype', 'Animation'],
    },
    {
        id: 'build-skill',
        imgSrc: '/images/img_skill_3.svg',
        imgAlt: 'Build',
        title: 'Build',
        items: ['Framer / Figma', 'Frontend / Backend', 'Shopify', 'WordPress', 'Haravan'],
    },
]

function CardSkill({ id, imgSrc, imgAlt, title, items, index }: SkillData) {
    return (
        <article style={{ zIndex: index + 1 }} aria-labelledby={id} className="glint-card">
            <div className="glint-card-content h-[500px]">
                <header className="flex min-h-full flex-col items-center justify-center">
                    <img
                        className="w-48 object-contain"
                        src={imgSrc}
                        alt={imgAlt}
                        width={64}
                        height={64}
                    />
                    <h5 className="absolute bottom-8 uppercase" id={id}>
                        {title}
                    </h5>
                </header>
                <ul className="hidden">
                    {items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </article>
    )
}

export default function Skill() {
    return (
        <div className="grid grid-cols-1 gap-x-20 gap-y-10 lg:grid-cols-3">
            {skillData.map((skill, idx) => (
                <CardSkill key={skill.id} index={idx} {...skill} />
            ))}
        </div>
    )
}
