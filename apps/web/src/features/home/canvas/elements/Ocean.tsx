/* eslint-disable react/no-unknown-property */
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Water } from 'three-stdlib'

extend({ Water })

gsap.registerPlugin(ScrollTrigger)

export default function Ocean() {
    const groupRef = useRef<THREE.Group | null>(null)
    const waterRef = useRef<THREE.Mesh | null>(null)
    const isAccess = useGlobal((state) => state.isAccess)
    // const [isShowOcean, setIsShowOcean] = useState(false)
    const isShowOceanRef = useRef(false)

    // const leva = useControls('Ocean Group', {
    //     posX: { value: 206, min: -500, max: 500, step: 1 },
    //     posY: { value: -0, min: -500, max: 500, step: 1 },
    //     posZ: { value: 0, min: -500, max: 500, step: 1 },
    //     rotX: { value: -0.32, min: -Math.PI, max: Math.PI, step: 0.01 },
    //     rotY: { value: -0.06, min: -Math.PI, max: Math.PI, step: 0.01 },
    //     rotZ: { value: 0.34, min: -Math.PI, max: Math.PI, step: 0.01 },
    // })

    const leva = {
        posX: 206,
        posY: 0,
        posZ: 0,
        rotX: -0.32,
        rotY: -0.06,
        rotZ: 0.34,
    }

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
            distortionScale: 1.5,
            fog: false,
            format: gl.capabilities.isWebGL2 ? THREE.RGBAFormat : THREE.RGBFormat,
            clipBias: 0.1,
            alpha: 1.0,
        }),
        [waterNormals, gl.capabilities.isWebGL2],
    )

    const water = useMemo(() => {
        const w = new Water(geom, config)
        // console.log(w)
        if (w.material) {
            w.material.toneMapped = true
            w.material.blending = THREE.NoBlending
        }

        return w
    }, [geom, config])

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.position.set(leva.posX, leva.posY, leva.posZ)
            groupRef.current.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
        }
        if (isShowOceanRef.current) {
            if (waterRef.current && (waterRef.current as any).material?.uniforms?.time) {
                ;(waterRef.current as any).material.uniforms.time.value += delta * 0.3
            }

            if ((waterRef.current as any)?.material?.uniforms?.normalSampler) {
                const normalScale = (waterRef.current as any).material.uniforms.normalScale
                if (normalScale && normalScale.value && waterNormals) {
                    waterNormals.offset.x += delta * -0.008
                }
            }
        }
    })

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.layers.set(0)
        }
    }, [])

    useGSAP(() => {
        if (!groupRef.current || !isAccess) return

        const tl = gsap.timeline({
            defaults: {
                ease: 'power2.inOut',
            },
        })

        gsap.to(leva, {
            rotX: 0,
            rotZ: 0,
            duration: 3,
            scrollTrigger: {
                trigger: '#profile',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
                // markers: true,
                onUpdate: () => {
                    if (groupRef.current) {
                        // console.log('rotX:', leva.rotX, 'rotY:', leva.rotY, 'rotZ:', leva.rotZ)
                        // groupRef.current.rotation.set(leva.rotX, leva.rotY, leva.rotZ)
                    }
                },
            },
            onEnter: () => (isShowOceanRef.current = true),
        })

        // gsap.to(leva, {
        //     rotX: -0.32,
        //     rotZ: 0.34,
        //     duration: 3,
        //     scrollTrigger: {
        //         trigger: '#about',
        //         start: 'top top',
        //         end: '200px top',
        //         scrub: 1.5,
        //         // markers: true,
        //     },

        // })
    }, [isAccess])

    // Add to layer 2
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.layers.set(0)
        }
    }, [])

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
