import { MapPin, Loader } from 'lucide-react'
import { useState } from 'react'

export default function GeolocationButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGeolocation = () => {
    if (isLoading) return

    // Usar o controle de geolocalização do Mapbox
    const geolocateControl = (window as any).geolocateControl
    if (!geolocateControl) {
      console.error('GeolocateControl não encontrado')
      return
    }

    setIsLoading(true)
    
    console.log('Acionando geolocalização...')
    // Acionar o controle de geolocalização
    geolocateControl.trigger()

    // Simular fim do loading após 2 segundos
    setTimeout(() => setIsLoading(false), 2000)
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
