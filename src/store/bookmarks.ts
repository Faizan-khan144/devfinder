import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedDev {
  login: string
  name: string | null
  bio: string | null
  followers: number
  repos: number
  stars: number
  savedAt: number
}

interface BookmarkState {
  saved: SavedDev[]
  recent: string[]
  toggle: (dev: SavedDev) => void
  remove: (login: string) => void
  isSaved: (login: string) => boolean
  addRecent: (login: string) => void
  clearRecent: () => void
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      saved: [],
      recent: [],
      toggle: (dev) =>
        set((state) => {
          const exists = state.saved.some((item) => item.login.toLowerCase() === dev.login.toLowerCase())
          return {
            saved: exists
              ? state.saved.filter((item) => item.login.toLowerCase() !== dev.login.toLowerCase())
              : [dev, ...state.saved],
          }
        }),
      remove: (login) =>
        set((state) => ({
          saved: state.saved.filter((item) => item.login.toLowerCase() !== login.toLowerCase()),
        })),
      isSaved: (login) => get().saved.some((item) => item.login.toLowerCase() === login.toLowerCase()),
      addRecent: (login) =>
        set((state) => ({
          recent: [login, ...state.recent.filter((item) => item.toLowerCase() !== login.toLowerCase())].slice(0, 6),
        })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: 'devfinder:v1' },
  ),
)
