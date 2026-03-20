import { MapPin } from 'lucide-react'
import { useRef } from 'react'

export default function GeolocationButton() {
  const isLoadingRef = useRef(false)

  const handleGeolocation = () => {
    if (isLoadingRef.current) return

    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador')
      return
    }

    isLoadingRef.current = true

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Disparar evento customizado com as coordenadas
        window.dispatchEvent(
          new CustomEvent('userGeolocation', {
            detail: { lat: latitude, lng: longitude },
          })
        )

        isLoadingRef.current = false
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        isLoadingRef.current = false
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      }
    )
  }

  return (
    <button
      onClick={handleGeolocation}
      className="glass-card p-3 rounded-xl hover:bg-white/10 transition-colors text-blue-400 hover:text-blue-300 shadow-lg"
      title="Ir para minha localização"
    >
      <MapPin className="w-5 h-5" />
    </button>
  )
}
