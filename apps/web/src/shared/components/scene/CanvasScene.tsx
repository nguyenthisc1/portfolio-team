'use client'

import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import Logo from './Logo'
import Ocean from './Ocean'
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import Projects from './Projects'

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
            // default position is 10
            camera={{ position: [100, 14, 100], fov: 55, near: 1, far: 20000 }}
            gl={{
                toneMapping: THREE.NeutralToneMapping,
                toneMappingExposure: 0.2,
            }}
        >
            <Suspense fallback={null}>
                <Logo />

                {/* <EffectComposer>
                    <Bloom strength={.167} radius={0.7} intensity={0.1} luminanceThreshold={0} luminanceSmoothing={1} mipmapBlur />
                    <ToneMapping
                            mode={ToneMappingMode.NEUTRAL}
                            exposure={0.01}
                            blendFunction={BlendFunction.DARKEN}
                        />
                </EffectComposer> */}

                <Projects />

                <group>
                    <Ocean />
                    <Sky />
                </group>
            </Suspense>
            {/* <OrbitControls /> */}
        </Canvas>
    )
}
