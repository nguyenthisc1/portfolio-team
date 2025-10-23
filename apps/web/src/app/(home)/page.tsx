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
                    <h3 className="h2 text-primary uppercase">
                        Website <br /> Developer
                    </h3>
                </div>
            </section>

            <section aria-labelledby="philosophy-heading" className="mb-44 max-w-4xl mx-auto space-y-10">
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <p className="max-w-xs ml-auto mr-20">
                    I value simplicity without sacrificing originality. Every solution is effective, purposeful, and
                    ready for real use.
                </p>
            </section>

            <section aria-labelledby="projects-heading" className="mb-44 max-w-4xl mx-auto space-y-10">
                <h2 id="projects-heading" className="h2 uppercase  text-primary text-center">
                    Projects
                </h2>
                <p className="max-w-xs ml-auto mr-20">
                    Come along and discover a selection of my recent works, from websites to digital products, all
                    crafted with a focus on clarity, purpose, and meaningful design.
                </p>
            </section>

            <section aria-labelledby="about-team-heading" className="mb-32">
                <h2 id="about-team-heading" className="h2 mb-44 uppercase text-primary text-center">
                    About Team
                </h2>
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

            <section aria-labelledby="skills-heading" className="mb-80">
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

            <footer className="pb-40">
                <div className="container">
                    <section aria-labelledby="contact-heading" className="bg-secondary lg:space-y-36">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-40 gap-y-10 lg:items-end">
                            <div className="bg-black w-fit">
                                <svg
                                    className="w-full lg:w-fit"
                                    width="663"
                                    height="178"
                                    viewBox="0 0 663 178"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_1462_121)">
                                        <path
                                            d="M608.277 21.26H580.028V0H663.028V21.26H634.882V178H608.277V21.26Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M536.792 178.213C532.554 178.213 527.905 177.598 522.847 176.367C517.856 175.137 513.105 172.573 508.594 168.677C504.082 164.78 500.391 158.936 497.52 151.143C494.648 143.281 493.213 132.788 493.213 119.663V57.627C493.213 47.0996 494.17 38.3496 496.084 31.377C498.066 24.3359 500.63 18.7305 503.774 14.5605C506.987 10.3223 510.508 7.17773 514.336 5.12695C518.232 3.00781 522.095 1.64062 525.923 1.02539C529.819 0.341797 533.408 0 536.689 0C545.713 0 552.856 1.6748 558.12 5.02441C563.384 8.37402 567.144 12.8857 569.399 18.5596C571.724 24.165 572.886 30.3516 572.886 37.1191C572.886 40.8789 572.578 44.3652 571.963 47.5781C571.416 50.7227 570.767 54.209 570.015 58.0371H549.507V49.6289C549.507 30.4199 544.995 20.8154 535.972 20.8154C531.118 20.8154 527.393 22.9346 524.795 27.1729C522.266 31.3428 521.001 39.0332 521.001 50.2441V129.199C521.001 140.068 522.266 147.485 524.795 151.45C527.393 155.415 531.392 157.397 536.792 157.397C540.552 157.397 543.662 155.825 546.123 152.681C548.584 149.468 549.814 144.341 549.814 137.3V120.688H573.091V136.89C573.091 150.903 569.98 161.294 563.76 168.062C557.539 174.829 548.55 178.213 536.792 178.213Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M417.889 0H448.064L481.028 178H454.161L449.304 146.11H416.649L411.999 178H385.028L417.889 0ZM446.204 125.788L433.597 36.6838H432.46L419.75 125.788H446.204Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M335.277 21.26H307.028V0H390.028V21.26H361.882V178H335.277V21.26Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M208.028 0H228.997L271.65 117.034H272.264C271.991 113.352 271.616 109.253 271.139 104.737C270.73 100.151 270.355 94.6624 270.014 88.2705C269.673 81.8786 269.502 74.0972 269.502 64.9262V0H293.028V178H271.855L229.406 64.0925H228.588C228.929 68.2611 229.304 72.8119 229.713 77.7447C230.122 82.6776 230.497 88.8958 230.838 96.3993C231.179 103.903 231.35 113.664 231.35 125.684V178H208.028V0Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M138.633 178.213C134.395 178.213 129.746 177.598 124.688 176.367C119.697 175.137 114.946 172.573 110.435 168.677C105.923 164.78 102.231 158.936 99.3604 151.143C96.4893 143.281 95.0537 132.788 95.0537 119.663V57.627C95.0537 47.0996 96.0107 38.3496 97.9248 31.377C99.9072 24.3359 102.471 18.7305 105.615 14.5605C108.828 10.3223 112.349 7.17773 116.177 5.12695C120.073 3.00781 123.97 1.64062 127.866 1.02539C131.763 0.341797 135.352 0 138.633 0C141.777 0 145.264 0.307617 149.092 0.922852C152.988 1.53809 156.851 2.87109 160.679 4.92188C164.507 6.9043 167.993 9.98047 171.138 14.1504C174.351 18.3203 176.914 23.9258 178.828 30.9668C180.811 38.0078 181.802 46.8945 181.802 57.627V119.663C181.802 132.651 180.298 143.042 177.29 150.835C174.282 158.628 170.488 164.507 165.908 168.472C161.328 172.368 156.577 174.966 151.655 176.265C146.802 177.563 142.461 178.213 138.633 178.213ZM138.633 157.397C143.896 157.397 147.793 155.415 150.322 151.45C152.852 147.485 154.116 140.068 154.116 129.199V50.2441C154.116 39.0332 152.852 31.3428 150.322 27.1729C147.793 22.9346 143.896 20.8154 138.633 20.8154C133.232 20.8154 129.233 22.9346 126.636 27.1729C124.106 31.3428 122.842 39.0332 122.842 50.2441V129.199C122.842 140.068 124.106 147.485 126.636 151.45C129.233 155.415 133.232 157.397 138.633 157.397Z"
                                            fill="#FB4800"
                                        />
                                        <path
                                            d="M43.5791 178.213C39.3408 178.213 34.6924 177.598 29.6338 176.367C24.6436 175.137 19.8926 172.573 15.3809 168.677C10.8691 164.78 7.17773 158.936 4.30664 151.143C1.43555 143.281 0 132.788 0 119.663V57.627C0 47.0996 0.957031 38.3496 2.87109 31.377C4.85352 24.3359 7.41699 18.7305 10.5615 14.5605C13.7744 10.3223 17.2949 7.17773 21.123 5.12695C25.0195 3.00781 28.8818 1.64062 32.71 1.02539C36.6064 0.341797 40.1953 0 43.4766 0C52.5 0 59.6436 1.6748 64.9072 5.02441C70.1709 8.37402 73.9307 12.8857 76.1865 18.5596C78.5107 24.165 79.6729 30.3516 79.6729 37.1191C79.6729 40.8789 79.3652 44.3652 78.75 47.5781C78.2031 50.7227 77.5537 54.209 76.8018 58.0371H56.2939V49.6289C56.2939 30.4199 51.7822 20.8154 42.7588 20.8154C37.9053 20.8154 34.1797 22.9346 31.582 27.1729C29.0527 31.3428 27.7881 39.0332 27.7881 50.2441V129.199C27.7881 140.068 29.0527 147.485 31.582 151.45C34.1797 155.415 38.1787 157.397 43.5791 157.397C47.3389 157.397 50.4492 155.825 52.9102 152.681C55.3711 149.468 56.6016 144.341 56.6016 137.3V120.688H79.8779V136.89C79.8779 150.903 76.7676 161.294 70.5469 168.062C64.3262 174.829 55.3369 178.213 43.5791 178.213Z"
                                            fill="#FB4800"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1462_121">
                                            <rect width="663" height="178" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p className="text-xl max-w-xs">
                                Whether you need creativity or simply reliable standards, I’ve got you covered. Let’s
                                work together to create real value.
                            </p>
                        </div>
                        <div className="lg:pb-32 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-40">
                            <address className="space-y-7">
                                <h3 className="text-4xl uppercase">Information</h3>
                                <ul className="w-fit">
                                    <li className="grid grid-cols-3 gap-5">
                                        <span>Location:</span>
                                        <span className="uppercase col-span-2">Ho Chi Minh City, Viet Nam</span>
                                    </li>
                                    <li className="grid grid-cols-3">
                                        <span>Email:</span>
                                        <a className="uppercase col-span-2" href="mailto:HOANGVU2486222@GMAIL.COM">
                                            HOANGVU2486222@GMAIL.COM
                                        </a>
                                    </li>
                                    <li className="grid grid-cols-3">
                                        <span>Phone:</span>
                                        <a className="uppercase col-span-2" href="tel:0704582758">
                                            0704 58 27 58
                                        </a>
                                    </li>
                                </ul>
                            </address>
                            <div>
                                <h3 className="text-4xl uppercase">Want to see more showcase?</h3>
                            </div>
                        </div>
                    </section>
                </div>
            </footer>
        </>
    )
}
