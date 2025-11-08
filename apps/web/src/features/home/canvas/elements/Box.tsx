/* eslint-disable react/no-unknown-property */
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useGlobal } from '@/shared/stores/global'

function BoxPlanes() {
    const planeGroups = useRef<THREE.Group[]>([])
    const planes = useRef<THREE.Mesh[]>([])
    const lineMaterials = useRef<THREE.LineBasicMaterial[]>([])
    const groupRef = useRef<THREE.Group>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    const POSITIONS = [
        { axis: 'x', sign: 1, rot: [0, Math.PI / 2, 0] }, // right
        { axis: 'x', sign: -1, rot: [0, -Math.PI / 2, 0] }, // left
        { axis: 'y', sign: 1, rot: [-Math.PI / 2, 0, 0] }, // top
        { axis: 'y', sign: -1, rot: [Math.PI / 2, 0, 0] }, // bottom
        { axis: 'z', sign: 1, rot: [0, 0, 0] }, // front
        { axis: 'z', sign: -1, rot: [0, Math.PI, 0] }, // back
    ]

    const setupPlanes = ({
        positionDistance,
        scale = { x: 0.2, y: 0.2, z: 1 },
        lineOpacity = 0,
    }: {
        positionDistance: number
        scale?: { x: number; y: number; z: number }
        lineOpacity?: number
    }) => {
        planeGroups.current.forEach((group, i) => {
            const { axis, sign, rot } = POSITIONS[i]!
            gsap.set(group.position, { [axis]: sign * positionDistance })
            gsap.set(group.rotation, { x: rot[0], y: rot[1], z: rot[2] })
            gsap.set(group.scale, scale)
        })

        lineMaterials.current.forEach((mat) => gsap.set(mat, { opacity: lineOpacity }))
    }

    const animateIntro = (distance: number, half: number) => {
        const intro = gsap.timeline()
        planeGroups.current.forEach((group, i) => {
            const { axis, sign } = POSITIONS[i]!

            intro.to(
                group.position,
                { [axis]: sign * half, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            intro.to(
                group.scale,
                { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            intro.to(
                planes.current[i]!.material,
                { opacity: 0.5, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            intro.to(
                planes.current[i]!.material,
                { opacity: 0.05, duration: 1, ease: 'power2.inOut' },
                1.5,
            )

            intro.to(
                lineMaterials.current[i]!,
                { opacity: 1, duration: 1, ease: 'power2.inOut' },
                1.5,
            )
        })
    }

    const animateScroll = (distance: number) => {
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#profile',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
                // markers: true,
            },
        })

        planeGroups.current.forEach((group, i) => {
            const { axis, sign } = POSITIONS[i]!

            scrollTl.to(
                group.position,
                { [axis]: sign * distance, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            scrollTl.to(
                group.scale,
                { x: 0.2, y: 0.2, z: 1, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            scrollTl.to(
                planes.current[i]!.material,
                { opacity: 0, duration: 1, ease: 'power2.inOut' },
                i * 0.1,
            )

            scrollTl.to(
                lineMaterials.current[i]!,
                { opacity: 0, duration: 1, ease: 'power2.inOut' },
                i * 0.1,
            )
        })
    }

    useGSAP(() => {
        const distance = 4
        const half = 0.9

        // Initial setup
        setupPlanes({ positionDistance: distance })

        // Intro animation
        animateIntro(distance, half)
    }, [])

    useGSAP(() => {
        if (!isAccess) return

        const distance = 10
        animateScroll(distance)
    }, [isAccess])

    // Rotate group
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += delta * 0.2
            groupRef.current.rotation.y += delta * 0.3
        }
    })

    return (
        <group ref={groupRef}>
            {[...Array(6)].map((_, i) => (
                <group
                    key={i}
                    ref={(el) => el && (planeGroups.current[i] = el)}
                    position={[0, 0, 0]}
                >
                    <mesh ref={(el) => el && (planes.current[i]! = el)}>
                        <planeGeometry args={[1.8, 1.8]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0}
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(1.8, 1.8)]} />
                        <lineBasicMaterial
                            ref={(el) => el && (lineMaterials.current[i] = el)}
                            color="#000fff"
                            transparent
                            opacity={0}
                            linewidth={2}
                        />
                    </lineSegments>
                </group>
            ))}
        </group>
    )
}

export default function Box() {
    return <BoxPlanes />
}
