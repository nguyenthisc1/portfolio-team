/* eslint-disable react/no-unknown-property */
'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function BoxPlanes() {
    const planeGroups = useRef<THREE.Group[]>([])
    const planes = useRef<THREE.Mesh[]>([])
    const lineMaterials = useRef<THREE.LineBasicMaterial[]>([])
    const groupRef = useRef<THREE.Group>(null)

    const isAccess = useGlobal((state) => state.isAccess)
    const [isRotate, setIsRotate] = useState(true)

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
                { opacity: 0.03, duration: 1.5, ease: 'power2.inOut' },
                i * 0.1,
            )

            // intro.to(
            //     planes.current[i]!.material,
            //     { opacity: 0.05, duration: 1, ease: 'power2.inOut' },
            //     1.5,
            // )

            intro.to(
                lineMaterials.current[i]!,
                { opacity: 1, duration: 1, ease: 'power2.inOut' },
                1.5,
            )
        })
    }

    const animateScroll = (distance: number) => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#profile',
                start: '-50% top',
                // scrub: 1.5,
                // markers: true,
                onEnterBack: () => setIsRotate(true),
                onLeave: () => setIsRotate(false),
                onUpdate: (self) => {
                    if (self.progress < 0.2) {
                        timeline.reverse()
                    } else {
                        timeline.play()
                    }
                },
            },
        })

        planeGroups.current.forEach((group, i) => {
            const { axis, sign } = POSITIONS[i]!

            timeline.to(
                group.position,
                { [axis]: sign * distance, duration: 1.5, ease: 'power2.inOut' },
                0,
            )

            timeline.to(
                group.scale,
                { x: 0.2, y: 0.2, z: 1, duration: 1.5, ease: 'power2.inOut' },
                0,
            )

            timeline.to(
                planes.current[i]!.material,
                { opacity: 0, duration: 1, ease: 'power2.inOut' },
                0,
            )

            timeline.to(
                lineMaterials.current[i]!,
                { opacity: 0, duration: 1, ease: 'power2.inOut' },
                0,
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
            if (isRotate) {
                groupRef.current.rotation.x += delta * 0.2
                groupRef.current.rotation.y += delta * 0.3
            }
        }
    })

    return (
        <group ref={groupRef}>
            <pointLight position={[0, 0, 0]} intensity={5} color={'#fd5d00'} distance={2} />

            {[...Array(6)].map((_, i) => (
                <group
                    key={i}
                    ref={(el) => el && (planeGroups.current[i] = el)}
                    position={[0, 0, 0]}
                >
                    <mesh ref={(el) => el && (planes.current[i]! = el)}>
                        <planeGeometry args={[1.8, 1.8]} />
                        <meshBasicMaterial
                            color="#00000f"
                            transparent
                            opacity={0}
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(1.8, 1.8)]} />
                        <lineBasicMaterial
                            ref={(el) => el && (lineMaterials.current[i] = el)}
                            color="#ffffff"
                            transparent
                            opacity={0}
                            linewidth={5}
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
