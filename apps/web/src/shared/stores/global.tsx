import { create } from 'zustand'

interface Global {
    isOceanIntensity: boolean
    setIsOceanIntensity: (v: boolean) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    isAccess: boolean
    setIsAccess: (access: boolean) => void
}

export const useGlobal = create<Global>((set) => ({
    isOceanIntensity: false,
    setIsOceanIntensity: (v: boolean) => set({ isOceanIntensity: v }),
    isLoading: true,
    setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    isAccess: false,
    setIsAccess: (access: boolean) => set({ isAccess: access }),
}))
