import { create } from 'zustand'
import { HomePageData } from 'types'

interface HomeState {
    data: HomePageData | null
    setData: (payload: HomePageData | null) => void
}

export const useHomeStore = create<HomeState>((set) => ({
    data: null,
    setData: (payload) => set({ data: payload }),
}))
