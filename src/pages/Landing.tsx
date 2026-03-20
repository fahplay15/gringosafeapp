import { Shield, MapPin, Star, DollarSign } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import type { UserRole } from '../types'

const roles = [
  {
    id: 'tourist' as UserRole,
    icon: MapPin,
    label: 'Turista',
    subtitle: 'Economize e não seja enganado',
    description: 'Ative o Radar de Preços, consulte valores em tempo real e veja quais estabelecimentos são confiáveis.',
    color: 'from-blue-600 to-blue-400',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'local' as UserRole,
    icon: Star,
    label: 'Avaliador Local',
    subtitle: 'Fiscalize e ganhe dinheiro',
    description: 'Cadastre preços reais, responda dúvidas de turistas e saque seus ganhos via PIX.',
    color: 'from-green-600 to-emerald-400',
    border: 'border-green-500',
    glow: 'shadow-green-500/30',
    badge: 'bg-green-500/20 text-green-300',
  },
  {
    id: 'merchant' as UserRole,
    icon: DollarSign,
    label: 'Lojista',
    subtitle: 'Atraia clientes honestos',
    description: 'Cadastre seu negócio, obtenha o Selo de Confiança e apareça com o Pino Dourado no mapa.',
    color: 'from-yellow-500 to-amber-400',
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
]

export default function Landing() {
  const setRole = useAppStore((s) => s.setRole)

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-300 flex items-center justify-center mb-4 shadow-lg shadow-green-500/40">
          <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Gringo<span className="text-brand-green">Safe</span>
        </h1>
        <p className="text-gray-400 mt-2 text-center max-w-xs text-sm leading-relaxed">
          O escudo digital contra o "Preço para Gringo". Transparência onde você vai.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-6">
          Como você vai usar o app?
        </p>
        {roles.map(({ id, icon: Icon, label, subtitle, description, color, border, glow, badge }) => (
          <button
            key={id}
            onClick={() => setRole(id)}
            className={`w-full text-left glass-card border ${border} p-5 hover:shadow-xl ${glow} transition-all duration-200 active:scale-[0.98] group`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-lg">{label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{subtitle}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-10">
        Dados demonstrativos — Praia de Tambaú, João Pessoa/PB
      </p>
    </div>
  )
}
