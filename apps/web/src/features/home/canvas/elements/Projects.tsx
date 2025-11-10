/* eslint-disable react/no-unknown-property */
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { useFrame, useLoader } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Helper: set image UV to cover (center crop) on mesh
function setTextureCoverUVFull(texture: THREE.Texture, imageAspect: number, meshAspect: number) {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    texture.center.set(0.5, 0.5)

    if (imageAspect > meshAspect) {
        // Fit height, crop sides
        const repeatX = meshAspect / imageAspect
        texture.repeat.set(repeatX, 1)
    } else {
        // Fit width, crop top/bottom
        const repeatY = imageAspect / meshAspect
        texture.repeat.set(1, repeatY)
    }
    texture.offset.set(0.5 - texture.repeat.x / 2, 0.5 - texture.repeat.y / 2)
    texture.needsUpdate = true
}

// Shader code for rounded mask
const vertexShader = `
varying vec2 vUv;
void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uWidth;
uniform float uHeight;
uniform float uRadius;
uniform float uOpacity;
varying vec2 vUv;

// SDF for rounded rectangle from IQ/Shadertoy
float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return length(max(d, 0.0)) - r + min(max(d.x, d.y), 0.0);
}

void main(){
  vec4 tex = texture2D(uTexture, vUv);
        
    float w = uWidth * 0.5;
    float h = uHeight * 0.5;
    vec2 p = vec2(vUv.x * uWidth - w, vUv.y * uHeight - h);
    float radius = min(uRadius, min(w, h));

    // Distance field for rounded box
    float sdf = roundedBoxSDF(p, vec2(w, h) - vec2(radius), radius);

    // Antialiased edges
    float antiAlias = fwidth(sdf) * 2.0;
    float alpha = smoothstep(0.0, -antiAlias, sdf);
    if (alpha < 0.01) discard;

    // --- Border glow logic ---
    float borderThickness = 0.0; // pixels, chỉnh cho phù hợp
    float borderMask = smoothstep(borderThickness, 1.0, abs(sdf)); 

    // Màu sáng của border
    vec3 baseColor = tex.rgb;
    vec3 glowColor = mix(baseColor, baseColor * 1.1, borderMask);

    gl_FragColor = vec4(glowColor, tex.a * uOpacity);
}
`

interface ImageCardProps {
    width?: number
    height?: number
    radius?: number
    textureUrl?: string
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number
    opacity?: number
    animated?: boolean
    cardIdx?: number
    gsapDataRefs?: {
        positionRef: React.MutableRefObject<[number, number, number]>
        rotationRef: React.MutableRefObject<[number, number, number]>
        scaleRef: React.MutableRefObject<number>
        opacityRef: React.MutableRefObject<number>
    }
}

function ImageCard({
    width = 3.6,
    height = 2.2,
    radius = 0.1,
    textureUrl = 'images/img_project_1.jpg',
    position = [5, 30, 40],
    rotation = [0, 1, 0],
    scale = 30,
    opacity = 1,
    animated = false,
    cardIdx,
    gsapDataRefs,
}: ImageCardProps) {
    const texture = useLoader(THREE.TextureLoader, textureUrl)

    useMemo(() => {
        if (texture && texture.image && texture.image.width && texture.image.height) {
            const imageAspect = texture.image.width / texture.image.height
            const meshAspect = width / height
            setTextureCoverUVFull(texture, imageAspect, meshAspect)
        }
    }, [texture, width, height])

    // Use a simple plane geometry (rounded border handled in shader)
    const geometry = useMemo(() => {
        return new THREE.PlaneGeometry(width, height, 1, 1)
    }, [width, height])

    // ShaderMaterial with rounded corner mask; explicitly disable tone mapping
    const material = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uWidth: { value: width },
                uHeight: { value: height },
                uRadius: { value: radius },
                uOpacity: { value: opacity },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
        })
        mat.toneMapped = false

        return mat
    }, [texture, width, height, radius, opacity])

    // If size, radius, opacity, or texture changes, update uniforms for the material
    useEffect(() => {
        if (
            material.uniforms?.uWidth?.value !== undefined &&
            material.uniforms.uWidth.value !== width
        ) {
            material.uniforms.uWidth.value = width
        }
        if (
            material.uniforms?.uHeight?.value !== undefined &&
            material.uniforms.uHeight.value !== height
        ) {
            material.uniforms.uHeight.value = height
        }
        if (
            material.uniforms?.uRadius?.value !== undefined &&
            material.uniforms.uRadius.value !== radius
        ) {
            material.uniforms.uRadius.value = radius
        }
        if (
            material.uniforms?.uTexture?.value !== undefined &&
            material.uniforms.uTexture.value !== texture
        ) {
            material.uniforms.uTexture.value = texture
        }
        if (
            material.uniforms?.uOpacity?.value !== undefined &&
            material.uniforms.uOpacity.value !== opacity
        ) {
            material.uniforms.uOpacity.value = opacity
        }
    }, [material, width, height, radius, texture, opacity])

    // Animate mesh via useFrame and refs
    const meshRef = useRef<THREE.Mesh>(null)

    // Use gsapDataRefs for correct animation/scroll-triggering support
    useFrame(() => {
        if (meshRef.current) {
            // Use GSAP refs if animating, otherwise props
            const p =
                animated && gsapDataRefs?.positionRef ? gsapDataRefs.positionRef.current : position
            const r =
                animated && gsapDataRefs?.rotationRef ? gsapDataRefs.rotationRef.current : rotation
            const s = animated && gsapDataRefs?.scaleRef ? gsapDataRefs.scaleRef.current : scale
            const o =
                animated && gsapDataRefs?.opacityRef ? gsapDataRefs.opacityRef.current : opacity

            meshRef.current.position.set(p[0], p[1], p[2])
            meshRef.current.rotation.set(r[0], r[1], r[2])
            if (typeof s === 'number') {
                meshRef.current.scale.setScalar(s)
            }
            // Update shader opacity from GSAP ref
            if (material.uniforms?.uOpacity) {
                material.uniforms.uOpacity.value = o
            }
        }
    })

    const shaderControls = useControls('Glow Card', {
        falloff: { value: 1.4, min: 0.0, max: 10.0 },
        glowSharpness: {
            value: 0.0,
            min: 0.0,
            max: 10.0,
        },
        glowColor: { value: 'fd5d00' },
        glowInternalRadius: {
            value: 1.5,
            min: -5.0,
            max: 5.0,
        },
        opacity: {
            value: 0.8,
            min: 0.0,
            max: 1.0,
        },
        depthTest: false,
    })

    return (
        <>
            <mesh ref={meshRef} geometry={geometry} material={material} />
        </>
    )
}

type ProjectCard = {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
    opacity: number
    imageUrl: string
}

export default function Projects() {
    // Card layout constants
    const CARD_COUNT = 8
    const CARD_SCALE = 10
    const CARD_OPACITY = 0.05

    const cardLayout = {
        y: 12,
        zStart: 30,
        zSpacing: 55,
        xOffset: 50,
    }

    // Utility for vh units
    const vh = (coef: number) => window.innerHeight * (coef / 100)

    // Compute position for a project card
    const computeCardPosition = (idx: number, isEven: boolean): [number, number, number] => {
        const { y, zStart, zSpacing, xOffset } = cardLayout
        const x = isEven ? idx * xOffset * -1.1 + 4 : idx * xOffset * -1.1 - 8
        const z = zStart - (isEven ? idx * zSpacing + 4 : idx * zSpacing - 10)
        return [x, y, z]
    }

    // Create a ProjectCard instance
    const createCard = (idx: number): ProjectCard => {
        const isEven = idx % 2 === 0
        return {
            position: computeCardPosition(idx, isEven),
            rotation: [0, isEven ? 0.3 : 1.3, 0],
            scale: CARD_SCALE,
            opacity: CARD_OPACITY,
            imageUrl: `images/img_project_${idx + 1}.avif`,
        }
    }

    // Initialize all cards once
    const [cards] = useState<ProjectCard[]>(() =>
        Array.from({ length: CARD_COUNT }, (_, idx) => createCard(idx)),
    )

    // Prepare GSAP refs for each card
    const cardRefs = useRef(
        cards.map((card) => ({
            positionRef: { current: [...card.position] as [number, number, number] },
            rotationRef: { current: [...card.rotation] as [number, number, number] },
            scaleRef: { current: card.scale },
            opacityRef: { current: card.opacity },
        })),
    ).current

    // Mutable refs for animated group position/scale
    const groupSecondPosRef = useRef<[number, number, number]>([36, 0, 0])
    const groupFirstPosRef = useRef<[number, number, number]>([-292, 0, -285])
    const groupFirstScaleRef = useRef<[number, number, number]>([0, 0, 0])

    // Three.js group refs
    const groupRefSecond = useRef<THREE.Group>(null)
    const groupRefFirst = useRef<THREE.Group>(null)

    // To trigger rerender on GSAP update
    const [, setRenderTick] = useState(0)
    const isAccess = useGlobal((state) => state.isAccess)

    // Animate group scaling in (first group) on scroll
    useGSAP(() => {
        if (!isAccess) return
        const groupState = {
            px: groupFirstPosRef.current[0],
            py: groupFirstPosRef.current[1],
            pz: groupFirstPosRef.current[2],
            sx: groupFirstScaleRef.current[0],
            sy: groupFirstScaleRef.current[1],
            sz: groupFirstScaleRef.current[2],
        }

        gsap.to(groupState, {
            sx: 1,
            sy: 1,
            sz: 1,
            scrollTrigger: {
                trigger: '.tt-heading-wrapper',
                start: 'top 70%',
                end: 'top top',
                onUpdate: () => {
                    groupFirstScaleRef.current[0] = groupState.sx
                    groupFirstScaleRef.current[1] = groupState.sy
                    groupFirstScaleRef.current[2] = groupState.sz
                },
            },
        })

        gsap.to(groupState, {
            px: 0,
            pz: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: '.tt-heading-wrapper',
                start: 'top 70%',
                end: '400% 30%',
                scrub: 2,
            },
            onUpdate: () => {
                groupFirstPosRef.current[0] = groupState.px
                groupFirstPosRef.current[1] = groupState.py
                groupFirstPosRef.current[2] = groupState.pz
            },
        })
    }, [isAccess])

    // Animate group scroll on z/x (second group)
    useGSAP(() => {
        if (!isAccess) return
        const groupPosState = {
            px: groupSecondPosRef.current[0],
            py: groupSecondPosRef.current[1],
            pz: groupSecondPosRef.current[2],
        }

        gsap.to(groupPosState, {
            px: groupPosState.px + cardLayout.zSpacing * cards.length,
            pz: groupPosState.pz + cardLayout.zSpacing * cards.length,
            ease: 'none',
            scrollTrigger: {
                trigger: '#gsap-projects-trigger',
                start: 'top top',
                end: () => `${vh(100 * cardRefs.length - 1)} bottom`,
                pin: false,
                scrub: true,
            },
            onUpdate: () => {
                groupSecondPosRef.current[0] = groupPosState.px
                groupSecondPosRef.current[1] = groupPosState.py
                groupSecondPosRef.current[2] = groupPosState.pz
                setRenderTick((t) => t + 1)
            },
        })
    }, [isAccess])

    // Card opacity & rotation on scroll, with info fade
    useGSAP(() => {
        if (!isAccess) return

        const cardsInfo = document.querySelectorAll('.gsap-project-info')
        const itemCount = cards.length
        const totalScrollHeight = (itemCount - 1) * 100
        const perMeshHeight = totalScrollHeight / itemCount
        const overlap = 10

        cards.forEach((card, idx) => {
            const isEven = idx % 2 === 0
            const state = {
                px: card.position[0],
                py: card.position[1],
                pz: card.position[2],
                rx: card.rotation[0],
                ry: card.rotation[1],
                rz: card.rotation[2],
                sc: card.scale,
                op: card.opacity,
            }

            const startMesh = Math.max(idx * perMeshHeight - overlap, 0)
            const endMesh = Math.max((idx + 1) * perMeshHeight - overlap, 0)

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#gsap-projects-trigger',
                    start: `${vh(startMesh)} top`,
                    end: `${vh(endMesh)} top`,
                    pin: false,
                    scrub: 2,
                },
            })

            tl.to(
                cardsInfo[idx]!,
                {
                    autoAlpha: 1,
                    duration: 2,
                    pointerEvents: 'auto',
                },
                0,
            ).to(
                cardsInfo[idx]!,
                {
                    autoAlpha: 0,
                    duration: 2,
                    pointerEvents: 'none',
                },
                4,
            )

            tl.to(
                state,
                {
                    op: 1,
                    duration: 2,
                    onUpdate: () => {
                        cardRefs[idx]!.opacityRef.current = state.op
                    },
                },
                0,
            )
                .to(
                    state,
                    {
                        ry: 0.8,
                        duration: 5,
                        onUpdate: () => {
                            cardRefs[idx]!.rotationRef.current = [state.rx, state.ry, state.rz]
                        },
                    },
                    0,
                )
                .to(
                    state,
                    {
                        op: 0,
                        duration: 2,
                        onUpdate: () => {
                            cardRefs[idx]!.opacityRef.current = state.op
                        },
                    },
                    4,
                )
        })
    }, [isAccess])

    // Sync Three.js group transforms with animated refs
    useFrame(() => {
        if (groupRefSecond.current) {
            groupRefSecond.current.position.set(...groupSecondPosRef.current)
        }
        if (groupRefFirst.current) {
            groupRefFirst.current.position.set(...groupFirstPosRef.current)
            groupRefFirst.current.scale.set(...groupFirstScaleRef.current)
        }
    })

    return (
        <group
            ref={groupRefFirst}
            position={groupFirstPosRef.current}
            scale={groupFirstScaleRef.current}
            layers={10}
        >
            <group ref={groupRefSecond} position={groupSecondPosRef.current} rotation={[0, 0, 0]}>
                {cards.map((item, idx) => (
                    <ImageCard
                        key={`${item.imageUrl}_${idx}_${item.position.join('_')}`}
                        position={item.position}
                        rotation={item.rotation}
                        scale={item.scale}
                        opacity={item.opacity}
                        textureUrl={item.imageUrl}
                        animated={true}
                        cardIdx={idx}
                        gsapDataRefs={cardRefs[idx]}
                    />
                ))}
            </group>
        </group>
    )
}
