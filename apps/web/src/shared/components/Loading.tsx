'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import StarField from '../../features/home/canvas/scene/StarField'
import SoundBar from './SoundBar'

export default function Loading({ children }: { children: React.ReactNode }) {
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
    // Ref for audio element

    useGSAP(() => {
        if (isAccess) return
        const obj = { i: 0 }
        const tl = gsap.to(obj, {
            i: texts.length,
            duration: texts.length * 0.3,
            ease: 'none',
            repeat: 0,
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

        setTimeout(
            () => {
                setIsLoading(false)
            },
            texts.length * 0.3 * 1000,
        )

        const handleLoaded = () => {
            if (document.readyState === 'complete') {
                // Optionally additional logic on load
            }
        }

        window.addEventListener('load', handleLoaded)
        handleLoaded()
        return () => {
            window.removeEventListener('load', handleLoaded)
            tl.kill()
        }
    }, [isAccess])

    useEffect(() => {
        // When isAccess becomes true, immediately hide loading and show children
        if (isAccess) {
            setIsVisible(true)
        }
    }, [isAccess])

    // Animate volume from small to large when clicking "explore"
    function handleExploreClick() {
        setIsAccess(true)

        if (textIntroRef.current) {
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

            {/* Hidden audio for music playback on explore */}

            <SoundBar />

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
                        paddingBottom: '10rem',
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

            {(isAccess || isVisible) && children}
        </>
    )
}
