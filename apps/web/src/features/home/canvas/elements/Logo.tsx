'use client'

/* eslint-disable react/no-unknown-property */
import { useIsMobile } from '@/shared/hooks/useMobile'
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Box } from './Box'
import FakeGlowMaterial from './FakeGlow'
import GradientSphere from './GradientSphere'

export default function Logo() {
    const isAccess = useGlobal((state) => state.isAccess)
    const isLoading = useGlobal((state) => state.isLoading)
    const isMobile = useIsMobile()
    const [isAddBox, setisAddBox] = useState(false)
    const boxRef = useRef<THREE.Mesh>(null)
    const groupFirstRef = useRef<THREE.Group>(null)
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

    useGSAP(() => {
        if (!isLoading && groupRef.current) {
            const SCALE = isMobile ? 18 : 24

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
    }, [isLoading, isMobile])

    useGSAP(() => {
        if (isAccess && groupFirstRef.current) {
            const SCALE = 1.5
            gsap.to(groupFirstRef.current.scale, {
                x: SCALE,
                y: SCALE,
                z: SCALE,
                duration: 1.5,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: '#profile',
                    start: '-50% top',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            })
        }
    }, [isAccess])

    // Mobile-specific GSAP y position animation for groupRef when isAccess becomes true
    useGSAP(() => {
        if (isAccess && isMobile && groupRef.current) {
            gsap.to(groupRef.current.position, {
                y: -20,
                duration: 1.2,
                ease: 'power1.inOut',
            })
        }
    }, [isAccess, isMobile])

    useGSAP(() => {
        if (isAccess && groupRef.current) {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.tt-heading-wrapper',
                    start: '-80% 70%',
                    end: '300% 30%',
                    scrub: true,
                    // markers: true,
                },
            })

            const SCALE = 0
            timeline
                .to(
                    groupRef.current.scale,
                    {
                        x: SCALE,
                        y: SCALE,
                        z: SCALE,
                        ease: 'power2.inOut',
                    },
                    0,
                )
                .to(
                    groupRef.current.position,
                    {
                        x: -2000,
                        z: -2000,
                        y: -1,
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
            <group ref={groupFirstRef} scale={1}>
                <group ref={groupRef} position={[-3, isMobile ? 6 : 0, 0]} scale={0}>
                    <mesh position={[0, 0, 0]} scale={2}>
                        <sphereGeometry args={[0.65, 64, 64]} />
                        <FakeGlowMaterial {...shaderControls} />
                    </mesh>

                    <GradientSphere />

                    {/* <mesh position={[0, 0.1, 0]} renderOrder={999}>
                    <sphereGeometry args={[0.65, 32, 32]} />
                    <SunGradientMaterial top={sunTopColor} bottom={sunBottomColor} />
                </mesh> */}

                    {isAddBox && <Box />}
                </group>
            </group>
        </>
    )
}
