import { create } from 'zustand';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase'; 
import type { UserRole, Vendor, PriceQuery, LocalUser, PriceItem, QueryAnswer } from '../types';

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;

  vendors: Vendor[];
  queries: PriceQuery[];
  selectedVendor: Vendor | null;
  setSelectedVendor: (v: Vendor | null) => void;

  radarActive: boolean;
  toggleRadar: () => void;

  localUser: LocalUser;
  addBalance: (amount: number) => void;
  addPriceReport: (vendorId: string, item: PriceItem) => void;
  addVendor: (vendor: Vendor) => void;
  voteVendor: (vendorId: string, isPositive: boolean) => void;

  activeQuery: PriceQuery | null;
  setActiveQuery: (q: PriceQuery | null) => void;
  addQuery: (q: PriceQuery) => void;
  answerQuery: (queryId: string, answer: QueryAnswer) => void;

  showQueryModal: boolean;
  setShowQueryModal: (v: boolean) => void;

  showRegisterModal: boolean;
  setShowRegisterModal: (v: boolean) => void;

  initFirebaseListeners: () => void;
}

export const useAppStore = create<AppState>((set: any) => ({
  role: 'tourist', 
  setRole: (role: UserRole) => set({ role }),

  vendors: [],
  queries: [],
  selectedVendor: null,
  setSelectedVendor: (selectedVendor: Vendor | null) => set({ selectedVendor }),

  radarActive: false,
  toggleRadar: () => set((s: AppState) => ({ radarActive: !s.radarActive })),

  localUser: {
    id: 'local_user_1',
    name: 'Você',
    balance: 0,
    reports: 0,
    answers: 0,
  },
  
  addBalance: (amount: number) =>
    set((s: AppState) => ({ localUser: { ...s.localUser, balance: s.localUser.balance + amount } })),

  addPriceReport: (vendorId: string, item: PriceItem) =>
    set((s: AppState) => ({
      vendors: s.vendors.map((v: Vendor) =>
        v.id === vendorId
          ? { ...v, prices: [item, ...v.prices], status: v.status === 'unverified' ? 'trusted' : v.status }
          : v
      ),
    })),

  addVendor: (vendor: Vendor) => set((s: AppState) => ({ vendors: [...s.vendors, vendor] })),

  voteVendor: (vendorId: string, isPositive: boolean) =>
    set((s: AppState) => ({
      vendors: s.vendors.map((v: Vendor) => {
        if (v.id !== vendorId) return v;
        const newVotes = v.votes + 1;
        const newRating = isPositive
          ? Math.min(5, v.rating + (5 - v.rating) * 0.1)
          : Math.max(1, v.rating - v.rating * 0.15);
        const newStatus =
          newRating >= 4 ? 'trusted' : newRating < 2.5 ? 'alert' : v.status;
        return { ...v, votes: newVotes, rating: parseFloat(newRating.toFixed(1)), status: newStatus };
      }),
    })),

  activeQuery: null,
  setActiveQuery: (activeQuery: PriceQuery | null) => set({ activeQuery }),
  addQuery: (q: PriceQuery) => set((s: AppState) => ({ queries: [q, ...s.queries] })),
  answerQuery: (queryId: string, answer: QueryAnswer) =>
    set((s: AppState) => ({
      queries: s.queries.map((q: PriceQuery) =>
        q.id === queryId
          ? { ...q, answers: [...q.answers, answer], status: 'answered' }
          : q
      ),
    })),

  showQueryModal: false,
  setShowQueryModal: (showQueryModal: boolean) => set({ showQueryModal }),

  showRegisterModal: false,
  setShowRegisterModal: (showRegisterModal: boolean) => set({ showRegisterModal }),

  initFirebaseListeners: () => {
    try {
      // 1. Escutando Preços
      onSnapshot(collection(db, "precos"), (snapshot) => {
        const vendorsMap = new Map<string, Vendor>();

        snapshot.forEach((docSnap) => {
          // O "as any" desativa a rigidez do TypeScript nessa linha para aceitar o Firebase
          const data = docSnap.data() as any; 
          const vendorName = data.tipoLocal === 'Ambulante' ? `🚶 Ambulante (${docSnap.id.substring(0,4)})` : (data.local || "Desconhecido");

          if (!vendorsMap.has(vendorName)) {
            vendorsMap.set(vendorName, {
              id: vendorName,
              name: vendorName,
              type: data.tipoLocal === 'Ambulante' ? 'street' : 'fixed',
              lat: data.lat || 0,
              lng: data.lng || 0,
              status: data.premium ? 'gold' : (data.status === 'aprovado' ? 'trusted' : data.status === 'abusivo' ? 'alert' : 'unverified'),
              rating: 5,
              votes: (data.votos_up || 0) + (data.votos_down || 0),
              prices: [],
              isPremium: data.premium || false
            });
          }

          if (!data.isLojistaPlace) {
            const vendor = vendorsMap.get(vendorName);
            if (vendor) {
              vendor.prices.push({
                id: docSnap.id,
                name: data.nome || 'Produto',
                value: data.preco || 0,
                unit: data.categoria || 'un',
                reportedBy: data.autor || 'Usuário',
                timestamp: data.data?.toMillis ? data.data.toMillis() : Date.now()
              });
            }
          }
        });

        set({ vendors: Array.from(vendorsMap.values()) });
      });

      // 2. Escutando Dúvidas do Turista
      onSnapshot(collection(db, "perguntas"), (snapshot) => {
         const queriesLoaded: PriceQuery[] = [];
         snapshot.forEach((docSnap) => {
           const data = docSnap.data() as any;
           if (data.status === "aberta") {
              queriesLoaded.push({
                id: docSnap.id,
                question: `Qual o preço de ${data.nomeItem}?`,
                lat: data.lat || 0,
                lng: data.lng || 0,
                askedAt: data.data?.toMillis ? data.data.toMillis() : Date.now(),
                status: 'open',
                answers: data.respostas || []
              });
           }
         });
         set({ queries: queriesLoaded });
      });
    } catch (error) {
      console.error("Erro ao conectar no Firebase:", error);
    }
  }
}));