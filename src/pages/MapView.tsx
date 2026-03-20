import MapComponent from '../components/Map'
import VendorPanel from '../components/VendorPanel'
import TouristPanel from '../components/TouristPanel'
import LocalPanel from '../components/LocalPanel'
import MerchantPanel from '../components/MerchantPanel'
import { useAppStore } from '../store/appStore'
import { Shield } from 'lucide-react'

const LEGEND = [
  { color: '#00C853', label: 'Confiável' },
  { color: '#FF1744', label: 'Alerta de Golpe' },
  { color: '#FFD600', label: 'Premium' },
  { color: '#6B7280', label: 'Não Verificado' },
]

export default function MapView() {
  const role = useAppStore((s) => s.role)

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 pb-20 sm:pb-0 overflow-hidden">
        <MapComponent />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-bold text-white">Gringo<span className="text-green-400">Safe</span></span>
        </div>
      </div>

      <div className="absolute bottom-24 right-4 z-10 glass-card p-2.5 space-y-1.5">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {role === 'tourist' && <TouristPanel />}
      {role === 'local' && <LocalPanel />}
      {role === 'merchant' && <MerchantPanel />}

      <VendorPanel />
    </div>
  )
}
