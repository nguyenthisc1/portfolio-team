import { ProjectsSection } from 'types'
import Heading from './Heading'
import Typography from './Typography'

export default function Projects({ data }: { data: ProjectsSection }) {
    return (
        <section aria-labelledby="projects-heading" className="mb-44 space-y-10">
            <div className="mx-auto max-w-5xl">
                <Heading as={2} text={data.title} className={'h2 uppercase'} />
            </div>

            <div className="mx-auto mt-[20%] max-w-5xl">
                <Typography className="mr-32 ml-auto max-w-xs" text={data.description} />
            </div>

            <div
                style={{
                    height: `calc(${data.projectList.reduce((acc, curr) => acc + curr.items.length, 0) * 100}vh)`,
                }}
                id="gsap-projects-trigger"
                className="pointer-events-none relative"
            >
                <div className="fixed inset-0">
                    {data.projectList.map((project, projectIdx) =>
                        project.items.map((item, itemIdx) => (
                            <div
                                className="gsap-project-info absolute inset-0 flex items-end opacity-0"
                                key={`${projectIdx}-${itemIdx}`}
                            >
                                <div className="w-full space-y-10 text-center lg:py-40">
                                    <a href={item.link}>
                                        <h4>{item.name}</h4>
                                    </a>
                                </div>
                            </div>
                        )),
                    )}
                </div>

                <div className="projects-menu fixed top-1/2 left-5 -translate-y-1/2 opacity-0 transition-opacity duration-500">
                    <ul className="projects-menu-dots relative whitespace-nowrap before:absolute before:left-0 before:h-full before:w-px before:bg-white/10 after:absolute after:top-0 after:left-0 after:z-10 after:h-[var(--progress-percent)] after:w-px after:origin-top after:bg-white">
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
        </section>
    )
}
