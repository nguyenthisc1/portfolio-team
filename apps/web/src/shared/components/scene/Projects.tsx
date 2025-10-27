/* eslint-disable react/no-unknown-property */
import { useGSAP } from '@gsap/react' // you need to have @gsap/react installed
import { useFrame, useLoader } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
    // Map vUv (0,1) to (centered) positions in card units
    float w = uWidth * 0.5;
    float h = uHeight * 0.5;
    vec2 p = vec2(vUv.x * uWidth - w, vUv.y * uHeight - h);
    float radius = min(uRadius, min(w, h));

    float sdf = roundedBoxSDF(p, vec2(w, h) - vec2(radius), radius);

    // Opacity mask: antialiased border for soft edges
    float antiAlias = fwidth(sdf) * 2.0; // 2px feather
    float alpha = smoothstep(0.0, -antiAlias, sdf);

    if (alpha < 0.01) discard;
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = vec4(color.rgb, color.a * alpha * uOpacity);
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
    width = 2.8,
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
        if (material.uniforms?.uWidth?.value !== undefined && material.uniforms.uWidth.value !== width) {
            material.uniforms.uWidth.value = width
        }
        if (material.uniforms?.uHeight?.value !== undefined && material.uniforms.uHeight.value !== height) {
            material.uniforms.uHeight.value = height
        }
        if (material.uniforms?.uRadius?.value !== undefined && material.uniforms.uRadius.value !== radius) {
            material.uniforms.uRadius.value = radius
        }
        if (material.uniforms?.uTexture?.value !== undefined && material.uniforms.uTexture.value !== texture) {
            material.uniforms.uTexture.value = texture
        }
        if (material.uniforms?.uOpacity?.value !== undefined && material.uniforms.uOpacity.value !== opacity) {
            material.uniforms.uOpacity.value = opacity
        }
    }, [material, width, height, radius, texture, opacity])

    // Animate mesh via useFrame and refs
    const meshRef = useRef<THREE.Mesh>(null)

    // Normally, in GSAP provided below, "gsapDataRefs" will be used to update position/rotation/scale/opacity
    useFrame(() => {
        if (meshRef.current) {
            // Use GSAP refs if animating, otherwise props
            const p = animated && gsapDataRefs?.positionRef ? gsapDataRefs.positionRef.current : position
            const r = animated && gsapDataRefs?.rotationRef ? gsapDataRefs.rotationRef.current : rotation
            const s = animated && gsapDataRefs?.scaleRef ? gsapDataRefs.scaleRef.current : scale
            const o = animated && gsapDataRefs?.opacityRef ? gsapDataRefs.opacityRef.current : opacity

            meshRef.current.position.set(p[0], p[1], p[2])
            meshRef.current.rotation.set(r[0], r[1], r[2])
            if (typeof s === 'number') {
                meshRef.current.scale.setScalar(s)
            }
            // Update shader opacity from GSAP ref
            if (animated && gsapDataRefs?.opacityRef && typeof o === 'number' && material.uniforms?.uOpacity) {
                material.uniforms.uOpacity.value = o
            }
        }
    })

    return <mesh ref={meshRef} geometry={geometry} material={material} />
}

type ProjectCard = {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
    opacity: number
    imageUrl: string
}

export default function Projects() {
    // Card layout values
    const cardY = 12
    const cardZStart = 30
    const cardZSpacing = 55
    const cardXOffset = 50

    const CARD_COUNT = 8
    const CARD_SCALE = 10
    const CARD_OPACITY = 1
    const CARD_IMAGE = 'images/img_project_1.jpg'

    const computeCardPosition = (
        idx: number,
        isEven: boolean,
        cardXOffset: number,
        cardY: number,
        cardZStart: number,
        cardZSpacing: number,
    ): [number, number, number] => {
        const cardIdx = idx + 1
        const x = isEven ? cardIdx * cardXOffset * -2.4 + 16 : cardIdx * cardXOffset * -2.4 - 16
        const y = cardY
        const z = cardZStart - (isEven ? cardIdx * cardZSpacing * 2.18 - 6 : cardIdx * (cardZSpacing * 2.18) - 6)
        return [x, y, z]
    }

    const createCard = (idx: number): ProjectCard => {
        const isEven = idx % 2 === 0
        return {
            position: computeCardPosition(idx, isEven, cardXOffset, cardY, cardZStart, cardZSpacing),
            rotation: [0, isEven ? 0.5 : 1.1, 0],
            scale: CARD_SCALE,
            opacity: CARD_OPACITY,
            imageUrl: CARD_IMAGE,
        }
    }

    const [cards] = useState<ProjectCard[]>(Array.from({ length: CARD_COUNT }, (_, idx) => createCard(idx)))

    // Group position state so GSAP can animate it (must be mutable for GSAP)
    const groupPosRef = useRef<[number, number, number]>([36, 0, 0])
    // For useFrame group position update
    const [, setRenderTick] = useState(0)

    // Card refs as before
    const cardRefs = useRef(
        cards.map(card => ({
            positionRef: { current: [...card.position] as [number, number, number] },
            rotationRef: { current: [...card.rotation] as [number, number, number] },
            scaleRef: { current: card.scale },
            opacityRef: { current: card.opacity },
        })),
    ).current

    // Animate the group position with GSAP
    useGSAP(() => {
        // Cleanup old triggers on rerun (hot reload)
        ScrollTrigger.getAll().forEach(trg => trg.kill())

        // Timeline with scrollTrigger as before
        const timeline = gsap.timeline({
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: `#gsap-projects-trigger`,
                start: 'top top',
                end: '+=500% top',
                scrub: true,
                markers: true,
            },
        })

        // Group's animation state
        const groupState = {
            px: groupPosRef.current[0],
            py: groupPosRef.current[1],
            pz: groupPosRef.current[2],
        }

        // Animate the group position (can customize as needed)
        timeline.to(
            groupState,
            {
                px: groupState.px + 122 * cardRefs.length,
                py: groupState.py + 0,
                pz: groupState.pz + 122 * cardRefs.length,
                duration: 2,
                ease: 'power1.inOut',
                onUpdate: () => {
                    groupPosRef.current[0] = groupState.px
                    groupPosRef.current[1] = groupState.py
                    groupPosRef.current[2] = groupState.pz
                    setRenderTick(tick => tick + 1)
                },
            },
            0, // start of timeline
        )

        // Cards animation, unchanged except for group anim above
        cards.forEach((card, idx) => {
            const state = {
                px: card.position[0],
                py: card.position[1],
                pz: card.position[2],
                rx: card.rotation[0],
                ry: card.rotation[1],
                rz: card.rotation[2],
                sc: card.scale * 0.7,
                // op: 0.1,
            }

            // delay theo index (card thứ 2 sẽ trễ hơn card 1 một đoạn)
            const delay = 0.8 * idx

            timeline.to(
                state,
                {
                    // op: 1,
                    sc: card.scale,
                    ry: card.rotation[1] + (idx % 2 === 0 ? -0.2 : 0.2),
                    duration: 1.5,
                    ease: 'power3.out',
                    onUpdate: () => {
                        // cardRefs[idx]!.positionRef.current = [state.px, state.py, state.pz]
                        // cardRefs[idx]!.rotationRef.current = [state.rx, state.ry, state.rz]
                        // cardRefs[idx]!.scaleRef.current = state.sc
                        // cardRefs[idx]!.opacityRef.current = state.op
                    },
                },
                delay,
            )
        })

        return () => {
            // Cleanup scroll triggers and timelines on unmount
            ScrollTrigger.getAll().forEach(trg => trg.kill())
            timeline.kill()
        }
    }, [cards, cardRefs])

    // Ref for the group
    const groupRef = useRef<THREE.Group>(null)

    // Sync the Three.js group position with our animated ref
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.set(groupPosRef.current[0], groupPosRef.current[1], groupPosRef.current[2])
        }
    })

    return (
        <group ref={groupRef} position={groupPosRef.current} rotation={[0, 0, 0]}>
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
    )
}

// export default function Projects() {
//     // Replace with state for future extensibility
//     const [cards] = useState<ProjectCard[]>([
//         {
//             position: [50, 12, 30],
//             rotation: [0, 0.5, 0],
//             scale: 10,
//             opacity: 1,
//             imageUrl: 'images/img_project_1.jpg'
//         },
//         {
//             position: [-50, 12, -35],
//             rotation: [0, 1, 0],
//             scale: 10,
//             opacity: 1,
//             imageUrl: 'images/img_project_1.jpg'
//         },
//         {
//             position: [-110, 12, -140],
//             rotation: [0, 0.5, 0],
//             scale: 10,
//             opacity: 1,
//             imageUrl: 'images/img_project_1.jpg'
//         },
//     ])

//     // Group position state so GSAP can animate it (must be mutable for GSAP)
//     const groupPosRef = useRef<[number, number, number]>([0, 0, 0])
//     // For useFrame group position update
//     const [, setRenderTick] = useState(0)

//     // Card refs as before
//     const cardRefs = useRef(
//         cards.map(card => ({
//             positionRef: { current: [...card.position] as [number, number, number] },
//             rotationRef: { current: [...card.rotation] as [number, number, number] },
//             scaleRef: { current: card.scale },
//             opacityRef: { current: card.opacity }
//         }))
//     ).current

//     // Animate the group position with GSAP
//     useGSAP(() => {
//         // Cleanup old triggers on rerun (hot reload)
//         // ScrollTrigger.getAll().forEach(trg => trg.kill())

//         // Timeline with scrollTrigger as before
//         const timeline = gsap.timeline({
//             ease: 'power1.inOut',
//             scrollTrigger: {
//                 trigger: `#gsap-projects-trigger`,
//                 start: 'top top',
//                 end: '+=500% top',
//                 scrub: true,
//                 markers: true,
//             },
//         })

//         // Group's animation state
//         const groupState = {
//             px: groupPosRef.current[0],
//             py: groupPosRef.current[1],
//             pz: groupPosRef.current[2],
//         }

//         // Animate the group position (can customize as needed)
//         timeline.to(
//             groupState,
//             {
//                 px: groupState.px + 65 * cardRefs.length,
//                 py: groupState.py + 0,
//                 pz: groupState.pz + 70 * cardRefs.length,
//                 duration: 2,
//                 ease: "power1.inOut",
//                 onUpdate: () => {
//                     groupPosRef.current[0] = groupState.px
//                     groupPosRef.current[1] = groupState.py
//                     groupPosRef.current[2] = groupState.pz
//                     setRenderTick(tick => tick + 1)
//                 },
//             },
//             0 // start of timeline
//         )

//         // Cards animation, unchanged except for group anim above
//         cards.forEach((card, idx) => {
//             const state = {
//                 px: card.position[0],
//                 py: card.position[1],
//                 pz: card.position[2],
//                 rx: card.rotation[0],
//                 ry: card.rotation[1],
//                 rz: card.rotation[2],
//                 sc: card.scale * 0.7,
//                 // op: 0.1,
//             }

//             // delay theo index (card thứ 2 sẽ trễ hơn card 1 một đoạn)
//             const delay = 0.8 * idx

//             timeline.to(state, {
//                 // op: 1,
//                 sc: card.scale,
//                 ry: card.rotation[1] + (idx % 2 === 0 ? -0.2 : 0.2),
//                 duration: 1.5,
//                 ease: 'power3.out',
//                 onUpdate: () => {
//                     // cardRefs[idx]!.positionRef.current = [state.px, state.py, state.pz]
//                     // cardRefs[idx]!.rotationRef.current = [state.rx, state.ry, state.rz]
//                     // cardRefs[idx]!.scaleRef.current = state.sc
//                     // cardRefs[idx]!.opacityRef.current = state.op
//                 },
//             }, delay)
//         })

//         return () => {
//             // Cleanup scroll triggers and timelines on unmount
//             ScrollTrigger.getAll().forEach(trg => trg.kill())
//             timeline.kill()
//         }

//     }, [cards, cardRefs])

//     // Ref for the group
//     const groupRef = useRef<THREE.Group>(null)

//     // Sync the Three.js group position with our animated ref
//     useFrame(() => {
//         if (groupRef.current) {
//             groupRef.current.position.set(
//                 groupPosRef.current[0],
//                 groupPosRef.current[1],
//                 groupPosRef.current[2]
//             )
//         }
//     })

//     return (
//         <group ref={groupRef} position={groupPosRef.current}>
//             {cards.map((item, idx) =>
//                 <ImageCard
//                     key={`${item.imageUrl}_${idx}_${item.position.join('_')}`}
//                     position={item.position}
//                     rotation={item.rotation}
//                     scale={item.scale}
//                     opacity={item.opacity}
//                     textureUrl={item.imageUrl}
//                     animated={true}
//                     cardIdx={idx}
//                     gsapDataRefs={cardRefs[idx]}
//                 />
//             )}
//         </group>
//     )
// }
