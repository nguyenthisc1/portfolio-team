'use client'

import { hexToRgbArray } from '@/shared/consts/utils'
/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react'

// Gradient is now vertical: colorTop (at vUv.y = 0.7) to colorBottom (at vUv.y = 1.0)
function SunGradientMaterial({
    top,
    bottom,
}: {
    top: [number, number, number]
    bottom: [number, number, number]
}) {
    const uniforms = useMemo(
        () => ({
            colorTop: { value: top },
            colorBottom: { value: bottom },
        }),
        [top, bottom],
    )

    return (
        <shaderMaterial
            attach="material"
            uniforms={uniforms}
            vertexShader={
                /* glsl */ `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `
            }
            fragmentShader={
                /* glsl */ `
                uniform vec3 colorTop;
                uniform vec3 colorBottom;
                varying vec2 vUv;
                void main() {
                  // Create a gradient that is colorTop for top 70%, then blends to colorBottom
                  float grad = smoothstep(0.1, 0.8, vUv.y);
                  vec3 color = mix(colorBottom, colorTop, grad);
                  gl_FragColor = vec4(color, 1);
                }
            `
            }
        />
    )
}

export default function GradientSphere() {
    const sunTopColor = hexToRgbArray('#fd5d00')
    const sunBottomColor = hexToRgbArray('#ff9041')

    return (
        <mesh position={[0, 0.1, 0]} renderOrder={999}>
            <sphereGeometry args={[0.65, 32, 32]} />
            <SunGradientMaterial top={sunTopColor} bottom={sunBottomColor} />
        </mesh>
    )
}
