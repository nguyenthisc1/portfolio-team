/* eslint-disable react/no-unknown-property */
'use client'

import { setupLoadingPage } from '@/features/animations/animation'
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'
import Logo from '../elements/Logo'

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

export default function Scene() {
    const texts = [
        'Xin chào',
        'Hello',
        '你好',
        'Hola',
        'Olá',
        'Здравствуйте',
        'こんにちは',
        '안녕하세요',
    ]
    const [current, setCurrent] = useState(0)
    const setIsPageLoading = useGlobal((state) => state.setIsPageLoading)

    useGSAP(() => {
        const cleanup = setupLoadingPage(texts, setCurrent, setIsPageLoading)
        return cleanup
    }, [])

    // useGSAP(() => {
    //     const trigger = ScrollTrigger.create({
    //         trigger: '#gsap-projects-trigger',
    //         start: 'top center',
    //         end: 'bottom center',
    //         // markers: true,
    //         onEnter: () => setShowProjects(true),
    //         onLeaveBack: () => setShowProjects(false),
    //     })

    //     return () => trigger.kill()
    // }, [])

    return (
        <>
            <Canvas
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    background: 'white',
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

                        {/* <Sky /> */}
                    </group>

                    {/* <group name="projects" >
                    <Ocean />
                    <Projects />
                </group> */}
                </Suspense>
            </Canvas>

            <div className="h4 fixed inset-0 z-10 flex items-end justify-center py-40 text-black uppercase">
                {texts[current]}
            </div>
        </>
    )
}
