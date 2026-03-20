import { useAppStore } from './store/appStore'
import Landing from './pages/Landing'
import MapView from './pages/MapView'

export default function App() {
  const role = useAppStore((s) => s.role)
  return role === null ? <Landing /> : <MapView />
}
