import { create } from 'zustand'
import type { UserRole, Vendor, PriceQuery, LocalUser, PriceItem, QueryAnswer } from '../types'
import { mockVendors, mockQueries } from '../data/mockData'

interface AppState {
  role: UserRole
  setRole: (role: UserRole) => void

  vendors: Vendor[]
  queries: PriceQuery[]
  selectedVendor: Vendor | null
  setSelectedVendor: (v: Vendor | null) => void

  radarActive: boolean
  toggleRadar: () => void

  localUser: LocalUser
  addBalance: (amount: number) => void
  addPriceReport: (vendorId: string, item: PriceItem) => void
  addVendor: (vendor: Vendor) => void
  voteVendor: (vendorId: string, isPositive: boolean) => void

  activeQuery: PriceQuery | null
  setActiveQuery: (q: PriceQuery | null) => void
  addQuery: (q: PriceQuery) => void
  answerQuery: (queryId: string, answer: QueryAnswer) => void

  showQueryModal: boolean
  setShowQueryModal: (v: boolean) => void

  showRegisterModal: boolean
  setShowRegisterModal: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),

  vendors: mockVendors,
  queries: mockQueries,
  selectedVendor: null,
  setSelectedVendor: (selectedVendor) => set({ selectedVendor }),

  radarActive: false,
  toggleRadar: () => set((s) => ({ radarActive: !s.radarActive })),

  localUser: {
    id: 'local_user_1',
    name: 'Você (Avaliador)',
    balance: 7.5,
    reports: 12,
    answers: 8,
  },
  addBalance: (amount) =>
    set((s) => ({ localUser: { ...s.localUser, balance: s.localUser.balance + amount } })),

  addPriceReport: (vendorId, item) =>
    set((s) => ({
      vendors: s.vendors.map((v) =>
        v.id === vendorId
          ? { ...v, prices: [item, ...v.prices], status: v.status === 'unverified' ? 'trusted' : v.status }
          : v
      ),
    })),

  addVendor: (vendor) => set((s) => ({ vendors: [...s.vendors, vendor] })),

  voteVendor: (vendorId, isPositive) =>
    set((s) => ({
      vendors: s.vendors.map((v) => {
        if (v.id !== vendorId) return v
        const newVotes = v.votes + 1
        const newRating = isPositive
          ? Math.min(5, v.rating + (5 - v.rating) * 0.1)
          : Math.max(1, v.rating - v.rating * 0.15)
        const newStatus =
          newRating >= 4 ? 'trusted' : newRating < 2.5 ? 'alert' : v.status
        return { ...v, votes: newVotes, rating: parseFloat(newRating.toFixed(1)), status: newStatus }
      }),
    })),

  activeQuery: null,
  setActiveQuery: (activeQuery) => set({ activeQuery }),
  addQuery: (q) => set((s) => ({ queries: [q, ...s.queries] })),
  answerQuery: (queryId, answer) =>
    set((s) => ({
      queries: s.queries.map((q) =>
        q.id === queryId
          ? { ...q, answers: [...q.answers, answer], status: 'answered' }
          : q
      ),
    })),

  showQueryModal: false,
  setShowQueryModal: (showQueryModal) => set({ showQueryModal }),

  showRegisterModal: false,
  setShowRegisterModal: (showRegisterModal) => set({ showRegisterModal }),
}))
