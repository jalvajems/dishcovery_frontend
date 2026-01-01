import Map, { Marker } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  onSelect: (data: {
    lng: number;
    lat: number;
    placeName: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  }) => void;
}

export default function MapLocationPicker({ onSelect }: Props) {
  const mapRef = useRef<any>(null);
  const geocoderRef = useRef<HTMLDivElement>(null);

  const [marker, setMarker] = useState({
    lng: 77.5946,
    lat: 12.9716,
  });

  // Reverse Geocode helper
  const reverseGeocode = async (lng: number, lat: number) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const place = data.features[0];

    const context = place.context || [];

    const get = (type: string) =>
      context.find((c: any) => c.id.includes(type))?.text || "";

    onSelect({
      lng,
      lat,
      placeName: place.text,
      city: get("place"),
      state: get("region"),
      country: get("country"),
      fullAddress: place.place_name,
    });
  };

  // Init Geocoder
  useEffect(() => {
    if (!geocoderRef.current || !mapRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
    });

    geocoder.addTo(geocoderRef.current);

    geocoder.on("result", (e) => {
      const [lng, lat] = e.result.center;

      setMarker({ lng, lat });

      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 15,
      });

      reverseGeocode(lng, lat);
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div ref={geocoderRef} className="rounded-lg overflow-hidden" />

      {/* Map */}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: marker.lng,
          latitude: marker.lat,
          zoom: 13,
        }}
        style={{ width: "100%", height: 350 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          longitude={marker.lng}
          latitude={marker.lat}
          draggable
          onDragEnd={(e) => {
            const lng = e.lngLat.lng;
            const lat = e.lngLat.lat;
            setMarker({ lng, lat });
            reverseGeocode(lng, lat);
          }}
        />
      </Map>
    </div>
  );
}
