'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { setupIntroHomeAnimation } from '../animations/animation'
import { HeroSection } from 'types'

export default function Intro({ data }: { data: HeroSection }) {
    const ref = useRef<HTMLDivElement>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    useGSAP(() => {
        if (!ref.current) return
        if (isAccess) {
            const timeline = setupIntroHomeAnimation(ref.current)
            timeline.play()
        }
    }, [isAccess])

    return (
        <div ref={ref} className="relative -z-20">
            <header className="mx-auto mt-20 max-w-xl text-center">
                {/* <h1 className="hidden">Hoang Vu - </h1> */}
                <p className="intro-description uppercase">{data.description}</p>
            </header>

            <section id="profile" aria-labelledby="profile-heading" className="mt-36 mb-[50%]">
                <h2 id="profile-heading" className="sr-only">
                    Profile
                </h2>
                <div className="space-y-5 text-center">
                    {/* <h2 className="font-primary text-xl uppercase">Hoang Vu</h2> */}
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="text-primary spinning-text intro-heading uppercase">
                            <span>{data.title}</span>
                        </h2>
                    </div>
                </div>
            </section>
        </div>
    )
}
