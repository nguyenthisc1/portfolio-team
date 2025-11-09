'use client'

import { useGlobal } from '@/shared/stores/global'
/* eslint-disable react/no-unknown-property */
import { useGSAP } from '@gsap/react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Box from './Box'
import FakeGlowMaterial from './FakeGlow'

// Gradient is now vertical: colorTop (at vUv.y = 0.7) to colorBottom (at vUv.y = 1.0)
function SunGradientMaterial({
    top,
    bottom,
}: {
    top: [number, number, number]
    bottom: [number, number, number]
}) {
    const uniforms = useMemo(
        () => ({
            colorTop: { value: top },
            colorBottom: { value: bottom },
        }),
        [top, bottom],
    )

    return (
        <shaderMaterial
            attach="material"
            uniforms={uniforms}
            vertexShader={
                /* glsl */ `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `
            }
            fragmentShader={
                /* glsl */ `
                uniform vec3 colorTop;
                uniform vec3 colorBottom;
                varying vec2 vUv;
                void main() {
                  // Create a gradient that is colorTop for top 70%, then blends to colorBottom
                  float grad = smoothstep(0.1, 0.8, vUv.y);
                  vec3 color = mix(colorBottom, colorTop, grad);
                  gl_FragColor = vec4(color, 1);
                }
            `
            }
        />
    )
}

function hexToRgbArray(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '')
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((x) => x + x)
            .join('')
    }
    const num = parseInt(hex, 16)
    return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

export default function Logo() {
    const isAccess = useGlobal((state) => state.isAccess)
    const isLoading = useGlobal((state) => state.isLoading)
    const [isAddBox, setisAddBox] = useState(false)
    const boxRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    // Use Leva UI for gradient color picking; now vertical (top/bottom)
    const { sunTopHex, sunBottomHex } = useControls('Logo Gradient', {
        sunTopHex: {
            label: 'Gradient Top',
            value: '#fd5d00',
        },
        sunBottomHex: {
            label: 'Gradient Bottom',
            value: '#ff9041',
        },
    })

    useFrame((_, delta) => {
        if (boxRef.current) {
            boxRef.current.rotation.x += delta * 0.3
            boxRef.current.rotation.y += delta * 0.2
        }
    })

    const sunTopColor = hexToRgbArray(sunTopHex)
    const sunBottomColor = hexToRgbArray(sunBottomHex)

    useGSAP(() => {
        if (!isLoading && groupRef.current) {
            const SCALE = 24

            gsap.to(groupRef.current.scale, {
                delay: 0.3,
                x: SCALE,
                y: SCALE,
                z: SCALE,
                duration: 0.5,
                ease: 'circ.out',
                onComplete: () => setisAddBox(true),
            })
        }
    }, [isLoading])

    useGSAP(() => {
        if (isAccess && groupRef.current) {
            const SCALE = 32
            gsap.to(groupRef.current.scale, {
                x: SCALE,
                y: SCALE,
                z: SCALE,
                duration: 1.5,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: '#profile',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            })
        }
    }, [isAccess])

    useGSAP(() => {
        if (isAccess && groupRef.current) {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.tt-heading-wrapper',
                    start: '-50% 70%',
                    end: '300% 30%',
                    scrub: true,
                    // markers: true,
                },
            })

            const SCALE = 0
            timeline.to(
                groupRef.current.scale,
                {
                    x: SCALE,
                    y: SCALE,
                    z: SCALE,
                    ease: 'power2.inOut',
                },
                0,
            )
            timeline.to(
                groupRef.current.position,
                {
                    x: -500,
                    z: -500,
                    ease: 'power2.inOut',
                },
                0,
            )
        }
    }, [isAccess])

    const shaderControls = useControls('Glow Logo', {
        falloff: { value: 1.4, min: 0.0, max: 10.0 },
        glowSharpness: {
            value: 0.0,
            min: 0.0,
            max: 10.0,
        },
        glowColor: { value: sunTopHex },
        glowInternalRadius: {
            value: 1.5,
            min: -5.0,
            max: 5.0,
        },
        opacity: {
            value: 0.8,
            min: 0.0,
            max: 1.0,
        },
        depthTest: false,
    })

    return (
        <>
            <group ref={groupRef} scale={0}>
                <mesh scale={2}>
                    <sphereGeometry args={[0.65, 64, 64]} />
                    <FakeGlowMaterial {...shaderControls} />
                </mesh>

                {isAddBox && <Box />}

                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.65, 32, 32]} />
                    <SunGradientMaterial top={sunTopColor} bottom={sunBottomColor} />
                </mesh>

                {/* 
            <mesh ref={boxRef}>
                <boxGeometry args={[1.75, 1.75, 1.75]} />
                <meshBasicMaterial color="white" transparent opacity={0.01} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1.75, 1.75, 1.75)]} />
                    <lineBasicMaterial color="white" />
                </lineSegments>
            </mesh> */}
            </group>
        </>
    )
}
