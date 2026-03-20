import { ArrowLeft, Store, Crown, Shield, Check, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import type { Vendor } from '../types'

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { addVendor } = useAppStore()
  const [name, setName] = useState('')
  const [type, setType] = useState('Restaurante')
  const [cnpj, setCnpj] = useState('')
  const [isPremium, setIsPremium] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !cnpj.trim()) return
    const vendor: Vendor = {
      id: `v_${Date.now()}`,
      name: name.trim(),
      type,
      lat: -7.115 + (Math.random() - 0.5) * 0.015,
      lng: -34.865 + (Math.random() - 0.5) * 0.015,
      status: isPremium ? 'gold' : 'trusted',
      rating: 5.0,
      votes: 0,
      prices: [],
      cnpj: cnpj.trim(),
      isPremium,
    }
    addVendor(vendor)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4 overflow-y-auto">
      <div className="glass-card w-full max-w-md p-6 my-4">
        <h3 className="font-bold text-lg mb-4">Cadastrar Estabelecimento</h3>
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nome do negócio</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Restaurante Beira Mar"
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500"
            >
              {['Restaurante', 'Quiosque', 'Barraca de Praia', 'Ambulante', 'Loja', 'Pousada'].map((t) => (
                <option key={t} value={t} style={{ background: '#161B22' }}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">CNPJ ou CPF (para verificação)</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 placeholder:text-gray-600"
            />
          </div>
        </div>

        <div
          onClick={() => setIsPremium(!isPremium)}
          className={`rounded-2xl border-2 p-4 cursor-pointer transition-all mb-4 ${isPremium ? 'border-yellow-500 bg-yellow-500/10' : 'border-brand-border bg-white/5 hover:border-yellow-500/50'}`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPremium ? 'bg-yellow-500' : 'bg-white/10'}`}>
              <Crown className={`w-5 h-5 ${isPremium ? 'text-black' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-sm ${isPremium ? 'text-yellow-400' : 'text-white'}`}>Plano Ouro</span>
                <span className={`text-xs font-bold ${isPremium ? 'text-yellow-400' : 'text-gray-500'}`}>R$49/mês</span>
              </div>
              <ul className="space-y-1">
                {[
                  'Pino Dourado gigante no mapa',
                  'Prioridade máxima nas buscas',
                  'Selo verificado blindado',
                  'Destaque 24h por dia',
                ].map((item) => (
                  <li key={item} className={`flex items-center gap-1.5 text-xs ${isPremium ? 'text-yellow-200' : 'text-gray-500'}`}>
                    <Check className="w-3 h-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-brand-border text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
              isPremium
                ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                : 'bg-white/10 hover:bg-white/20 text-white border border-brand-border'
            }`}
          >
            {isPremium ? 'Assinar Plano Ouro' : 'Cadastrar Grátis'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MerchantPanel() {
  const { setRole, vendors, setSelectedVendor } = useAppStore()
  const [showRegister, setShowRegister] = useState(false)
  const [showMyBusiness, setShowMyBusiness] = useState(false)

  const premiumVendors = vendors.filter((v) => v.isPremium)
  const verifiedVendors = vendors.filter((v) => v.cnpj && !v.isPremium)

  return (
    <>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => setRole(null)}
          className="glass-card px-3 py-2 flex items-center gap-2 text-sm text-gray-300 hover:text-white pointer-events-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair
        </button>
        <div className="glass-card px-3 py-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Lojista</span>
          </div>
        </div>
      </div>

      {showMyBusiness && (
        <div className="absolute bottom-[88px] left-0 right-0 z-10 px-4 pointer-events-none">
          <div className="glass-card p-5 max-w-md mx-auto pointer-events-auto">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400" /> Estabelecimentos Premium
            </h3>
            {premiumVendors.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">Nenhum negócio premium cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {premiumVendors.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVendor(v); setShowMyBusiness(false) }}
                    className="w-full text-left bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2.5 hover:bg-yellow-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white font-medium">{v.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">{v.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {verifiedVendors.length > 0 && (
              <>
                <h3 className="font-semibold text-sm mt-4 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" /> Verificados (Plano Gratuito)
                </h3>
                <div className="space-y-2">
                  {verifiedVendors.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVendor(v); setShowMyBusiness(false) }}
                      className="w-full text-left bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5 hover:bg-green-500/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white font-medium">{v.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{v.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pointer-events-none">
        <div className="flex gap-3 max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => { setShowMyBusiness(!showMyBusiness) }}
            className={`glass-card border border-brand-border px-4 py-4 rounded-2xl transition-colors ${showMyBusiness ? 'border-yellow-500/50 text-yellow-400' : 'text-gray-300 hover:text-white'}`}
          >
            <Store className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowRegister(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-bold text-sm shadow-lg shadow-yellow-500/30 transition-all duration-200 active:scale-95"
          >
            <Crown className="w-5 h-5" />
            Cadastrar Negócio
          </button>
        </div>
      </div>
    </>
  )
}
