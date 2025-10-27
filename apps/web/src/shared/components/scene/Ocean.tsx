/* eslint-disable react/no-unknown-property */
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Water } from 'three-stdlib'

extend({ Water })

export default function Ocean() {
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
            sunColor: 0x000000,
            waterColor: 0x000000,
            distortionScale: 7,
            fog: false,
            format: gl.capabilities.isWebGL2 ? THREE.RGBAFormat : THREE.RGBFormat,
            toneMapping: THREE.UVMapping,
            toneMappingExposure: 10,
            clipBias: 0.9,
            alpha: 0.5,
        }),
        [waterNormals, gl.capabilities.isWebGL2],
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

    return <primitive object={water} ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />
}
