'use client'
/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { Leva, useControls } from 'leva'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Water } from 'three-stdlib'

extend({ Water })

function SunGradientMaterial({ left, right }: { left: [number, number, number]; right: [number, number, number] }) {
    const uniforms = useMemo(
        () => ({
            colorLeft: { value: left },
            colorRight: { value: right },
        }),
        [left, right],
    )

    return (
        <shaderMaterial
            attach="material"
            args={[
                {
                    uniforms,
                    vertexShader: /* glsl */ `
                        varying vec2 vUv;
                        void main() {
                          vUv = uv;
                          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: /* glsl */ `
                        uniform vec3 colorLeft;
                        uniform vec3 colorRight;
                        varying vec2 vUv;
                        void main() {
                          vec3 color = mix(colorLeft, colorRight, vUv.y);
                          gl_FragColor = vec4(color, 1.0);
                        }
                    `,
                },
            ]}
        />
    )
}

// EffectComposer for bloom/glow effects
function EffectsComposer({
    bloomStrength,
    bloomRadius,
    bloomThreshold,
}: {
    bloomStrength: number
    bloomRadius: number
    bloomThreshold: number
}) {
    return (
        <EffectComposer enableNormalPass multisampling={0} autoClear={false} depthBuffer={true}>
            <Bloom
                intensity={bloomStrength}
                radius={bloomRadius}
                luminanceThreshold={bloomThreshold}
                mipmapBlur
                levels={6}
            />
            {/* <SelectiveBloom
                selection={targetRef.current ? [targetRef.current] : []}
                intensity={bloomStrength}
                radius={bloomRadius}
                luminanceThreshold={bloomThreshold}
                mipmapBlur
                levels={6}
            /> */}
        </EffectComposer>
    )
}

// Water with sunlight (directional light) for highlights/reflections
function Ocean({
    sunLightIntensity,
    waterDistortionScale,
    position,
    rotation,
}: {
    sunLightIntensity: number
    waterDistortionScale: number
    position?: [number, number, number]
    rotation?: [number, number, number]
}) {
    const ref = useRef<THREE.Mesh | null>(null)
    const gl = useThree(state => state.gl)
    const waterNormals = useLoader(THREE.TextureLoader, 'images/waternormals.jpeg')
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: waterDistortionScale,
            fog: false,
            format: gl.capabilities.isWebGL2 ? THREE.RGBAFormat : THREE.RGBFormat,
        }),
        [waterNormals, gl.capabilities.isWebGL2, waterDistortionScale],
    )

    const water = useMemo(() => new Water(geom, config), [geom, config])

    // Animate the water
    useFrame((_, delta) => {
        if (ref.current && (ref.current as any).material?.uniforms?.time) {
            ;(ref.current as any).material.uniforms.time.value += delta * 0.3
        }

        if ((ref.current as any)?.material?.uniforms?.normalSampler) {
            const normalScale = (ref.current as any).material.uniforms.normalScale
            if (normalScale && normalScale.value && waterNormals) {
                waterNormals.offset.x += delta * -0.008
            }
        }
    })

    return (
        <primitive object={water} ref={ref} position={position} rotation={rotation ? rotation : [-Math.PI / 2, 0, 0]} />
    )
}

// Compound geometry with a glowing, gradient sun
function CompoundBody(props: {
    sunLeftColor: [number, number, number]
    sunRightColor: [number, number, number]
    position?: [number, number, number]
    rotation?: [number, number, number]
}) {
    const boxRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (boxRef.current) {
            boxRef.current.rotation.x += delta * 0.3
            boxRef.current.rotation.y += delta * 0.2
        }
    })

    return (
        <>
            <group ref={groupRef} position={props.position} rotation={props.rotation} scale={18}>
                {/* Sun-like sphere */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.65, 32, 32]} />
                    <SunGradientMaterial left={props.sunLeftColor} right={props.sunRightColor} />
                </mesh>

                {/* <mesh ref={boxRef}>
                    <boxGeometry args={[1.75, 1.75, 1.75]} />
                    <meshBasicMaterial color="white" transparent opacity={0.01} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(1.75, 1.75, 1.75)]} />
                        <lineBasicMaterial color="white" />
                    </lineSegments>
                </mesh> */}
            </group>
        </>
    )
}

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

export function ThreeLogo() {
    // ---- GUI Controls with Leva ----
    // Add scene-level controls for position and rotation, and Ocean controls
    const { sun_left, sun_right } = useControls('Sun Colors', {
        sun_left: {
            label: 'Gradient Left',
            value: '#ffdd6e',
        },
        sun_right: {
            label: 'Gradient Right',
            value: '#fd5d00',
        },
    })

    // Scene/group controls
    const { scenePosition, sceneRotation, oceanPosition, oceanRotation, sunBodyPosition, sunBodyRotation } =
        useControls('Scene', {
            scenePosition: { value: [0, 0, 0], label: 'Root Position' },
            sceneRotation: { value: [0, 0, 0], label: 'Root Rotation (rad)' },
            oceanPosition: { value: [0, 0, 0], label: 'Water Position' },
            oceanRotation: { value: [-Math.PI / 2, 0, 0], label: 'Water Rotation (rad)' },
            sunBodyPosition: { value: [0, 2, 0], label: 'Logo Position' },
            sunBodyRotation: { value: [1.25, -1.25, 0], label: 'Logo Rotation (rad)' },
        })

    // Convert hex to RGB array [0,1]
    const hexToRgb01 = (hex: string): [number, number, number] => {
        const value = hex.replace(/^#/, '')
        const num = parseInt(value, 16)
        return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
    }

    // Bloom parameters
    const { bloomStrength, bloomRadius, bloomThreshold } = useControls('Bloom', {
        bloomStrength: { value: 1.65, min: 0, max: 5, step: 0.01 },
        bloomRadius: { value: 0.3, min: 0, max: 5, step: 0.01 },
        bloomThreshold: { value: 0.07, min: 0, max: 1, step: 0.001 },
    })

    // Ocean parameters
    const { sunLightIntensity, waterDistortionScale } = useControls('Ocean', {
        sunLightIntensity: { value: 2.6, min: 0, max: 6, step: 0.01 },
        waterDistortionScale: { value: 6, min: 0, max: 10, step: 0.01 },
    })

    return (
        <>
            <Leva collapsed={false} />
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
                    <CompoundBody
                        position={sunBodyPosition}
                        rotation={sunBodyRotation}
                        sunLeftColor={hexToRgb01(sun_left)}
                        sunRightColor={hexToRgb01(sun_right)}
                    />

                    <group>
                        <Ocean
                            sunLightIntensity={sunLightIntensity}
                            waterDistortionScale={waterDistortionScale}
                            position={oceanPosition}
                            rotation={oceanRotation}
                        />
                        <Sky />
                    </group>

                    {/* <EffectsComposer
                        bloomStrength={bloomStrength}
                        bloomRadius={bloomRadius}
                        bloomThreshold={bloomThreshold} /> */}
                </Suspense>
                {/* <OrbitControls /> */}
            </Canvas>
        </>
    )
}
