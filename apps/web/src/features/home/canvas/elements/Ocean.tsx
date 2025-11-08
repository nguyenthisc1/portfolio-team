/* eslint-disable react/no-unknown-property */
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Water } from 'three-stdlib'

extend({ Water })

export default function Ocean() {
    const groupRef = useRef<THREE.Group | null>(null)
    const waterRef = useRef<THREE.Mesh | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)

    const leva = useControls('Ocean Group', {
        posX: { value: 206, min: -500, max: 500, step: 1 },
        posY: { value: -0, min: -500, max: 500, step: 1 },
        posZ: { value: 0, min: -500, max: 500, step: 1 },
        rotX: { value: -0.32, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotY: { value: -0.06, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotZ: { value: 0.34, min: -Math.PI, max: Math.PI, step: 0.01 },
    })

    const gl = useThree((state) => state.gl)
    const waterNormals = useLoader(THREE.TextureLoader, 'images/waternormals.jpeg')
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geom = useMemo(() => new THREE.PlaneGeometry(1024, 1024), [])
    const config = useMemo(
        () => ({
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals,
            sunColor: 0xffffff,
            waterColor: 0x000000,
            distortionScale: 3,
            fog: false,
            format: gl.capabilities.isWebGL2 ? THREE.RGBAFormat : THREE.RGBFormat,
            toneMappingExposure: 10,
            clipBias: 0.9,
            alpha: 1,
        }),
        [waterNormals, gl.capabilities.isWebGL2],
    )

    const water = useMemo(() => new Water(geom, config), [geom, config])

    useFrame((_, delta) => {
        if (waterRef.current && (waterRef.current as any).material?.uniforms?.time) {
            ;(waterRef.current as any).material.uniforms.time.value += delta * 0.3
        }

        if ((waterRef.current as any)?.material?.uniforms?.normalSampler) {
            const normalScale = (waterRef.current as any).material.uniforms.normalScale
            if (normalScale && normalScale.value && waterNormals) {
                waterNormals.offset.x += delta * -0.008
            }
        }

        if (groupRef.current) {
            groupRef.current.position.set(leva.posX, leva.posY, leva.posZ)
            groupRef.current.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
        }
    })

    useGSAP(() => {
        if (!groupRef.current || !isAccess) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#profile',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
                // markers: true,
            },
        })

        tl.to(leva, {
            rotX: 0,
            // rotY: 0.05,
            rotZ: 0,
            // posY: 0.02,
            // posX: 0,
            ease: 'power2.inOut',
            duration: 3,
            onUpdate: () => {
                if (groupRef.current) {
                    // console.log('rotX:', leva.rotX, 'rotY:', leva.rotY, 'rotZ:', leva.rotZ)
                    groupRef.current.position.set(leva.posX, leva.posY, leva.posZ)
                    groupRef.current.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
                }
            },
        })
    }, [isAccess])

    return (
        <group ref={groupRef}>
            <primitive
                ref={waterRef}
                object={water}
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            />
        </group>
    )
}
