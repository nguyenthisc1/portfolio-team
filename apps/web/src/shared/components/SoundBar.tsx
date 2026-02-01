'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGlobal } from '../stores/global'

export default function SoundBar() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const [isClient, setIsClient] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(true)

    // Ensure all code only runs client-side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Watch for isAccess and start playing if needed
    useGSAP(() => {
        if (!isClient) return
        if (isAccess && audioRef.current && !isPlaying) {
            audioRef.current.currentTime = 0.05
            try {
                audioRef.current.volume = 0.05
                audioRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true)
                        setIsPaused(false)
                        gsap.to(audioRef.current, {
                            volume: 0.5,
                            duration: 4,
                            ease: 'power2.inOut',
                        })
                    })
                    .catch(() => {
                        setIsPlaying(false) // Could not play
                        setIsPaused(true)
                    })
            } catch {
                setIsPlaying(false)
                setIsPaused(true)
            }
        }
    }, [isAccess, isClient])

    // Sync paused state with audio element after any play/pause events
    useEffect(() => {
        if (!isClient || !audioRef.current) return

        const handlePlay = () => {
            setIsPlaying(true)
            setIsPaused(false)
        }
        const handlePause = () => {
            setIsPlaying(false)
            setIsPaused(true)
        }

        const audio = audioRef.current
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        return () => {
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
        }
    }, [isClient])

    const handleToggle = useCallback(() => {
        if (!audioRef.current) return
        if (audioRef.current.paused) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true)
                    setIsPaused(false)
                    gsap.to(audioRef.current!, {
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
                    setIsPaused(true)
                },
            })
        }
    }, [])

    // Never render <audio> or interactive UI server-side to avoid hydration mismatch
    if (!isClient) return null

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
                    className={!isPaused ? '' : 'paused'}
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
