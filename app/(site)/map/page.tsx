"use client";

import { Navigation } from "@/components/Navigation";
import MapContainer from "@/components/MapContainer";
import { useState } from "react";

interface Property {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  price?: number;
  status?: string;
}

export default function MapPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sample properties for demo - Brisbane, Australia
  const sampleProperties: Property[] = [
    {
      id: "1",
      latitude: -27.4698,
      longitude: 153.0251,
      address: "123 South Bank, Brisbane, QLD",
      price: 850000,
      status: "For Sale",
    },
    {
      id: "2",
      latitude: -27.4829,
      longitude: 153.037,
      address: "456 Fortitude Valley, Brisbane, QLD",
      price: 1250000,
      status: "For Sale",
    },
    {
      id: "3",
      latitude: -27.4674,
      longitude: 153.0289,
      address: "789 City Centre, Brisbane, QLD",
      price: 1750000,
      status: "Sold",
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Navigation - Floating above map */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Navigation />
      </div>

      {/* Full Screen Map */}
      <main className="absolute inset-0 w-full h-full">
        <MapContainer
          properties={sampleProperties}
          initialCenter={[153.0289, -27.4698]}
          initialZoom={13}
          height="100%"
          onPropertyClick={setSelectedProperty}
        />

        {/* Selected Property Card - Floating at bottom right */}
        {selectedProperty && (
          <div className="absolute bottom-6 right-6 z-10 max-w-sm">
            <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 flex-1">
                  {selectedProperty.address}
                </h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="ml-2 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-bold text-[#1D7874]">
                    ${selectedProperty.price?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedProperty.status}
                  </p>
                </div>
              </div>

              <button className="mt-4 w-full bg-[#1D7874] hover:bg-[#071E22] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
