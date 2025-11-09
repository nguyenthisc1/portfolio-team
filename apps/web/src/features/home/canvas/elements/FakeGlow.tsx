/* eslint-disable react/no-unknown-property */
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, BackSide, Color, DoubleSide, FrontSide } from 'three'

const FakeGlowMat = shaderMaterial(
    {
        falloffAmount: 0.1,
        glowInternalRadius: 6.0,
        glowColor: new Color('#00ff00'),
        glowSharpness: 1.0,
        opacity: 1.0,
    },
    // Vertex shader
    `
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
  }`,
    // Fragment shader
    `
  uniform vec3 glowColor;
  uniform float falloffAmount;
  uniform float glowSharpness;
  uniform float glowInternalRadius;
  uniform float opacity;

  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= -1.0;
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = dot(viewDirection, normal);
    fresnel = pow(fresnel, glowInternalRadius + 0.1);
    float falloff = smoothstep(0., falloffAmount, fresnel);
    float fakeGlow = fresnel;
    fakeGlow += fresnel * glowSharpness;
    fakeGlow *= falloff;
    gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., opacity));

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
)

extend({ FakeGlowMaterial: FakeGlowMat })

const sideToConst = (side: string | number) => {
    if (typeof side === 'number') return side
    switch (side) {
        case 'THREE.BackSide':
        case 'BackSide':
            return BackSide
        case 'THREE.DoubleSide':
        case 'DoubleSide':
            return DoubleSide
        default:
            return FrontSide
    }
}

const FakeGlowMaterial = ({
    falloff = 0.1,
    glowInternalRadius = 6.0,
    glowColor = '#00ff00',
    glowSharpness = 1.0,
    side = 'FrontSide',
    depthTest = false,
    opacity = 1.0,
}) => {
    const uniforms = useMemo(
        () => ({
            falloffAmount: falloff,
            glowInternalRadius,
            glowColor: new Color(glowColor),
            glowSharpness,
            opacity,
        }),
        [falloff, glowInternalRadius, glowColor, glowSharpness, opacity],
    )

    return (
        // @ts-ignore
        <fakeGlowMaterial
            attach="material"
            {...uniforms}
            transparent
            blending={AdditiveBlending}
            depthTest={depthTest}
            side={sideToConst(side)}
        />
    )
}

export default FakeGlowMaterial
