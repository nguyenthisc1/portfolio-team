import React from 'react'

export default function Home() {
    return (
        <>
            <header>
                <h1 className="hidden">Hoang Vu - Creative Designer & Web Developer</h1>
                <p>
                    I’m a creative designer and web developer, passionate about building smart design solutions that
                    drive business growth.
                </p>
            </header>

            <section aria-labelledby="profile-heading">
                <h2 id="profile-heading" className="sr-only">
                    Profile
                </h2>
                <div>
                    <h2>Hoang Vu</h2>
                    <h3>Website Developer</h3>
                    <img src="/images/logo.svg" alt="Hoang Vu Logo" width={100} height={100} />
                </div>
            </section>

            <section aria-labelledby="philosophy-heading">
                <h2 id="philosophy-heading" className="sr-only">
                    Philosophy
                </h2>
                <p>
                    I value simplicity without sacrificing originality. Every solution is effective, purposeful, and
                    ready for real use.
                </p>
            </section>

            <section aria-labelledby="projects-heading">
                <h2 id="projects-heading">Projects</h2>
                <p>
                    Come along and discover a selection of my recent works, from websites to digital products, all
                    crafted with a focus on clarity, purpose, and meaningful design.
                </p>
            </section>

            <section aria-labelledby="about-team-heading">
                <h2 id="about-team-heading">About the Team</h2>
                <article>
                    <figure>
                        <img src="/images/logo.svg" alt="Tran Le Hoang Vu Portrait" width={100} height={100} />
                        <figcaption>Tran Le Hoang Vu</figcaption>
                    </figure>
                    <ul>
                        <li>
                            <strong>6 years</strong> Experience
                        </li>
                        <li>
                            <strong>50+</strong> Projects
                        </li>
                        <li>
                            <strong>100+</strong> Customers & Partners
                        </li>
                    </ul>
                </article>
            </section>

            <section aria-labelledby="skills-heading">
                <h2 id="skills-heading">Skills</h2>
                <div>
                    <article aria-labelledby="strategy-skill">
                        <header>
                            <img src="/images/logo.svg" alt="Strategy" width={64} height={64} />
                            <h3 id="strategy-skill">Strategy</h3>
                        </header>
                        <ul>
                            <li>Visual Research</li>
                            <li>Wireframes</li>
                            <li>Content Mapping</li>
                            <li>User Flows</li>
                            <li>Sitemap</li>
                        </ul>
                    </article>
                    <article aria-labelledby="design-skill">
                        <header>
                            <img src="/images/logo.svg" alt="Design" width={64} height={64} />
                            <h3 id="design-skill">Design</h3>
                        </header>
                        <ul>
                            <li>UI Design</li>
                            <li>UX Design</li>
                            <li>Design System</li>
                            <li>Prototype</li>
                            <li>Animation</li>
                        </ul>
                    </article>
                    <article aria-labelledby="build-skill">
                        <header>
                            <img src="/images/logo.svg" alt="Build" width={64} height={64} />
                            <h3 id="build-skill">Build</h3>
                        </header>
                        <ul>
                            <li>Framer / Figma</li>
                            <li>Frontend / Backend</li>
                            <li>Shopify</li>
                            <li>WordPress</li>
                            <li>Haravan</li>
                        </ul>
                    </article>
                </div>
            </section>

            <footer>
                <section aria-labelledby="contact-heading">
                    <h2 id="contact-heading">Contact</h2>
                    <p>
                        Whether you need creativity or simply reliable standards, I’ve got you covered. Let’s work
                        together to create real value.
                    </p>
                    <address>
                        <h3>Information</h3>
                        <ul>
                            <li>
                                <span>Location:</span> <span>Ho Chi Minh City, Viet Nam</span>
                            </li>
                            <li>
                                <span>Email:</span>{' '}
                                <a href="mailto:HOANGVU2486222@GMAIL.COM">HOANGVU2486222@GMAIL.COM</a>
                            </li>
                            <li>
                                <span>Phone:</span> <a href="tel:0704582758">0704 58 27 58</a>
                            </li>
                        </ul>
                    </address>
                    <div>
                        <h3>Want to see more showcase?</h3>
                    </div>
                </section>
            </footer>
        </>
    )
}
