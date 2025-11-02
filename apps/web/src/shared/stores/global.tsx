import { create } from 'zustand'

interface Global {
    oceanIntensity: number
    setOceanIntensity: (v: number) => void
    isPageLoading: boolean
    setIsPageLoading: (loading: boolean) => void
}

export const useGlobal = create<Global>((set) => ({
    oceanIntensity: 0,
    setOceanIntensity: (v: number) => set({ oceanIntensity: v }),
    isPageLoading: true,
    setIsPageLoading: (loading: boolean) => set({ isPageLoading: loading }),
}))
