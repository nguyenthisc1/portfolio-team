import { HomePageData } from 'types'
import Footer from './Footer'
import Heading from './Heading'
import Intro from './Intro'
import Projects from './Projects'
import Skill from './Skill'
import Typography from './Typography'

export default function HomePage({ data }: { data: HomePageData }) {
    return (
        <>
            <Intro data={data.hero} />

            <section
                id="philosophy"
                aria-labelledby="philosophy-heading"
                className="mx-auto mb-[50%] max-w-4xl space-y-10"
            >
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <Typography className="mr-20 ml-auto max-w-xs" text={data.philosophy.text} />
            </section>

            <Projects data={data.projects} />

            <section id="about" aria-labelledby="about-team-heading" className="mb-32">
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

            <Skill data={data.skills} />

            <Footer />
        </>
    )
}
