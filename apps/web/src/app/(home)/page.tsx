import Footer from '@/features/home/components/Footer'
import Heading from '@/features/home/components/Heading'
import Skill from '@/features/home/components/Skill'
import Typography from '@/features/home/components/Typography'

export default function Home() {
    return (
        <>
            <header className="mx-auto mt-20 max-w-xl text-center">
                <h1 className="hidden">Hoang Vu - Creative Designer & Web Developer</h1>
                <p className="uppercase">
                    I’m a creative designer and web developer, passionate about building smart
                    design solutions that drive business growth.
                </p>
            </header>

            <section aria-labelledby="profile-heading" className="mt-36 mb-[50%]">
                <h2 id="profile-heading" className="sr-only">
                    Profile
                </h2>
                <div className="space-y-5 text-center">
                    <h2 className="font-primary text-xl uppercase">Hoang Vu</h2>
                    <div className="mx-auto max-w-7xl text-center">
                        <Heading as={3} text={'Website Developer'} className="h2 uppercase" />
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="philosophy-heading"
                className="mx-auto mb-44 max-w-4xl space-y-10"
            >
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <Typography
                    className="mr-20 ml-auto max-w-xs"
                    text="I value simplicity without sacrificing originality. Every solution is effective, purposeful, and ready for real use."
                />
            </section>

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
                    className="gsap-projects-trigger"
                >
                    <div className="container">
                        <div className="flex h-screen items-end">
                            <div className="gsap-project-title w-full text-center">
                                {/* <h3 >IWC Schaffhausen</h3> */}
                            </div>
                        </div>
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
                                <div className="glint-card inline-block cursor-pointer rounded">
                                    <div className="glint-card-content rounded !bg-black font-bold">
                                        <span className="text-primary">hey</span>
                                        <span>, click to see my skill over here</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="skills-heading" className="mb-44">
                <h2 id="skills-heading" className="hidden">
                    Skills
                </h2>
                <div className="container">
                    <Skill />
                </div>
            </section>

            <Footer />
        </>
    )
}
