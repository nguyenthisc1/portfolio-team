import { useFrame } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export default function CameraGroup({ children }: { children: React.ReactNode }) {
    const cameraGroup = useRef<THREE.Group>(null)
    const cursor = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1
            cursor.current.y = (e.clientY / window.innerHeight) * 2 - 1
        }
        window.addEventListener('pointermove', handleMove)
        return () => window.removeEventListener('pointermove', handleMove)
    }, [])

    useFrame(() => {
        if (cameraGroup.current) {
            const rotY = cursor.current.x * -0.02
            const rotX = cursor.current.y * -0.01

            gsap.to(cameraGroup.current!.rotation, {
                y: rotY,
                x: rotX,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out',
            })

            // g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, rotY, 0.01)
            // g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rotX, 0.01)
        }
    })

    return <group ref={cameraGroup}>{children}</group>
}
