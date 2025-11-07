'use client'

import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import Logo from '../elements/Logo'

// function Sky() {
//     const { scene } = useThree()
//     const texture = useLoader(THREE.TextureLoader, 'images/nightsky.webp')

//     useMemo(() => {
//         if (texture) {
//             texture.mapping = THREE.UVMapping
//             texture.flipY = false
//             scene.background = texture
//             scene.environment = texture
//         }
//     }, [texture, scene])

//     return null
// }

export default function Scene() {
    const canvasRef = useRef<any | null>(null)

    return (
        <>
            <div
                ref={canvasRef}
                style={{
                    // background: '#ffffff',
                    position: 'fixed',
                    inset: 0,
                    zIndex: -10,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                }}
            >
                <Canvas
                    style={{
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                    }}
                    // default position is 10
                    camera={{ position: [100, 14, 100], fov: 55, near: 1, far: 20000 }}
                    gl={{
                        toneMapping: THREE.NeutralToneMapping,
                        toneMappingExposure: 0.2,
                    }}
                >
                    <Suspense fallback={null}>
                        <group name="global">
                            <Logo />
                        </group>

                        {/* <group name="projects">
                            <Ocean />
                            <Projects />
                        </group> */}
                    </Suspense>
                </Canvas>
            </div>
        </>
    )
}
