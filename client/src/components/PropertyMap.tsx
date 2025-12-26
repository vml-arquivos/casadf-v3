import { MapView } from "@/components/Map";
import { useEffect, useRef, useState } from "react";

interface PropertyMapProps {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default function PropertyMap({ address, neighborhood, city, state }: PropertyMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const fullAddress = `${address || neighborhood}, ${city}, ${state}, Brasil`;

  const handleMapReady = (map: google.maps.Map) => {
    setMapReady(true);

    // Geocodificar o endereço
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const position = results[0].geometry.location;
        const latLng = { lat: position.lat(), lng: position.lng() };
        
        setLocation(latLng);
        map.setCenter(position);
        map.setZoom(15);

        // Criar marcador
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new google.maps.Marker({
          position: position,
          map: map,
          title: fullAddress,
          animation: google.maps.Animation.DROP,
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="padding: 8px;">
            <strong>${neighborhood}</strong><br/>
            ${city}, ${state}
          </div>`,
        });

        markerRef.current.addListener("click", () => {
          infoWindow.open(map, markerRef.current);
        });
      } else {
        console.error("Geocode falhou:", status);
        // Fallback para Brasília
        const brasilia = { lat: -15.7801, lng: -47.9292 };
        map.setCenter(brasilia);
        map.setZoom(11);
      }
    });
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapView onMapReady={handleMapReady} />
    </div>
  );
}
