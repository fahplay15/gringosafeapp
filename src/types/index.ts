export type UserRole = 'tourist' | 'local' | 'merchant' | null

export type PinStatus = 'trusted' | 'alert' | 'gold' | 'unverified'

export interface Vendor {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  status: PinStatus
  rating: number
  votes: number
  prices: PriceItem[]
  cnpj?: string
  isPremium?: boolean
}

export interface PriceItem {
  id: string
  name: string
  value: number
  unit: string
  reportedBy: string
  timestamp: number
}

export interface PriceQuery {
  id: string
  question: string
  image?: string
  lat: number
  lng: number
  askedAt: number
  status: 'open' | 'answered'
  answers: QueryAnswer[]
}

export interface QueryAnswer {
  id: string
  responderId: string
  responderName: string
  fairPrice: number
  message: string
  votes: number
  timestamp: number
}

export interface LocalUser {
  id: string
  name: string
  balance: number
  reports: number
  answers: number
}
