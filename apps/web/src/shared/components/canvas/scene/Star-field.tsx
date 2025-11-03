'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'

interface Star {
    x: number
    y: number
    px: number
    py: number
    z: number
    color: string
    update: () => void
    show: (c: CanvasRenderingContext2D) => void
}

const STROKE_COLORS = ['#FED430', '#FB4800', '#000000']

function createStar(canvas: HTMLCanvasElement, speedRef: React.MutableRefObject<number>): Star {
    const x = Math.random() * canvas.width - canvas.width / 2
    const y = Math.random() * canvas.height - canvas.height / 2
    const z = Math.random() * 4
    const px = x
    const py = y
    // Give each star a color, cycle through the palette
    const color = STROKE_COLORS[Math.floor(Math.random() * STROKE_COLORS.length)] as string

    return {
        x,
        y,
        px,
        py,
        z,
        color,
        update() {
            this.px = this.x
            this.py = this.y
            this.z += speedRef.current
            this.x += this.x * (speedRef.current * 0.8) * this.z
            this.y += this.y * (speedRef.current * 0.8) * this.z
            if (
                this.x > canvas.width / 2 + 50 ||
                this.x < -canvas.width / 2 - 50 ||
                this.y > canvas.height / 2 + 50 ||
                this.y < -canvas.height / 2 - 50
            ) {
                this.x = Math.random() * canvas.width - canvas.width / 2
                this.y = Math.random() * canvas.height - canvas.height / 2
                this.px = this.x
                this.py = this.y
                this.z = 0
                this.color = STROKE_COLORS[
                    Math.floor(Math.random() * STROKE_COLORS.length)
                ] as string
            }
        },
        show(c: CanvasRenderingContext2D) {
            c.lineWidth = this.z
            c.strokeStyle = this.color
            c.beginPath()
            c.moveTo(this.x, this.y)
            c.lineTo(this.px, this.py)
            c.stroke()
        },
    }
}

const NUM_STARS = 800

const StarField: React.FC<React.HTMLAttributes<HTMLCanvasElement>> = (props) => {
    const isLoading = useGlobal((state) => state.isLoading)
    const isAccess = useGlobal((state) => state.isAccess)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const starsRef = useRef<Star[]>([])
    const speedRef = useRef<number>(0.05)
    const animationIdRef = useRef<number>(0)
    const fillStyleRef = useRef<string>('rgba(255, 255, 255, 0.4)') // Track current fill color

    // Control whether to render the <canvas> at all
    const [visible, setVisible] = useState(true)

    // Track the window size after mount (for SSR hydration parity)
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

    // Set initial width and height after mount
    useEffect(() => {
        function updateDimensions() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    // Resize canvas and manage stars on dimension changes
    useEffect(() => {
        if (!dimensions) return // Only run on the client after mount
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = dimensions.width
        canvas.height = dimensions.height

        // Reset stars
        starsRef.current = []
        for (let i = 0; i < NUM_STARS; i++) {
            starsRef.current.push(createStar(canvas, speedRef))
        }

        const context = canvas.getContext('2d')
        if (context) {
            context.setTransform(1, 0, 0, 1, 0, 0) // Reset before translating
            context.translate(canvas.width / 2, canvas.height / 2)
        }
    }, [dimensions])

    // Animation loop
    useEffect(() => {
        if (!dimensions) return
        const canvas = canvasRef.current
        if (!canvas) return
        const c = canvas.getContext('2d')
        if (!c) return

        // Use color from fillStyleRef (which gsap can animate)
        c.fillStyle = fillStyleRef.current

        function draw() {
            if (!canvas || !c) return
            animationIdRef.current = requestAnimationFrame(draw)
            c.fillStyle = fillStyleRef.current
            c.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
            for (const s of starsRef.current) {
                s.update()
                s.show(c)
            }
        }

        draw()

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }
        }
    }, [dimensions])

    useGSAP(() => {
        if (!isLoading && canvasRef.current) {
            // Animate speedRef.current down
            gsap.to(speedRef, {
                current: 0.005,
                duration: 1,
                ease: 'circ.out',
            })
        }
    }, [isLoading])

    // When isAccess is true, animate opacity to 0, then stop animation and remove StarField after transition
    useGSAP(() => {
        if (isAccess && canvasRef.current) {
            // Animate opacity
            gsap.to(canvasRef.current, {
                opacity: 0,
                duration: 1,
                ease: 'power1.inOut',
                onComplete: () => {
                    // Stop animation
                    if (animationIdRef.current) {
                        cancelAnimationFrame(animationIdRef.current)
                    }
                    // Remove from DOM after duration (in case onComplete runs slightly before end)
                    setTimeout(() => {
                        setVisible(false)
                    }, 0) // Already fully faded, remove immediately
                },
            })
        }
    }, [isAccess])

    // During SSR, do not render the <canvas> at all
    if (dimensions === null || !visible) {
        return null
    }

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            id="c1"
            style={{
                width: '100vw',
                height: '100vh',
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -11,
                opacity: 1,
                ...props.style,
            }}
            {...props}
        />
    )
}

export default StarField
