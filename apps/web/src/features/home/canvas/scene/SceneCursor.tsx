'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import LogoCursor from '../elements/LogoCursor'

export default function SceneCursor() {
    return (
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                background: 'transparent',
            }}
            gl={{
                antialias: true,
                alpha: true,
            }}
            camera={{
                fov: 50,
                near: 0.1,
                far: 100,
                position: [0, 0, 5],
            }}
        >
            <Suspense fallback={null}>
                <LogoCursor />
            </Suspense>
        </Canvas>
    )
}
