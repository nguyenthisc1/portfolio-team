'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { HomePageData } from 'types'
import StarField from '../../features/home/canvas/scene/StarField'

export default function Loading({
    data,
    children,
}: {
    data: HomePageData | null
    children: React.ReactNode
}) {
    const texts = [
        'Xin chào',
        'Hello',
        '你好',
        'Hola',
        'Olá',
        'Здравствуйте',
        'こんにちは',
        '안녕하세요',
    ]
    const [current, setCurrent] = useState(0)
    const [showButton, setShowButton] = useState(false)
    const [hideText, setHideText] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const textIntroRef = useRef<HTMLDivElement | null>(null)
    const buttonExploreRef = useRef<HTMLButtonElement | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const setIsAccess = useGlobal((state) => state.setIsAccess)
    const setIsLoading = useGlobal((state) => state.setIsLoading)

    // To avoid hydration errors and reference errors,
    // perform any client-side only code in window check branch
    useGSAP(() => {
        if (isAccess) return
        if (typeof window === 'undefined') return

        const obj = { i: 0 }
        const tl = gsap.to(obj, {
            i: texts.length,
            duration: texts.length * 0.3,
            ease: 'none',
            repeat: 1,
            modifiers: {
                i: (i) => Math.floor(Number(i)) % texts.length,
            },
            onUpdate: () => {
                setCurrent(Math.floor(obj.i))
            },
            onComplete: () => {
                setHideText(true)
                setShowButton(true)
            },
        })

        const timeoutId = setTimeout(
            () => {
                setIsLoading(false)
            },
            texts.length * 0.3 * 1000,
        )

        const handleLoaded = () => {
            if (typeof document !== 'undefined' && document.readyState === 'complete') {
                // Optionally additional logic on load
            }
        }

        window.addEventListener('load', handleLoaded)
        handleLoaded()
        return () => {
            window.removeEventListener('load', handleLoaded)
            tl.kill()
            clearTimeout(timeoutId)
        }
    }, [isAccess])

    useEffect(() => {
        if (isAccess) {
            setIsVisible(true)
        }
    }, [isAccess])

    function handleExploreClick() {
        setIsAccess(true)

        if (typeof window !== 'undefined' && textIntroRef.current) {
            gsap.to(textIntroRef.current, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    setIsVisible(true)
                },
            })
        }
    }

    return (
        <>
            <StarField />

            {!isVisible && !isAccess && (
                <div
                    ref={textIntroRef}
                    style={{
                        pointerEvents: 'auto',
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingTop: 0,
                        paddingBottom: '10vh',
                        color: 'black',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: '2.25rem',
                        letterSpacing: '0.05em',
                    }}
                >
                    {!hideText && <p>{texts[current]}</p>}
                    {showButton && (
                        <button
                            ref={buttonExploreRef}
                            onClick={handleExploreClick}
                            className="ml-6 cursor-pointer px-4 py-2 uppercase"
                        >
                            Click to explore
                        </button>
                    )}
                </div>
            )}

            {isAccess ? (
                children
            ) : (
                <>
                    <main
                        style={{
                            display: 'none',
                        }}
                    >
                        <section id="hero">
                            <header>
                                <h1>{data?.hero?.title ?? ''}</h1>
                                <p>{data?.hero?.description ?? ''}</p>
                            </header>
                        </section>

                        <section id="philosophy">
                            <article>
                                <p>{data?.philosophy?.text ?? ''}</p>
                            </article>
                        </section>

                        <section id="projects">
                            <header>
                                <h2>{data?.projects?.title ?? ''}</h2>
                                <p>{data?.projects?.description ?? ''}</p>
                            </header>

                            {/* Ensure <ul> are not inside <header> or invalidly placed */}
                            {data?.projects?.projectList?.map((project, i) => (
                                <article key={i}>
                                    <h3>{project.category}</h3>
                                    <ul>
                                        {project.items.map((item, j) => (
                                            <li key={j}>
                                                <figure>
                                                    {/* Only <figcaption> and media elements allowed as children of <figure> */}
                                                    <figcaption>
                                                        <a href={item.link}>{item.name}</a>
                                                    </figcaption>
                                                </figure>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </section>

                        <section id="skills">
                            <header>
                                <h2>Skills</h2>
                            </header>
                            {/* <ul> must not be direct child of <header> or <h*> */}
                            {data?.skills?.map((skill, i) => (
                                <article key={i}>
                                    <h3>{skill.title}</h3>
                                    <h4>{skill.name}</h4>
                                    <ul>
                                        {skill.skills.map((s, j) => (
                                            <li key={j}>{s}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </section>

                        <section id="about">
                            <header>
                                <h2>{data?.about?.title ?? ''}</h2>
                                <p>{data?.about?.description ?? ''}</p>
                            </header>

                            <ul>
                                {data?.about?.teamMembers?.map((member, i) => (
                                    <li key={i}>
                                        <article>
                                            <figure>
                                                {/* <img> + <figcaption> is valid content for <figure> */}
                                                <img
                                                    src={member.image}
                                                    alt={`${member.name} portrait`}
                                                    loading="lazy"
                                                />
                                                <figcaption>
                                                    <h3>{member.name}</h3>
                                                    <p>{member.position}</p>
                                                </figcaption>
                                            </figure>

                                            {/* Do not put <ul> directly in <figure> or <figcaption> */}
                                            <ul>
                                                <li>
                                                    <strong>{member.experience}+</strong>
                                                    <span>Years Experience</span>
                                                </li>
                                                <li>
                                                    <strong>{member.projects}+</strong>
                                                    <span>Projects</span>
                                                </li>
                                                <li>
                                                    <strong>{member.customers}+</strong>
                                                    <span>Customers</span>
                                                </li>
                                            </ul>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </main>
                </>
            )}
        </>
    )
}
