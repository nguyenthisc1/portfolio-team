import { PhilosophySection } from 'types'
import Typography from './Typography'

export default function Philosophy({ data }: { data: PhilosophySection }) {
    return (
        <section id="philosophy" aria-labelledby="philosophy-heading">
            <div className="container mx-auto mb-20 max-w-4xl space-y-10 md:mb-[50%]">
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <Typography
                    className="ml-auto max-md:text-center md:mr-20 md:max-w-xs"
                    text={data.text}
                />
            </div>
        </section>
    )
}
