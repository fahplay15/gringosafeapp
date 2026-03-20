import { X, Star, ThumbsUp, ThumbsDown, Clock, Shield, Crown } from 'lucide-react'
import { useAppStore } from '../store/appStore'

const STATUS_CONFIG = {
  trusted: { label: 'Confiável', color: 'text-green-400', bg: 'bg-green-400/10 border-green-500/30', dot: 'bg-green-400' },
  alert: { label: 'Alerta de Golpe', color: 'text-red-400', bg: 'bg-red-400/10 border-red-500/30', dot: 'bg-red-400' },
  gold: { label: 'Premium Verificado', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/30', dot: 'bg-yellow-400' },
  unverified: { label: 'Não Verificado', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-500/30', dot: 'bg-gray-400' },
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}min atrás`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export default function VendorPanel() {
  const { selectedVendor, setSelectedVendor, voteVendor, role } = useAppStore()

  if (!selectedVendor) return null

  const cfg = STATUS_CONFIG[selectedVendor.status]

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pointer-events-none">
      <div className="glass-card p-5 pointer-events-auto max-w-md mx-auto shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {selectedVendor.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
              <h2 className="font-bold text-lg text-white">{selectedVendor.name}</h2>
            </div>
            <p className="text-gray-400 text-sm">{selectedVendor.type}</p>
          </div>
          <button
            onClick={() => setSelectedVendor(null)}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-4 ${cfg.bg} ${cfg.color}`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          {cfg.label}
          {selectedVendor.votes > 0 && (
            <span className="text-gray-400 font-normal">· {selectedVendor.votes} votos</span>
          )}
        </div>

        {selectedVendor.rating > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(selectedVendor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
              />
            ))}
            <span className="text-white font-semibold ml-1">{selectedVendor.rating}</span>
          </div>
        )}

        {selectedVendor.prices.length > 0 ? (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tabela de Preços</p>
            {selectedVendor.prices.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <div>
                  <span className="text-white text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{timeAgo(p.timestamp)} por {p.reportedBy}</span>
                  </div>
                </div>
                <span className="text-green-400 font-bold text-base">R${p.value}/{p.unit}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-gray-500 text-sm">Nenhum preço cadastrado ainda.</p>
          </div>
        )}

        {selectedVendor.cnpj && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span>CNPJ verificado: {selectedVendor.cnpj}</span>
          </div>
        )}

        {role !== 'merchant' && (
          <div className="flex gap-3 pt-3 border-t border-brand-border">
            <button
              onClick={() => voteVendor(selectedVendor.id, true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium"
            >
              <ThumbsUp className="w-4 h-4" />
              Preço Justo
            </button>
            <button
              onClick={() => voteVendor(selectedVendor.id, false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
            >
              <ThumbsDown className="w-4 h-4" />
              Preço Abusivo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
