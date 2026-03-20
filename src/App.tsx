import { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import Landing from './pages/Landing'
import MapView from './pages/MapView'

export default function App() {
  const role = useAppStore((s) => s.role)
  const initFirebaseListeners = useAppStore((s) => s.initFirebaseListeners)

  // 🚨 A Mágica: Liga o banco de dados assim que o App é aberto
  useEffect(() => {
    initFirebaseListeners()
  }, [initFirebaseListeners])

  // Como no appStore já forçamos a nascer como 'tourist', ele vai direto pro Mapa!
  return role === null ? <Landing /> : <MapView />
}