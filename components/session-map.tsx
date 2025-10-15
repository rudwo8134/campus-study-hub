"use client"

import { useEffect, useRef, useState } from "react"
import type { SessionSearchResult } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface SessionMapProps {
  sessions: SessionSearchResult[]
  onSessionClick?: (sessionId: string) => void
}

export function SessionMap({ sessions, onSessionClick }: SessionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setMapError("Google Maps API key not configured")
      return
    }

    // Load Google Maps script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = initializeMap
    script.onerror = () => setMapError("Failed to load Google Maps")
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (window.google && mapRef.current) {
      updateMarkers()
    }
  }, [sessions])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 13,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    // Store map instance
    ;(mapRef.current as any).mapInstance = map
    updateMarkers()
  }

  const updateMarkers = () => {
    if (!mapRef.current || !window.google) return

    const map = (mapRef.current as any).mapInstance
    if (!map) return

    // Clear existing markers
    if ((mapRef.current as any).markers) {
      ;(mapRef.current as any).markers.forEach((marker: any) => marker.setMap(null))
    }

    // Add new markers
    const markers = sessions.map((session) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: session.location.latitude,
          lng: session.location.longitude,
        },
        map,
        title: session.subject,
      })

      marker.addListener("click", () => {
        onSessionClick?.(session.id)
      })

      return marker
    })
    ;(mapRef.current as any).markers = markers

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      sessions.forEach((session) => {
        bounds.extend({
          lat: session.location.latitude,
          lng: session.location.longitude,
        })
      })
      map.fitBounds(bounds)
    }
  }

  if (mapError) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">{mapError}</p>
          <p className="text-sm text-muted-foreground">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable map view</p>
        </div>
      </Card>
    )
  }

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg border" />
}
