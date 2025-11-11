'use client'

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
                    fpsLimit: 60,
                    interactivity: {
                        detectsOn: 'window',
                        events: {
                            onClick: { enable: true, mode: 'repulse' },
                            onDiv: [],
                            onHover: {
                                enable: true,
                                mode: 'bubble',
                                parallax: { enable: false, force: 2, smooth: 10 },
                            },
                            resize: { enable: true, delay: 0.5 },
                        },
                        modes: {
                            trail: { delay: 1, pauseOnStop: false, quantity: 1 },
                            attract: {
                                distance: 200,
                                duration: 0.4,
                                easing: 'ease-out-quad',
                                factor: 1,
                                maxSpeed: 50,
                                speed: 1,
                            },
                            bounce: { distance: 200 },
                            bubble: {
                                distance: 250,
                                duration: 2,
                                opacity: 0,
                                size: 0,
                                divs: [],
                            },
                            connect: {
                                distance: 80,
                                links: { opacity: 0.5 },
                                radius: 60,
                            },
                            grab: {
                                distance: 400,
                                links: { blink: false, consent: false, opacity: 1 },
                            },
                            push: { default: true, quantity: 4 },
                            remove: { quantity: 2 },
                            repulse: {
                                distance: 400,
                                duration: 0.4,
                                factor: 100,
                                speed: 1,
                                maxSpeed: 50,
                                easing: 'ease-out-quad',
                                divs: [],
                            },
                            slow: { factor: 3, radius: 200 },
                            particle: {
                                replaceCursor: false,
                                pauseOnStop: false,
                                stopDelay: 0,
                            },
                            light: {
                                area: {
                                    gradient: {
                                        start: { value: '#ffffff' },
                                        stop: { value: '#000000' },
                                    },
                                    radius: 1000,
                                },
                                shadow: {
                                    color: { value: '#000000' },
                                    length: 2000,
                                },
                            },
                        },
                    },
                    particles: {
                        number: {
                            value: 250,
                            density: { enable: true, width: 1920, height: 1080 },
                        },
                        color: {
                            value: ['#ffffff', '#fd5d00', '#ff9041'],
                        },
                        shape: { type: 'circle' },
                        size: {
                            value: { min: 0.5, max: 2 },
                        },
                        opacity: {
                            value: { min: 0.1, max: 1 },
                            animation: {
                                enable: true,
                                speed: 1,
                                sync: false,
                            },
                        },
                        move: {
                            enable: true,
                            speed: { min: 0.1, max: 1 },
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
                    zLayers: 100,
                    name: 'Stars',
                },
            })
        })

        return () => {
            tsParticles.dom().forEach((container) => container.destroy())
        }
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
            }}
        />
    )
}
