import { MapPin, Loader } from 'lucide-react'
import { useState } from 'react'

export default function GeolocationButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGeolocation = () => {
    if (isLoading) return

    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador')
      return
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Disparar evento customizado com as coordenadas
        window.dispatchEvent(
          new CustomEvent('userGeolocation', {
            detail: { lat: latitude, lng: longitude },
          })
        )

        setIsLoading(false)
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        alert('Erro ao obter sua localização. Verifique as permissões do navegador.')
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    )
  }

  return (
    <button
      onClick={handleGeolocation}
      disabled={isLoading}
      className={`glass-card p-3 rounded-xl transition-all text-blue-400 hover:text-blue-300 shadow-lg ${
        isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-white/10'
      }`}
      title="Ir para minha localização"
    >
      {isLoading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <MapPin className="w-5 h-5" />
      )}
    </button>
  )
}
