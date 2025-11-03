import { create } from 'zustand'

interface Global {
    oceanIntensity: number
    setOceanIntensity: (v: number) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    isAccess: boolean
    setIsAccess: (loading: boolean) => void
}

export const useGlobal = create<Global>((set) => ({
    oceanIntensity: 0,
    setOceanIntensity: (v: number) => set({ oceanIntensity: v }),
    isLoading: true,
    setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    isAccess: false,
    setIsAccess: (loading: boolean) => set({ isAccess: loading }),
}))
