import React from 'react'
import Typography from './Typography'
import SpinningText from './SpinningText'

export default function Intro() {
    return (
        <>
            <header className="mx-auto mt-20 max-w-xl text-center">
                {/* <h1 className="hidden">Hoang Vu - </h1> */}
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
                        <SpinningText as={2} text="Website Developer" />
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
        </>
    )
}
