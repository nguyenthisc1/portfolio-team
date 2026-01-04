import { HomePageData } from 'types'
import About from './About'
import Footer from './Footer'
import Intro from './Intro'
import Projects from './Projects'
import Skill from './Skill'
import Typography from './Typography'

export default function HomePage({ data }: { data: HomePageData }) {
    return (
        <>
            <Intro data={data.hero} />

            <section id="philosophy" aria-labelledby="philosophy-heading">
                <div className="container mx-auto mb-20 max-w-4xl space-y-10 md:mb-[50%]">
                    <h2 id="philosophy-heading" className="sr-only">
                        Philosophy
                    </h2>
                    <Typography
                        className="ml-auto max-md:text-center md:mr-20 md:max-w-xs"
                        text={data.philosophy.text}
                    />
                </div>
            </section>

            <Projects data={data.projects} />

            {/* <About /> */}

            <Skill data={data.skills} />

            <Footer />
        </>
    )
}
