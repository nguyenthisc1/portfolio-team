import Footer from '@/features/animations/Footer'
import Heading from '@/features/animations/Heading'
import Typography from '@/features/animations/Typography'

export default function Home() {
    return (
        <>
            <header className="max-w-xl text-center mx-auto mt-20">
                <h1 className="hidden">Hoang Vu - Creative Designer & Web Developer</h1>
                <p className="uppercase">
                    I’m a creative designer and web developer, passionate about building smart design solutions that
                    drive business growth.
                </p>
            </header>

            <section aria-labelledby="profile-heading" className="mt-36 mb-[50%]">
                <h2 id="profile-heading" className="sr-only">
                    Profile
                </h2>
                <div className="text-center space-y-5">
                    <h2 className="text-xl font-primary uppercase">Hoang Vu</h2>
                    <Heading as={3} text={'Website Developer'} className="uppercase h2" />
                </div>
            </section>

            <section aria-labelledby="philosophy-heading" className="mb-44 max-w-4xl mx-auto space-y-10">
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <Typography
                    className="max-w-xs ml-auto mr-20"
                    text="
                 I value simplicity without sacrificing originality. Every solution is effective, purposeful, and
                    ready for real use."
                />
            </section>

            <section aria-labelledby="projects-heading" className="mb-44">
                <div className="max-w-4xl mx-auto space-y-10">
                    <Heading as={2} text={'Projects'} className={'uppercase h2'} />

                    <Typography
                        className="max-w-xs ml-auto mr-20"
                        text="                        Come along and discover a selection of my recent works, from websites to digital products, all
                        crafted with a focus on clarity, purpose, and meaningful design."
                    />
                </div>

                <div style={{ height: `800vh` }} id="gsap-projects-trigger" className="gsap-projects-trigger">
                    <div className="container">
                        <div className="h-screen flex items-end">
                            <div className="text-center w-full gsap-project-title">
                                {/* <h3 >IWC Schaffhausen</h3> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="about-team-heading" className="mb-32">
                <div className="mb-44 uppercase text-primary text-center">
                    <Heading id="about-team-heading" as={2} text={' About Team'} className={'uppercase h2'} />
                </div>

                <div className="container">
                    <div className="space-y-16">
                        <article className="grid grid-cols-1 lg:grid-cols-2 gap-36">
                            <figure className="bg-neutral-800 relative">
                                <img
                                    className="size-full"
                                    src="/images/team-vu.png"
                                    alt="Tran Le Hoang Vu Portrait"
                                    width={100}
                                    height={100}
                                />
                                <div className="absolute left-0 bottom-0 right-0 text-center pb-10 space-y-5">
                                    <figcaption className="text-primary uppercase h4">Tran Le Hoang Vu</figcaption>
                                    <p className="uppercase text-2xl">LEADER OF WEBSITE TEAM</p>
                                </div>
                            </figure>
                            <ul className="flex flex-wrap gap-y-24">
                                <li className="flex flex-col w-full space-y-5">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">6</span> <span className="h3">years</span>
                                    </strong>

                                    <p className="uppercase">Experience</p>
                                </li>
                                <li className="flex flex-col space-y-5 w-1/2">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">50</span> <span className="h3">+</span>
                                    </strong>
                                    <p className="uppercase"> Projects</p>
                                </li>
                                <li className="flex flex-col space-y-5 w-1/2 ">
                                    <strong className="text-primary whitespace-nowrap">
                                        <span className="h2">100</span> <span className="h3">+</span>
                                    </strong>
                                    <p className="uppercase"> Customer and partners</p>
                                </li>
                            </ul>
                        </article>
                        <div className="text-right">
                            <a href="#">
                                <div className="cursor-pointer glint-card inline-block rounded">
                                    <div className="glint-card-content rounded !bg-black font-bold">
                                        <span className="text-primary ">hey</span>
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-10">
                        <article aria-labelledby="strategy-skill" className="glint-card">
                            <div className="glint-card-content h-[500px]">
                                <header className="flex flex-col justify-center items-center min-h-full">
                                    <img
                                        className="w-48 object-contain"
                                        src="/images/img_skill_1.svg"
                                        alt="Strategy"
                                        width={64}
                                        height={64}
                                    />
                                    <h5 className="uppercase absolute bottom-8" id="strategy-skill">
                                        Strategy
                                    </h5>
                                </header>
                                <ul className="hidden">
                                    <li>Visual Research</li>
                                    <li>Wireframes</li>
                                    <li>Content Mapping</li>
                                    <li>User Flows</li>
                                    <li>Sitemap</li>
                                </ul>
                            </div>
                        </article>

                        <article aria-labelledby="design-skill" className="glint-card">
                            <div className="glint-card-content h-[500px]">
                                <header className="flex flex-col justify-center items-center min-h-full">
                                    <img
                                        className="w-48 object-contain "
                                        src="/images/img_skill_2.svg"
                                        alt="Strategy"
                                        width={64}
                                        height={64}
                                    />
                                    <h5 className="uppercase absolute bottom-8" id="strategy-skill">
                                        Design
                                    </h5>
                                </header>
                                <ul className="hidden">
                                    <li>UI Design</li>
                                    <li>UX Design</li>
                                    <li>Design System</li>
                                    <li>Prototype</li>
                                    <li>Animation</li>
                                </ul>
                            </div>
                        </article>

                        <article aria-labelledby="design-skill" className="glint-card">
                            <div className="glint-card-content h-[500px]">
                                <header className="flex flex-col justify-center items-center min-h-full">
                                    <img
                                        className="w-48 object-contain "
                                        src="/images/img_skill_3.svg"
                                        alt="Strategy"
                                        width={64}
                                        height={64}
                                    />
                                    <h5 className="uppercase absolute bottom-8" id="strategy-skill">
                                        Build
                                    </h5>
                                </header>
                                <ul className="hidden">
                                    <li>Framer / Figma</li>
                                    <li>Frontend / Backend</li>
                                    <li>Shopify</li>
                                    <li>WordPress</li>
                                    <li>Haravan</li>
                                </ul>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
