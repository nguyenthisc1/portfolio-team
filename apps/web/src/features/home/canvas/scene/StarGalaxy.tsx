'use client'

import { useIsMobile } from '@/shared/hooks/useMobile'
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { tsParticles } from '@tsparticles/engine'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { loadFull } from 'tsparticles'

export default function StarGalaxy() {
    const initialized = useRef(false)
    const ref = useRef(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const isMobile = useIsMobile()

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        loadFull(tsParticles).then(() => {
            tsParticles.load({
                id: 'tsparticles',
                options: {
                    autoPlay: true,
                    clear: true,
                    fullScreen: { enable: true, zIndex: -11 },
                    detectRetina: true,

                    // ✅ giảm fps trên mobile
                    fpsLimit: isMobile ? 30 : 60,

                    interactivity: {
                        detectsOn: 'window',
                        events: {
                            // ❌ mobile không hover
                            onHover: isMobile
                                ? { enable: false }
                                : {
                                      enable: true,
                                      mode: 'repulse',
                                      parallax: { enable: false, force: 2, smooth: 10 },
                                  },
                            resize: { enable: true, delay: 0.5 },
                        },
                        modes: {
                            repulse: {
                                distance: isMobile ? 80 : 150,
                                duration: 0.4,
                                factor: isMobile ? 50 : 100,
                                speed: 1,
                                maxSpeed: 50,
                                easing: 'ease-out-quad',
                            },
                        },
                    },

                    particles: {
                        number: {
                            // ✅ giảm mạnh số lượng
                            value: isMobile ? 120 : 350,
                            density: {
                                enable: true,
                                width: 1920,
                                height: 1080,
                            },
                        },
                        color: {
                            value: ['#ffffff', '#fd5d00', '#ff9041'],
                        },
                        shape: { type: 'circle' },
                        size: {
                            value: {
                                min: isMobile ? 0.5 : 0.5,
                                max: isMobile ? 1.2 : 2,
                            },
                        },
                        opacity: {
                            value: { min: 0.15, max: 0.8 },
                            animation: {
                                enable: !isMobile, // ❌ mobile tắt animation
                                speed: 1,
                                sync: false,
                            },
                        },
                        move: {
                            enable: true,
                            speed: {
                                min: isMobile ? 0.05 : 0.1,
                                max: isMobile ? 0.4 : 1,
                            },
                            direction: 'none',
                            random: true,
                            straight: false,
                            outModes: 'out',
                        },
                        collisions: { enable: false },
                    },

                    pauseOnBlur: true,
                    pauseOnOutsideViewport: true,

                    smooth: false,

                    // ✅ giảm layer trên mobile
                    zLayers: isMobile ? 20 : 100,

                    name: 'Stars',
                },
            })
        })

        return () => {
            tsParticles.dom().forEach((container) => container.destroy())
        }
    }, [isMobile])

    useEffect(() => {
        const el = document.getElementById('tsparticles')
        if (!el) return

        const handleMove = (e: PointerEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1

            gsap.to(el, {
                x: x * -20,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out',
            })
        }

        window.addEventListener('pointermove', handleMove)
        return () => window.removeEventListener('pointermove', handleMove)
    }, [])

    useGSAP(() => {
        if (!ref) return

        if (isAccess) {
            gsap.to(ref.current, {
                autoAlpha: 1,
            })
        }
    }, [isAccess])

    return (
        <div
            ref={ref}
            id="tsparticles"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -11,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'transform 1s ease-out',
            }}
        />
    )
}
