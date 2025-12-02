/* eslint-disable react/no-unknown-property */
import { useGlobal } from '@/shared/stores/global'
import { useGSAP } from '@gsap/react'
import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Project } from 'types'

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
    float sdf = roundedBoxSDF(p, vec2(w, h) - vec2(radius) + 0.1, radius);

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

// Lazy load image in Three.js (textureLoader) when in view/frustum
function useLazyTexture(
    url: string | undefined,
    meshRef: React.RefObject<THREE.Mesh>,
    onProgress?: (loaded: boolean) => void,
) {
    const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined)
    const [loaded, setLoaded] = useState(false)
    const { camera } = useThree()

    useEffect(() => {
        if (!url) return
        setLoaded(false)
        setTexture(undefined)
        if (!meshRef.current) return

        let cancelled = false

        // Helper: Load texture
        const load = () => {
            const loader = new THREE.TextureLoader()
            loader.load(
                url,
                (tex) => {
                    if (!cancelled) {
                        setTexture(tex)
                        setLoaded(true)
                        onProgress?.(true)
                    }
                },
                undefined,
                () => {
                    if (!cancelled) setLoaded(false)
                },
            )
        }

        // Frustum/laziness
        let animationId: number

        function checkVisibility() {
            if (!meshRef.current) {
                animationId = requestAnimationFrame(checkVisibility)
                return
            }
            // Compute world position for mesh center
            meshRef.current.updateWorldMatrix(true, false)
            const position = new THREE.Vector3()
            meshRef.current.getWorldPosition(position)
            // Frustum test
            const frustum = new THREE.Frustum()
            const viewProj = new THREE.Matrix4()
            camera.updateMatrixWorld()
            camera.updateProjectionMatrix()
            viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
            frustum.setFromProjectionMatrix(viewProj)

            if (frustum.containsPoint(position)) {
                load()
            } else {
                // Keep checking until it becomes visible
                animationId = requestAnimationFrame(checkVisibility)
            }
        }

        checkVisibility()

        return () => {
            cancelled = true
            if (animationId) cancelAnimationFrame(animationId)
        }
        // Only rerun if url or meshRef changes (camera static from context)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, meshRef])

    return [texture, loaded] as [THREE.Texture | undefined, boolean]
}

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

// Main component for single 'card'
function ImageCard({
    width = 5,
    height = 2.5,
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
    // Mesh ref for lazy load visibility
    const meshRef = useRef<THREE.Mesh>(null!)
    // Lazy load the card texture only if the card is entering the frustum
    const [texture, textureLoaded] = useLazyTexture(textureUrl, meshRef)

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
                uTexture: { value: texture ?? null },
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
            material.uniforms.uTexture.value = texture ?? null
        }
        if (
            material.uniforms?.uOpacity?.value !== undefined &&
            material.uniforms.uOpacity.value !== opacity
        ) {
            material.uniforms.uOpacity.value = opacity
        }
    }, [material, width, height, radius, texture, opacity])

    // Animate mesh via useFrame and refs
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

    // Optionally show a "loading" geometry if not loaded
    return (
        <>
            <mesh ref={meshRef} geometry={geometry} material={material}>
                {/* optionally add fallback here if !textureLoaded */}
                {/* { !textureLoaded && <SomeThreeJsLoader /> } */}
            </mesh>
        </>
    )
}

type ProjectCard = {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
    opacity: number
    imageUrl: string
    category: string
    name: string
}

export default function Projects({ data }: { data: Project[] }) {
    // Card layout constants
    const CARD_SCALE = 10
    const CARD_OPACITY = 0.05
    const CARD_LAYOUT = {
        y: 16,
        zStart: 30,
        zSpacing: 55,
        xOffset: 50,
    }
    // Utility for vh units
    const vh = (coef: number) => window.innerHeight * (coef / 100)

    // Compute position for a project card
    const computeCardPosition = (idx: number, isEven: boolean): [number, number, number] => {
        const { y, zStart, zSpacing, xOffset } = CARD_LAYOUT
        const x = isEven ? idx * xOffset * -1.1 + 4 : idx * xOffset * -1.1 - 8
        const z = zStart - (isEven ? idx * zSpacing + 4 : idx * zSpacing - 10)
        return [x, y, z]
    }

    // Create a ProjectCard instance
    const createCard = (
        idx: number,
        imageUrl: string,
        category: string,
        name: string,
    ): ProjectCard => {
        const isEven = idx % 2 === 0
        return {
            position: computeCardPosition(idx, isEven),
            rotation: [0, isEven ? 0.3 : 1.3, 0],
            scale: CARD_SCALE,
            opacity: CARD_OPACITY,
            category: category,
            imageUrl: imageUrl,
            name: name,
        }
    }

    // Initialize all cards once
    const [cards] = useState(() =>
        data.flatMap((category, cIdx) =>
            category.items.map((item, idx) =>
                createCard(
                    idx + cIdx * category.items.length,
                    item.image,
                    category.category,
                    item.name,
                ),
            ),
        ),
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

    // Stateful card name refs for opacity and rotation
    const [cardNameRefs] = useState(() =>
        cards.map((card) => ({
            opacityRef: { current: card.opacity },
            rotationRef: { current: [0, 0.65, 0] as [number, number, number] },
        })),
    )

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

        const updateProjectsMenuOpacity = (opacity: string) => {
            const projectsMenu = document.querySelector('.projects-menu')
            if (projectsMenu instanceof HTMLElement) {
                projectsMenu.style.opacity = opacity
            }
        }

        const totalSpacing = CARD_LAYOUT.zSpacing * cards.length

        gsap.to(groupPosState, {
            px: groupPosState.px + totalSpacing,
            pz: groupPosState.pz + totalSpacing,
            ease: 'none',
            scrollTrigger: {
                trigger: '#gsap-projects-trigger',
                start: 'top top',
                end: () => `${vh(100 * cardRefs.length - 1)} bottom`,
                pin: false,
                scrub: true,
                onEnter: () => updateProjectsMenuOpacity('1'),
                onLeave: () => updateProjectsMenuOpacity('0'),
                onEnterBack: () => updateProjectsMenuOpacity('1'),
                onLeaveBack: () => updateProjectsMenuOpacity('0'),
                onUpdate: (self) => {
                    const el = document.querySelector('.projects-menu-dots') as HTMLElement
                    if (el) {
                        const progressPercent = self.progress * 100
                        el.style.setProperty('--progress-percent', progressPercent.toString() + '%')
                    }
                },
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

        // Util to handle category element class manipulation
        const getCategoryElement = (category: string) =>
            document.querySelector(`[data-category="${category}"]`) as HTMLElement | null

        const createCardTimeline = ({
            idx,
            category,
            state,
            infoEl,
            cardRef,
            cardNameRef,
            startMesh,
            endMesh,
        }: {
            idx: number
            category: string
            state: any
            infoEl: Element
            cardRef: any
            cardNameRef: any
            startMesh: number
            endMesh: number
        }) => {
            const tl = gsap.timeline({
                id: category,
                scrollTrigger: {
                    trigger: '#gsap-projects-trigger',
                    start: `${vh(startMesh)} top`,
                    end: `${vh(endMesh)} top`,
                    pin: false,
                    scrub: true,
                    onEnter: () => {
                        const el = getCategoryElement(category)
                        if (el) {
                            el.classList.add('active-enter', 'active')
                        }
                    },
                    onEnterBack: () => {
                        const el = getCategoryElement(category)
                        if (el) {
                            el.classList.add('active-enter', 'active')
                        }
                    },
                    onLeave: () => {
                        const el = getCategoryElement(category)
                        if (el) {
                            el.classList.remove('active-enter')
                        }
                    },
                    onLeaveBack: () => {
                        const el = getCategoryElement(category)
                        if (el) {
                            el.classList.remove('active')
                        }
                    },
                },
            })

            // Info fade in
            tl.to(
                infoEl,
                {
                    autoAlpha: 1,
                    duration: 2,
                    pointerEvents: 'auto',
                },
                0,
            )
            // Info fade out
            tl.to(
                infoEl,
                {
                    autoAlpha: 0,
                    duration: 2,
                    pointerEvents: 'none',
                },
                4,
            )

            // Card fade in
            tl.to(
                state,
                {
                    op: 1,
                    duration: 2,
                    onUpdate: () => {
                        cardRef.opacityRef.current = state.op
                        // Name follows the same opacity
                        cardNameRef.opacityRef.current = state.op
                    },
                },
                0,
            )
            // Card rotation animation
            tl.to(
                state,
                {
                    ry: 0.8,
                    duration: 5,
                    onUpdate: () => {
                        cardRef.rotationRef.current = [state.rx, state.ry, state.rz]
                        // Sync name card rotation with card's rotation
                        cardNameRef.rotationRef.current = [state.rx, state.ry, state.rz]
                    },
                },
                0,
            )
            // Card fade out
            tl.to(
                state,
                {
                    op: 0,
                    duration: 2,
                    onUpdate: () => {
                        cardRef.opacityRef.current = state.op
                        // Name follows the same opacity
                        cardNameRef.opacityRef.current = state.op
                    },
                },
                4,
            )

            return tl
        }

        let cardIdx = 0
        data.forEach((project) => {
            const category = project.category
            project.items.forEach(() => {
                const idx = cardIdx
                const card = cards[idx]!
                const cardRef = cardRefs[idx]!
                const cardNameRef = cardNameRefs[idx]!
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

                createCardTimeline({
                    idx,
                    category,
                    state,
                    infoEl: cardsInfo[idx]!,
                    cardRef,
                    cardNameRef,
                    startMesh,
                    endMesh,
                })

                cardIdx++
            })
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

    // Animated opacity and rotation for project names (Text) following cardNameRefs
    // Store refs per text to update material opacity
    const textMaterialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
    // Update materials' opacity and Text rotation on every frame
    useFrame(() => {
        cards.forEach((_, idx) => {
            if (textMaterialRefs.current[idx]) {
                textMaterialRefs.current[idx]!.opacity = cardNameRefs[idx]!.opacityRef.current ?? 0
            }
        })
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
                    <group key={`${item.imageUrl}_${idx}_${item.position.join('_')}`}>
                        <ImageCard
                            position={item.position}
                            rotation={item.rotation}
                            scale={item.scale}
                            opacity={item.opacity}
                            textureUrl={item.imageUrl}
                            animated={true}
                            cardIdx={idx}
                            gsapDataRefs={cardRefs[idx]}
                        />
                        <Text
                            ref={(ref) => {
                                // Extract material ref from Text
                                textMaterialRefs.current[idx] =
                                    ref && ref.material ? ref.material : null
                            }}
                            position={[item.position[0], 2.5, item.position[2]]}
                            rotation={cardNameRefs[idx]!.rotationRef.current}
                            fontSize={1}
                            color="white"
                            anchorX="center"
                            anchorY="top"
                            font="/fonts/Oswald-Bold.ttf"
                            material-transparent
                            material-opacity={cardNameRefs[idx]!.opacityRef.current}
                        >
                            {item.name}
                        </Text>
                    </group>
                ))}
            </group>
        </group>
    )
}
