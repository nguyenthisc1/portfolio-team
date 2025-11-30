import { HomePageData } from 'types'
import About from './About'
import Intro from './Intro'
import Typography from './Typography'
import Projects from './Projects'
import Skill from './Skill'
import Footer from './Footer'

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

            <About />

            <Skill data={data.skills} />

            <Footer />
        </>
    )
}
