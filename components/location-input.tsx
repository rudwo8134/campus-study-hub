"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { getGeocodingProvider } from "@/lib/geocoding/geocoding-factory";
import type { GeocodingResult } from "@/lib/geocoding/geocoding-provider";

interface LocationInputProps {
  value: string;
  onChange: (address: string, location?: GeocodingResult) => void;
  placeholder?: string;
}

// Declare global to track if Google Maps is loaded
declare global {
  interface Window {
    googleMapsLoaded?: boolean;
    googleMapsCallbacks?: (() => void)[];
  }
}

export function LocationInput({
  value,
  onChange,
  placeholder,
}: LocationInputProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      return;
    }

    const onGoogleMapsLoaded = () => {
      setIsGoogleMapsLoaded(true);
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (window.googleMapsLoaded === undefined) {
      window.googleMapsLoaded = false;
      window.googleMapsCallbacks = [];

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.googleMapsLoaded = true;
        window.googleMapsCallbacks?.forEach((cb) => cb());
        window.googleMapsCallbacks = [];
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps");
      };

      document.head.appendChild(script);
    }

    // Register callback
    if (window.googleMapsCallbacks) {
      window.googleMapsCallbacks.push(onGoogleMapsLoaded);
    } else if (window.googleMapsLoaded) {
      onGoogleMapsLoaded();
    }
  }, []);

  // Initialize autocomplete once Google Maps is loaded
  useEffect(() => {
    if (!isGoogleMapsLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }

    try {
      // Create autocomplete instance
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["establishment", "geocode"],
          fields: ["formatted_address", "geometry", "name", "place_id"],
        }
      );

      autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          console.warn("No geometry found for place");
          return;
        }

        const result: GeocodingResult = {
          address: place.formatted_address || place.name || "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          placeId: place.place_id,
        };

        onChange(result.address, result);
      });

      autocompleteRef.current = autocomplete;
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isGoogleMapsLoaded, onChange]);

  // Fallback geocoding when Google Places is not available
  useEffect(() => {
    if (isGoogleMapsLoaded) return; // Skip if Google Maps autocomplete is available

    const timer = setTimeout(() => {
      if (value.length > 3) {
        handleFallbackGeocode();
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isGoogleMapsLoaded]);

  const handleFallbackGeocode = async () => {
    setIsGeocoding(true);
    try {
      const provider = getGeocodingProvider();
      const result = await provider.geocode(value);
      onChange(value, result);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter location..."}
        className="pl-9 pr-9"
        autoComplete="off"
      />
      {isGeocoding && (
        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
