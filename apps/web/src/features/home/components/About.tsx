import AboutImageCard from './AboutImageCard'
import Heading from './Heading'

export default function About() {
    return (
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
                        <AboutImageCard />
                        {/* <figure className="relative bg-neutral-800">
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
                        </figure> */}
                        <ul className="flex flex-wrap gap-y-24">
                            <li className="flex w-full flex-col space-y-5">
                                <strong className="text-primary whitespace-nowrap">
                                    <span className="h2">6</span> <span className="h3">years</span>
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
                                    <span className="h2">100</span> <span className="h3">+</span>
                                </strong>
                                <p className="uppercase"> Customer and partners</p>
                            </li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    )
}

// import React from 'react'

// export default function AboutImageCard() {

//     return (<div className='about-image-card'>
//         <ul
//             style={{
//                 // CSS custom properties must be strings and camelCase or quoted
//                 ['--offset-y' as any]: '65',
//                 ['--distance' as any]: '50',
//                 ['--rotate' as any]: '-5',
//                 ['--swatch-count' as any]: '4',
//                 ['--power' as any]: '120'
//             }}
//         >
//             {Array.from({ length: 4 }).map((_, idx) => (
//                 <li key={idx}>
//                     <button>
//                         <figure className="relative bg-neutral-800 mb-6">
//                             <img
//                                 className="size-full"
//                                 src="/images/team-vu.png"
//                                 alt="Tran Le Hoang Vu Portrait"
//                                 width={100}
//                                 height={100}
//                             />
//                             {/* <div className="absolute right-0 bottom-0 left-0 space-y-5 pb-10 text-center">
//                                 <figcaption className="text-primary h4 uppercase">
//                                     Tran Le Hoang Vu
//                                 </figcaption>
//                                 <p className="text-2xl uppercase">LEADER OF WEBSITE TEAM</p>
//                             </div> */}
//                         </figure>
//                     </button>

//                 </li>
//             ))}
//         </ul>

//     </div >)

// }
