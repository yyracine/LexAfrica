'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import { api } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, company_name?: string, country?: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const data = await api.auth.login({ email, password }) as { access_token: string; user: User }
        set({ token: data.access_token, user: data.user })
      },

      register: async (email, password, company_name, country) => {
        const data = await api.auth.register({ email, password, company_name, country }) as { access_token: string; user: User }
        set({ token: data.access_token, user: data.user })
      },

      logout: () => set({ user: null, token: null }),
    }),
    { name: 'lexafrica-auth' }
  )
)
