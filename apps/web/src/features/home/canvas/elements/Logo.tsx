'use client'

import { useGlobal } from '@/shared/stores/global'
/* eslint-disable react/no-unknown-property */
import { useGSAP } from '@gsap/react'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import Box from './Box'

function SunGradientMaterial({
    left,
    right,
}: {
    left: [number, number, number]
    right: [number, number, number]
}) {
    const uniforms = useMemo(
        () => ({
            colorLeft: { value: left },
            colorRight: { value: right },
        }),
        [left, right],
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
                uniform vec3 colorLeft;
                uniform vec3 colorRight;
                varying vec2 vUv;
                void main() {
                  vec3 color = mix(colorLeft, colorRight, vUv.x);
                  gl_FragColor = vec4(color, 1.0);
                }
            `
            }
        />
    )
}

function hexToRgbArray(hex: string): [number, number, number] {
    // Remove hash
    hex = hex.replace(/^#/, '')
    // Parse short hex
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

    const { sun_left, sun_right } = {
        sun_left: {
            label: 'Gradient Left',
            value: '#ffdd6e',
        },
        sun_right: {
            label: 'Gradient Right',
            value: '#fd5d00',
        },
    }

    useFrame((_, delta) => {
        if (boxRef.current) {
            boxRef.current.rotation.x += delta * 0.3
            boxRef.current.rotation.y += delta * 0.2
        }
    })

    const sunLeftColor = hexToRgbArray(sun_left.value)
    const sunRightColor = hexToRgbArray(sun_right.value)

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
                    start: 'top 70%',
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

    return (
        <group ref={groupRef} scale={0}>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.65, 32, 32]} />
                <SunGradientMaterial left={sunLeftColor} right={sunRightColor} />
            </mesh>

            {isAddBox && <Box />}
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
    )
}
