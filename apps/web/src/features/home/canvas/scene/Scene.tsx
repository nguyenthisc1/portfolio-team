/* eslint-disable react/no-unknown-property */
'use client'

import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { Leva, useControls } from 'leva'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Project } from 'types'
import CameraGroup from '../elements/CameraGroup'
import Logo from '../elements/Logo'
import Ocean from '../elements/Ocean'
import Projects from '../elements/Projects'

// Camera controller to set camera from leva panel
function CameraController({ leva }: { leva: any }) {
    const { camera } = useThree()

    useFrame(() => {
        camera.position.set(leva.camX, leva.camY, leva.camZ)
        camera.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
    })

    useEffect(() => {
        camera.layers.enable(0)
        camera.layers.enable(10)
    }, [camera.layers])

    return (
        <>
            <EffectComposer multisampling={0}>
                <SelectiveBloom
                    selectionLayer={10}
                    intensity={1}
                    luminanceThreshold={1}
                    luminanceSmoothing={1}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    )
}

export default function Scene({ data }: { data?: Project[] }) {
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
        if (!canvasRef.current) return

        if (isAccess) {
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
        }
    }, [isAccess])

    // useEffect(() => {
    //     if (data) {
    //         setTimeout(() => {
    //             if (ScrollTrigger) {
    //                 ScrollTrigger.refresh();
    //             }
    //         }, 50);
    //     }
    // }, [data]);

    return (
        <>
            <div
                ref={canvasRef}
                style={{
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
                        toneMappingExposure: 0,
                        outputColorSpace: THREE.LinearSRGBColorSpace,
                    }}
                >
                    <CameraController leva={leva} />
                    <Suspense fallback={null}>
                        <Logo />

                        <group name="projects">
                            <Ocean />
                            {data && (
                                <CameraGroup>
                                    <Projects data={data} />
                                </CameraGroup>
                            )}
                        </group>
                    </Suspense>
                </Canvas>
                <Leva hidden={true} />
            </div>
        </>
    )
}
