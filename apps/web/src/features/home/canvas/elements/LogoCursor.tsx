/* eslint-disable react/no-unknown-property */
'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import GradientSphere from './GradientSphere'

const BOX_FACE_CONFIGS = [
    { axis: 'x', sign: 1, rot: [0, Math.PI / 2, 0] }, // right
    { axis: 'x', sign: -1, rot: [0, -Math.PI / 2, 0] }, // left
    { axis: 'y', sign: 1, rot: [-Math.PI / 2, 0, 0] }, // top
    { axis: 'y', sign: -1, rot: [Math.PI / 2, 0, 0] }, // bottom
    { axis: 'z', sign: 1, rot: [0, 0, 0] }, // front
    { axis: 'z', sign: -1, rot: [0, Math.PI, 0] }, // back
]

export function BoxPlanes() {
    const groupRef = useRef<THREE.Group>(null)
    const planeGroups = useRef<THREE.Group[]>([])
    const lineMaterials = useRef<THREE.LineBasicMaterial[]>([])

    // Set up transforms on all planes
    const setupPlanes = useCallback(() => {
        planeGroups.current.forEach((group, i) => {
            const { axis, sign, rot } = BOX_FACE_CONFIGS[i]!
            gsap.set(group.position, { [axis]: sign * 0.9 })
            gsap.set(group.rotation, { x: rot[0], y: rot[1], z: rot[2] })
            gsap.set(group.scale, { x: 1, y: 1, z: 1 })
        })
    }, [])

    useGSAP(setupPlanes, [])

    // Animate rotation
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += delta * 0.2
            groupRef.current.rotation.y += delta * 0.3
        }
    })

    const planes = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => (
                <group
                    key={i}
                    ref={(el) => {
                        if (el) planeGroups.current[i] = el
                    }}
                    position={[0, 0, 0]}
                >
                    <lineSegments>
                        <edgesGeometry args={[new THREE.PlaneGeometry(1.8, 1.8)]} />
                        <lineBasicMaterial
                            ref={(el) => {
                                if (el) lineMaterials.current[i] = el
                            }}
                            color="#ffffff"
                            transparent
                            opacity={1}
                            linewidth={5}
                        />
                    </lineSegments>
                </group>
            )),
        [],
    )

    return (
        <group ref={groupRef}>
            <pointLight position={[0, 0, 0]} intensity={5} color={'#fd5d00'} distance={2} />
            {planes}
        </group>
    )
}

export default function LogoCursor() {
    const mouse = useRef(new THREE.Vector2(0, 0))
    const logoRef = useRef<THREE.Group | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    // Mouse movement - keep stable ref and handlers
    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 0.985
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 0.94
        }
        window.addEventListener('pointermove', handleMove)
        return () => window.removeEventListener('pointermove', handleMove)
    }, [])

    const raycaster = useMemo(() => new THREE.Raycaster(), [])
    const target = useMemo(() => new THREE.Vector3(), [])

    useFrame(({ camera }) => {
        raycaster.setFromCamera(mouse.current, camera)
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3)
        raycaster.ray.intersectPlane(plane, target)
        if (logoRef.current) {
            logoRef.current.position.lerp(target, 0.12)
        }
    })

    return isAccess ? (
        <group ref={logoRef} scale={0.015}>
            <GradientSphere />
            <BoxPlanes />
        </group>
    ) : null
}
