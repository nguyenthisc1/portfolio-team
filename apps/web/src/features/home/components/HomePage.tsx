import { HomePageData } from 'types'
import Footer from './Footer'
import Intro from './Intro'
import Philosophy from './Philosophy'
import Projects from './Projects'
import Skill from './Skill'
import About from './About'

export default function HomePage({ data }: { data: HomePageData }) {
    return (
        <>
            <Intro data={data.hero} />

            {/* <Philosophy data={data.philosophy} /> */}

            {/* <Projects data={data.projects} /> */}

            <About />

            <Skill data={data.skills} />

            <Footer />
        </>
    )
}
