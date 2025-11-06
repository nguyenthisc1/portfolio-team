import Footer from '@/features/home/components/Footer'
import Heading from '@/features/home/components/Heading'
import Intro from '@/features/home/components/Intro'
import Skill from '@/features/home/components/Skill'
import Typography from '@/features/home/components/Typography'

export default function Home() {
    return (
        <>
            <Intro />

            <section aria-labelledby="projects-heading" className="mb-44 space-y-10">
                <div className="mx-auto max-w-5xl">
                    <Heading as={2} text={'Projects'} className={'h2 uppercase'} />
                    <Typography
                        className="mr-32 ml-auto max-w-xs"
                        text="Come along and discover a selection of my recent works, from websites to digital products, all
                        crafted with a focus on clarity, purpose, and meaningful design."
                    />
                </div>

                <div
                    style={{ height: `800vh` }}
                    id="gsap-projects-trigger"
                    className="pointer-events-none relative"
                >
                    <div className="fixed inset-0">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div
                                className="gsap-project-info absolute inset-0 flex items-end opacity-0"
                                key={idx}
                            >
                                <div className="w-full space-y-10 text-center lg:py-40">
                                    <h3>IWC Schaffhausen {idx + 1}</h3>

                                    <a href="#">
                                        <div className="glint-card glint-card-hover inline-block cursor-pointer rounded">
                                            <div className="glint-card-wrapper rounded">
                                                <div className="glint-card-content rounded !bg-black font-bold">
                                                    Find out more
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-labelledby="about-team-heading" className="mb-32">
                <div className="text-primary mb-44 text-center uppercase">
                    <Heading
                        id="about-team-heading"
                        as={2}
                        text={' About Team'}
                        className={'h2 uppercase'}
                    />
                </div>

                <div className="container">
                    <div className="space-y-16">
                        <article className="grid grid-cols-1 gap-36 lg:grid-cols-2">
                            <figure className="relative bg-neutral-800">
                                <img
                                    className="size-full"
                                    src="/images/team-vu.png"
                                    alt="Tran Le Hoang Vu Portrait"
                                    width={100}
                                    height={100}
                                />
                                <div className="absolute right-0 bottom-0 left-0 space-y-5 pb-10 text-center">
                                    <figcaption className="text-primary h4 uppercase">
                                        Tran Le Hoang Vu
                                    </figcaption>
                                    <p className="text-2xl uppercase">LEADER OF WEBSITE TEAM</p>
                                </div>
                            </figure>
                            <ul className="flex flex-wrap gap-y-24">
                                <li className="flex w-full flex-col space-y-5">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">6</span>{' '}
                                        <span className="h3">years</span>
                                    </strong>

                                    <p className="uppercase">Experience</p>
                                </li>
                                <li className="flex w-1/2 flex-col space-y-5">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">50</span> <span className="h3">+</span>
                                    </strong>
                                    <p className="uppercase"> Projects</p>
                                </li>
                                <li className="flex w-1/2 flex-col space-y-5">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">100</span>{' '}
                                        <span className="h3">+</span>
                                    </strong>
                                    <p className="uppercase"> Customer and partners</p>
                                </li>
                            </ul>
                        </article>
                        <div className="text-right">
                            <a href="#">
                                <div className="glint-card glint-card-hover inline-block cursor-pointer rounded">
                                    <div className="glint-card-wrapper rounded">
                                        <div className="glint-card-content rounded !bg-black font-bold">
                                            <span className="text-primary">hey</span>
                                            <span>, click to see my skill over here</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Skill />

            <Footer />
        </>
    )
}
