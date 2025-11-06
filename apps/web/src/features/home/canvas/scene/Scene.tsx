/* eslint-disable react/no-unknown-property */
'use client'

import { setupLoadingPage } from '@/features/home/animations/animation'
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Logo from '../elements/Logo'
import gsap from 'gsap'
import Ocean from '../elements/Ocean'
import Projects from '../elements/Projects'
import StarField from './Star-field'

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
    const [showButton, setShowButton] = useState(false)
    const [hideText, setHideText] = useState(false)
    const canvasRef = useRef<any | null>(null)
    const textIntroRef = useRef<HTMLDivElement | null>(null)
    const buttonExploreRef = useRef<HTMLButtonElement | null>(null)
    const setIsAccess = useGlobal((state) => state.setIsAccess)
    const setIsLoading = useGlobal((state) => state.setIsLoading)

    useGSAP(() => {
        const obj = { i: 0 }
        const tl = gsap.to(obj, {
            i: texts.length,
            duration: texts.length * 0.3,
            ease: 'none',
            repeat: 0, // Play only once
            modifiers: {
                i: (i) => Math.floor(Number(i)) % texts.length,
            },
            onUpdate: () => {
                setCurrent(Math.floor(obj.i))
            },
            onComplete: () => {
                setHideText(true)
                setShowButton(true)
                setIsLoading(false)
            },
        })

        const handleLoaded = () => {
            if (document.readyState === 'complete') {
                // setHideText(true)
                // setShowButton(true)
                // setIsLoading(false)
            }
        }

        window.addEventListener('load', handleLoaded)
        handleLoaded()

        // Return cleanup handler
        return () => {
            window.removeEventListener('load', handleLoaded)
            tl.kill()
        }
    }, [])

    // Button handler
    function handleExploreClick() {
        setIsAccess(true)

        gsap.to(canvasRef.current, {
            background: 'rgba(255,255,255,0)',
            duration: 1,
        })

        if (textIntroRef.current) {
            gsap.to(textIntroRef.current, {
                opacity: 0,
                duration: 1,
                onComplete: () => {},
            })
        }
    }

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
                            {/* <Logo /> */}

                            <Sky />
                        </group>

                        <group name="projects">
                            <Ocean />
                            <Projects />
                        </group>
                    </Suspense>
                </Canvas>
            </div>

            {/* <StarField /> */}
            {/* 
            <div
                ref={textIntroRef}
                className="h4 fixed inset-0 z-10 flex items-end justify-center py-40 text-black uppercase"
                style={{ pointerEvents: 'auto' }}
            >
                {!hideText && <p>{texts[current]}</p>}
                {showButton && (
                    <button
                        ref={buttonExploreRef}
                        onClick={handleExploreClick}
                        className="ml-6 cursor-pointer px-4 py-2 uppercase"
                    >
                        Click to explore
                    </button>
                )}
            </div> */}
        </>
    )
}
