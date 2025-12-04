"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { brisbaneSuburbsGeoJSON } from "@/lib/brisbaneSuburbs";

interface MapProperty {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  price?: number;
  status?: string;
  image?: string;
}

interface MapContainerProps {
  properties?: MapProperty[];
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: string;
  onPropertyClick?: (property: MapProperty) => void;
}

export default function MapContainer({
  properties = [],
  initialCenter = [-74.006, 40.7128], // Default: New York City
  initialZoom = 10,
  height = "600px",
  onPropertyClick,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Initialize map
  useEffect(() => {
    if (!mapboxToken) {
      setError("Mapbox access token not configured");
      return;
    }

    if (map.current) return; // Prevent re-initialization

    mapboxgl.accessToken = mapboxToken;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: initialCenter,
        zoom: initialZoom,
        pitch: 45,
        bearing: 0,
      });

      map.current.on("load", () => {
        // Add suburb GeoJSON source
        map.current!.addSource("suburbs", {
          type: "geojson",
          data: brisbaneSuburbsGeoJSON as any,
        });

        // Add suburb fill layer (polygons)
        map.current!.addLayer({
          id: "suburb-fill",
          type: "fill",
          source: "suburbs",
          paint: {
            "fill-color": [
              "case",
              ["has", "avgPrice"],
              [
                "case",
                [">=", ["get", "avgPrice"], 1200000],
                "#1D7874",
                [">=", ["get", "avgPrice"], 1000000],
                "#2B9E8F",
                [">=", ["get", "avgPrice"], 850000],
                "#4DAEA5",
                [">=", ["get", "avgPrice"], 700000],
                "#7FBDB5",
                "#B8D6D0",
              ],
              "#7FBDB5",
            ],
            "fill-opacity": 0.3,
          },
        });

        // Add suburb border layer
        map.current!.addLayer({
          id: "suburb-border",
          type: "line",
          source: "suburbs",
          paint: {
            "line-color": "#1D7874",
            "line-width": 2,
            "line-opacity": 0.8,
          },
        });

        // Add suburb labels
        map.current!.addLayer({
          id: "suburb-label",
          type: "symbol",
          source: "suburbs",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0],
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#1D7874",
            "text-halo-color": "#fff",
            "text-halo-width": 1.5,
          },
        });

        // Hover effect - change cursor
        map.current!.on("mousemove", "suburb-fill", () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });

        map.current!.on("mouseleave", "suburb-fill", () => {
          map.current!.getCanvas().style.cursor = "";
        });

        // Click to show suburb details popup
        map.current!.on("click", "suburb-fill", (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const props = feature.properties;

          // Get the center of the clicked feature
          const coordinates = e.lngLat;

          // Create popup content
          const popupHTML = `
            <div class="p-4 max-w-sm">
              <h3 class="font-bold text-lg text-gray-900 mb-3">${props?.name || "Unknown"}</h3>

              <div class="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div class="bg-gray-50 p-2 rounded">
                  <p class="text-gray-600 text-xs">Avg Price</p>
                  <p class="font-semibold text-gray-900">$${(props?.avgPrice / 1000).toFixed(0)}K</p>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <p class="text-gray-600 text-xs">Median Rent</p>
                  <p class="font-semibold text-gray-900">$${props?.medianRent}/wk</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div class="bg-gray-50 p-2 rounded">
                  <p class="text-gray-600 text-xs">Properties</p>
                  <p class="font-semibold text-gray-900">${props?.properties}</p>
                </div>
                <div class="bg-gray-50 p-2 rounded">
                  <p class="text-gray-600 text-xs">Growth Rate</p>
                  <p class="font-semibold text-[#1D7874]">${props?.growthRate}% p.a</p>
                </div>
              </div>

              <div class="mb-3 text-sm">
                <p class="text-gray-600 text-xs">Postcode</p>
                <p class="font-semibold text-gray-900">${props?.postcode}</p>
              </div>

              <div class="bg-blue-50 p-2 rounded mb-3 text-sm">
                <p class="text-gray-700">${props?.description || ""}</p>
              </div>

              <a href="#" class="inline-block bg-[#1D7874] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#071E22] transition-colors">
                View Properties
              </a>
            </div>
          `;

          new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            maxWidth: "400px",
          })
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map.current!);
        });

        setMapLoaded(true);
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "top-right"
      );
    }

    return () => {
      // Don't destroy map on unmount to preserve state
    };
  }, [mapboxToken, initialCenter, initialZoom]);

  // Add/update property markers
  useEffect(() => {
    if (!map.current || !mapLoaded || properties.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    properties.forEach((property) => {
      const el = document.createElement("div");
      el.className =
        "w-8 h-8 bg-gradient-to-br from-[#1D7874] to-[#071E22] rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform";
      el.title = property.address;

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current!);

      // Popup with property info
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-gray-800 mb-1">${property.address}</h3>
          ${property.price ? `<p class="text-sm text-gray-600 mb-1">$${property.price.toLocaleString()}</p>` : ""}
          ${property.status ? `<p class="text-xs font-medium text-[#1D7874]">${property.status}</p>` : ""}
          ${
            property.image
              ? `<img src="${property.image}" alt="${property.address}" class="mt-2 rounded w-full h-auto" />`
              : ""
          }
        </div>
      `);

      marker.setPopup(popup);

      // Click handler
      el.addEventListener("click", () => {
        popup.addTo(map.current!);
        onPropertyClick?.(property);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to all properties if more than one
    if (properties.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach((prop) => {
        bounds.extend([prop.longitude, prop.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [properties, mapLoaded, onPropertyClick]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        style={{ height }}
      >
        <div className="text-center">
          <p className="font-semibold text-yellow-800 mb-2">Map Configuration Error</p>
          <p className="text-sm text-yellow-700">{error}</p>
          <p className="text-xs text-yellow-600 mt-2">
            Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div
        ref={mapContainer}
        className="w-full"
        style={{ height, minHeight: "400px" }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin-slow mb-2">
              <div className="w-8 h-8 border-4 border-[#1D7874] border-t-transparent rounded-full" />
            </div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
