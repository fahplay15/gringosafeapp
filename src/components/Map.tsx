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
  const size = vendor.isPremium ? 52 : 40
  const color = STATUS_COLORS[vendor.status]

  const el = document.createElement('div')
  el.style.position = 'relative'
  el.style.width = size + 'px'
  el.style.height = size + 'px'
  el.style.cursor = 'pointer'
  el.style.userSelect = 'none'
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'

  const pin = document.createElement('div')
  pin.style.cssText = `
    width: 100%;
    height: 100%;
    background: ${color};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid rgba(255,255,255,0.9);
    box-shadow: 0 4px 16px ${color}88;
    display: flex;
    align-items: center;
    justify-content: center;
  `
  
  if (vendor.isPremium) {
    const star = document.createElement('div')
    star.style.cssText = `transform:rotate(45deg);font-size:${size * 0.4}px;line-height:1;`
    star.textContent = '★'
    pin.appendChild(star)
  }

  el.appendChild(pin)

  if (vendor.status === 'alert') {
    const alert = document.createElement('div')
    alert.style.cssText = `
      position:absolute; top:0px; right:0px;
      width:16px; height:16px;
      background:#FF1744;
      border-radius:50%;
      border:2px solid #0D1117;
      display:flex;align-items:center;justify-content:center;
      font-size:10px; color:white; font-weight:bold;
      z-index:30;
    `
    alert.textContent = '!'
    el.appendChild(alert)
  }

  if (vendor.isPremium) {
    const pulse = document.createElement('div')
    pulse.style.cssText = `
      position:absolute; inset:-8px;
      border-radius:50%;
      border:2px solid ${color}66;
      animation: pulse-ring 2s ease-out infinite;
      z-index:1;
    `
    el.appendChild(pulse)
  }

  const label = document.createElement('div')
  label.style.cssText = `
    position:absolute; bottom:${-(size * 0.8)}px; left:50%; transform:translateX(-50%);
    background:rgba(13,17,23,0.95); color:white; font-size:11px;
    padding:4px 8px; border-radius:6px; white-space:nowrap;
    border:1px solid ${color}77;
    pointer-events:none;
    font-weight:500;
    z-index:20;
  `
  label.textContent = vendor.name
  el.appendChild(label)

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
      style: 'mapbox://styles/mapbox/light-v11',
      center: INITIAL_CENTER,
      zoom: 14.5,
      pitch: 30,
      bearing: -10,
    })

    mapRef.current = map

    // Adicionar botão de geolocalização do Mapbox (sem marcador visual)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: false,
      showUserHeading: false,
      fitBoundsOptions: {
        maxZoom: 16
      }
    })
    
    map.addControl(geolocateControl, 'top-right')

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
