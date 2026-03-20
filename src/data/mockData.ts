import type { Vendor, PriceQuery } from '../types'

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFocGxheTE1IiwiYSI6ImNtbXk2Z3UzMDB2YnYyb3BsMTA2ZzV2NmkifQ.Tvdrpof80mAktc3Z3dB3cw'

export const INITIAL_CENTER: [number, number] = [-34.8631, -7.115]

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Barraca do Seu Zé',
    type: 'Barraca de Praia',
    lat: -7.1189,
    lng: -34.8672,
    status: 'trusted',
    rating: 4.8,
    votes: 142,
    prices: [
      { id: 'p1', name: 'Caipirinha', value: 12, unit: 'unid', reportedBy: 'Maria S.', timestamp: Date.now() - 3600000 },
      { id: 'p2', name: 'Água de Coco', value: 8, unit: 'unid', reportedBy: 'Carlos M.', timestamp: Date.now() - 7200000 },
      { id: 'p3', name: 'Cadeira + Guarda-sol', value: 20, unit: 'dia', reportedBy: 'Ana P.', timestamp: Date.now() - 1800000 },
    ],
  },
  {
    id: '2',
    name: 'Quiosque Maré Alta',
    type: 'Quiosque',
    lat: -7.1215,
    lng: -34.8701,
    status: 'gold',
    rating: 4.9,
    votes: 318,
    isPremium: true,
    cnpj: '12.345.678/0001-99',
    prices: [
      { id: 'p4', name: 'Caipirinha', value: 14, unit: 'unid', reportedBy: 'Joana T.', timestamp: Date.now() - 900000 },
      { id: 'p5', name: 'Prato feito', value: 25, unit: 'unid', reportedBy: 'Joana T.', timestamp: Date.now() - 1200000 },
      { id: 'p6', name: 'Cerveja 600ml', value: 10, unit: 'unid', reportedBy: 'Joana T.', timestamp: Date.now() - 600000 },
    ],
  },
  {
    id: '3',
    name: 'Vendedor Ambulante #47',
    type: 'Ambulante',
    lat: -7.116,
    lng: -34.8645,
    status: 'alert',
    rating: 1.8,
    votes: 55,
    prices: [
      { id: 'p7', name: 'Água mineral', value: 15, unit: 'unid', reportedBy: 'Roberto F.', timestamp: Date.now() - 400000 },
      { id: 'p8', name: 'Caipirinha', value: 35, unit: 'unid', reportedBy: 'Lúcia A.', timestamp: Date.now() - 500000 },
    ],
  },
  {
    id: '4',
    name: 'Restaurante Sol Nascente',
    type: 'Restaurante',
    lat: -7.1135,
    lng: -34.8688,
    status: 'trusted',
    rating: 4.5,
    votes: 89,
    cnpj: '98.765.432/0001-11',
    prices: [
      { id: 'p9', name: 'Frutos do Mar', value: 65, unit: 'porção', reportedBy: 'Dono', timestamp: Date.now() - 86400000 },
      { id: 'p10', name: 'Caipirinha', value: 16, unit: 'unid', reportedBy: 'Dono', timestamp: Date.now() - 86400000 },
    ],
  },
  {
    id: '5',
    name: 'Barraca da Dona Fátima',
    type: 'Barraca de Praia',
    lat: -7.1245,
    lng: -34.862,
    status: 'unverified',
    rating: 0,
    votes: 0,
    prices: [],
  },
]

export const mockQueries: PriceQuery[] = [
  {
    id: 'q1',
    question: 'Quanto custa o aluguel de cadeira e guarda-sol aqui perto?',
    lat: -7.1195,
    lng: -34.866,
    askedAt: Date.now() - 1200000,
    status: 'open',
    answers: [
      {
        id: 'a1',
        responderId: 'local1',
        responderName: 'Carlos M.',
        fairPrice: 20,
        message: 'Aqui na Praia de Tambaú o preço justo é R$20 o dia com guarda-sol.',
        votes: 8,
        timestamp: Date.now() - 900000,
      },
    ],
  },
  {
    id: 'q2',
    question: 'Caipirinha por R$40 aqui na praia, é normal?',
    lat: -7.1148,
    lng: -34.869,
    askedAt: Date.now() - 600000,
    status: 'open',
    answers: [],
  },
]
