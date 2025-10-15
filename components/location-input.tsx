"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import { getGeocodingProvider } from "@/lib/geocoding/geocoding-factory"
import type { GeocodingResult } from "@/lib/geocoding/geocoding-provider"

interface LocationInputProps {
  value: string
  onChange: (address: string, location?: GeocodingResult) => void
  placeholder?: string
}

export function LocationInput({ value, onChange, placeholder }: LocationInputProps) {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Debounce geocoding
    const timer = setTimeout(() => {
      if (value.length > 3) {
        handleGeocode()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const handleGeocode = async () => {
    setIsGeocoding(true)
    try {
      const provider = getGeocodingProvider()
      const result = await provider.geocode(value)

      // Store the geocoded location
      onChange(value, result)
    } catch (error) {
      console.error("[v0] Geocoding error:", error)
    } finally {
      setIsGeocoding(false)
    }
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter location..."}
        className="pl-9 pr-9"
      />
      {isGeocoding && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  )
}
