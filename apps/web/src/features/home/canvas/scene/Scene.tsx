'use client'

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import Logo from '../elements/Logo'
import Ocean from '../elements/Ocean'
import { useControls } from 'leva'
import Projects from '../elements/Projects'
import { useGSAP } from '@gsap/react'
import { useGlobal } from '@/shared/stores/global'
import gsap from 'gsap'

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

// Camera controller to set camera from leva panel
function CameraController({ leva }: { leva: any }) {
    const { camera } = useThree()

    useFrame(() => {
        camera.position.set(leva.camX, leva.camY, leva.camZ)
        camera.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
    })

    return null
}

export default function Scene() {
    const canvasRef = useRef<any | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    // Leva camera state (target values)
    const leva = useControls('Camera', {
        camX: { value: 100, min: -500, max: 500, step: 1 },
        camY: { value: 1, min: -100, max: 100, step: 1 },
        camZ: { value: 100, min: -500, max: 500, step: 1 },
        rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotY: { value: 0.8, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    })

    // IMPORTANT: Camera `position` and `rotation` are only read once at mount.
    // To update on leva change, you must use a CameraController as a child of <Canvas>,
    // and NOT include camera.position/rotation as react props below.

    useGSAP(() => {
        if (!canvasRef.current && !isAccess) return

        gsap.to(leva, {
            camY: 10,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: '#gsap-projects-trigger',
                start: 'top top',
                end: '450px top',
                scrub: 2,
                // markers: true,
            },
        })
    }, [isAccess])

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
                    // pointerEvents: 'none',
                }}
            >
                <Canvas
                    style={{
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                    }}
                    // DO NOT provide position/rotation here for dynamic update from leva!
                    camera={{
                        fov: 55,
                        near: 1,
                        far: 20000,
                        // Defaults for initial mount; actual position/rotation set in CameraController.
                        // position: [leva.camX, leva.camY, leva.camZ],
                        // rotation: [leva.rotX, leva.rotY, leva.rotZ],
                    }}
                    gl={{
                        toneMapping: THREE.NeutralToneMapping,
                        toneMappingExposure: 0.2,
                    }}
                >
                    <CameraController leva={leva} />
                    <Suspense fallback={null}>
                        <group name="global">
                            <Logo />

                            {/* <Sky /> */}
                        </group>

                        <group name="projects">
                            <Ocean />
                            <Projects />
                        </group>
                    </Suspense>
                </Canvas>
            </div>
        </>
    )
}
