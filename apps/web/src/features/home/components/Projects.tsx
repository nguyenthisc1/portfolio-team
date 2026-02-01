'use client'

import { useIsMobile } from '@/shared/hooks/useMobile'
import { ProjectsSection } from 'types'
import Heading from './Heading'
import Typography from './Typography'

export default function Projects({ data }: { data: ProjectsSection }) {
    const isMobile = useIsMobile()
    return (
        <section aria-labelledby="projects-heading" className="relative mb-44 space-y-10">
            <div className="container">
                <div className="mx-auto max-w-5xl text-center">
                    <Heading as={2} text={data.title} className="h2 uppercase" />
                </div>

                <div className="mx-auto mt-10 max-w-5xl lg:mt-[20%]">
                    <Typography
                        className="max-md:text-center md:mr-32 md:ml-auto md:max-w-xs"
                        text={data.description}
                    />
                </div>

                {isMobile && (
                    <div className="mx-auto mt-20 max-w-xl space-y-16">
                        {data.projectList.map((project, projectIdx) => (
                            <div key={projectIdx} className="space-y-10">
                                <div className="mb-4 font-semibold tracking-wider uppercase">
                                    {project.category}
                                </div>
                                <div className="space-y-6">
                                    {project.items.map((item, itemIdx) => (
                                        <div
                                            key={`${projectIdx}-${itemIdx}`}
                                            className="overflow-hidden rounded-xl bg-black/80 pb-6"
                                        >
                                            <a href={item.link}>
                                                <div
                                                    style={{
                                                        maskImage:
                                                            'linear-gradient(#000 40%, #0000 100%)',
                                                    }}
                                                >
                                                    <div className="tt-image">
                                                        <img
                                                            loading="lazy"
                                                            src={item.image}
                                                            width={400}
                                                            height={400}
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-lg">{item.name}</p>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isMobile && (
                    <div
                        style={{
                            height: `${data.projectList.reduce((acc, curr) => acc + curr.items.length, 0) * 100}vh`,
                        }}
                        id="gsap-projects-trigger"
                        className="relative md:pointer-events-none"
                    >
                        <div className="projects-menu fixed top-1/2 left-5 hidden -translate-y-1/2 opacity-0 transition-opacity duration-500 md:block">
                            <ul className="projects-menu-dots relative whitespace-nowrap before:absolute before:left-0 before:hidden before:h-full before:w-px before:bg-white/10 after:absolute after:top-0 after:left-0 after:z-10 after:hidden after:h-[var(--progress-percent)] after:w-px after:origin-top after:bg-white">
                                {data.projectList.map((p, idx) => (
                                    <li
                                        data-category={p.category}
                                        className={`menu-dot relative flex items-center py-2 pl-5 text-sm transition-all duration-500 before:absolute before:-left-[3.5px] before:size-2 before:rounded-full before:bg-white before:opacity-10 before:transition-all before:duration-500`}
                                        key={idx}
                                    >
                                        <span className="opacity-10 transition-opacity duration-500">
                                            {p.category}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
