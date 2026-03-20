import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { useAppStore } from '../store/appStore'
import { MAPBOX_TOKEN, INITIAL_CENTER } from '../data/mockData'
import type { Vendor } from '../types'

const STATUS_COLORS: Record<string, string> = {
  trusted: '#00C853',
  alert: '#FF1744',
  gold: '#FFD600',
  unverified: '#6B7280',
}


function createPinElement(vendor: Vendor): HTMLElement {
  const el = document.createElement('div')
  el.style.position = 'relative'
  el.style.cursor = 'pointer'

  const size = vendor.isPremium ? 52 : 40
  const color = STATUS_COLORS[vendor.status]

  el.innerHTML = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50% 50% 50% 4px;
      transform: rotate(-45deg);
      border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 4px 16px ${color}88;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      ${vendor.isPremium ? `<div style="transform:rotate(45deg);font-size:20px;">★</div>` : ''}
    </div>
    ${vendor.status === 'alert' ? `
      <div style="
        position:absolute; top:-4px; right:-4px;
        width:16px; height:16px;
        background:#FF1744;
        border-radius:50%;
        border:2px solid #0D1117;
        display:flex;align-items:center;justify-content:center;
        font-size:10px; color:white; font-weight:bold;
      ">!</div>` : ''}
  `

  if (vendor.isPremium) {
    const pulse = document.createElement('div')
    pulse.style.cssText = `
      position:absolute; inset:-8px;
      border-radius:50%;
      border:2px solid ${color}66;
      animation: pulse-ring 2s ease-out infinite;
    `
    el.appendChild(pulse)
  }

  return el
}

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const queryMarkersRef = useRef<mapboxgl.Marker[]>([])

  const { vendors, queries, radarActive, setSelectedVendor, setActiveQuery, role } = useAppStore()

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: INITIAL_CENTER,
      zoom: 14.5,
      pitch: 30,
      bearing: -10,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const onLoad = () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      vendors.forEach((vendor) => {
        const el = createPinElement(vendor)

        el.addEventListener('click', () => setSelectedVendor(vendor))

        const label = document.createElement('div')
        label.style.cssText = `
          position:absolute; bottom:-28px; left:50%; transform:translateX(-50%);
          background:rgba(13,17,23,0.9); color:white; font-size:11px;
          padding:2px 8px; border-radius:8px; white-space:nowrap;
          border:1px solid ${STATUS_COLORS[vendor.status]}55;
          pointer-events:none;
        `
        label.textContent = vendor.name
        el.appendChild(label)

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([vendor.lng, vendor.lat])
          .addTo(map)

        markersRef.current.push(marker)
      })
    }

    if (map.isStyleLoaded()) {
      onLoad()
    } else {
      map.on('load', onLoad)
    }

    return () => {
      map.off('load', onLoad)
    }
  }, [vendors, setSelectedVendor])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    queryMarkersRef.current.forEach((m) => m.remove())
    queryMarkersRef.current = []

    if (role !== 'local') return

    queries
      .filter((q) => q.status === 'open')
      .forEach((query) => {
        const el = document.createElement('div')
        el.style.cssText = `
          width:36px; height:36px; background:#2979FF;
          border-radius:50%; border:3px solid white;
          box-shadow:0 4px 12px #2979FF88;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer; font-size:18px;
        `
        el.innerHTML = '?'
        el.style.color = 'white'
        el.style.fontWeight = 'bold'

        el.addEventListener('click', () => setActiveQuery(query))

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([query.lng, query.lat])
          .addTo(map)

        queryMarkersRef.current.push(marker)
      })
  }, [queries, role, setActiveQuery])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const existingLayer = map.getLayer('radar-circle')
    if (existingLayer) {
      map.setPaintProperty('radar-circle', 'circle-opacity', radarActive ? 0.12 : 0)
      map.setPaintProperty('radar-circle-stroke', 'circle-opacity', radarActive ? 0.4 : 0)
    } else if (radarActive) {
      map.addSource('radar-source', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: INITIAL_CENTER }, properties: {} },
      })
      map.addLayer({
        id: 'radar-circle',
        type: 'circle',
        source: 'radar-source',
        paint: { 'circle-radius': 200, 'circle-color': '#00C853', 'circle-opacity': 0.12 },
      })
      map.addLayer({
        id: 'radar-circle-stroke',
        type: 'circle',
        source: 'radar-source',
        paint: { 'circle-radius': 200, 'circle-color': '#00C853', 'circle-opacity': 0, 'circle-stroke-width': 2, 'circle-stroke-color': '#00C853', 'circle-stroke-opacity': 0.4 },
      })
    }
  }, [radarActive])

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
}
