'use client'

import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import Logo from './Logo'
import Ocean from './Ocean'

function Sky() {
    const { scene } = useThree()
    const texture = useLoader(THREE.TextureLoader, 'images/nightsky.webp')

    useMemo(() => {
        if (texture) {
            texture.mapping = THREE.UVMapping
            texture.flipY = false
            scene.background = texture
            scene.environment = texture
        }
    }, [texture, scene])

    return null
}

export default function CanvasScene() {
    return (
        <Canvas
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
            }}
            camera={{ position: [100, 5, 100], fov: 55, near: 1, far: 20000 }}
            gl={{
                toneMapping: THREE.NeutralToneMapping,
                toneMappingExposure: 0.2,
            }}
        >
            <Suspense fallback={null}>
                <Logo />

                <group>
                    <Ocean />
                    <Sky />
                </group>

                {/* <EffectsComposer
                bloomStrength={bloomStrength}
                bloomRadius={bloomRadius}
                bloomThreshold={bloomThreshold} /> */}
            </Suspense>
            {/* <OrbitControls /> */}
        </Canvas>
    )
}
