'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useRef, useState } from 'react'
import { useGlobal } from '../stores/global'

export default function SoundBar() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const [isPlaying, setIsPlaying] = useState(false)

    // Play music when isAccess becomes true (if not already playing)
    useGSAP(() => {
        if (isAccess && audioRef.current && !isPlaying) {
            audioRef.current.currentTime = 0.05
            try {
                audioRef.current.volume = 0.05
                audioRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true)
                        gsap.to(audioRef.current, {
                            volume: 0.5,
                            duration: 4,
                            ease: 'power2.inOut',
                        })
                    })
                    .catch(() => {
                        setIsPlaying(false) // Could not play
                    })
            } catch {
                setIsPlaying(false)
            }
        }
    }, [isAccess])

    const handleToggle = useCallback(() => {
        if (!audioRef.current) return
        if (audioRef.current.paused) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true)
                    gsap.to(audioRef.current, {
                        volume: 0.5,
                        duration: 0.5,
                        ease: 'power2.inOut',
                    })
                })
                .catch(() => {}) // Ignore errors
        } else {
            gsap.to(audioRef.current, {
                volume: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    audioRef.current?.pause()
                    setIsPlaying(false)
                },
            })
        }
    }, [])

    return (
        <>
            <audio
                ref={audioRef}
                src="/sounds/space-traveller.mp3"
                preload="auto"
                style={{ display: 'none' }}
                loop
            />

            <div id="sound-bars" className="fixed bottom-10 left-10 z-50">
                <div
                    className={audioRef.current && !audioRef.current.paused ? '' : 'paused'}
                    tabIndex={0}
                    role="button"
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleToggle()
                    }}
                    style={{ outline: 'none', cursor: 'pointer' }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </>
    )
}
