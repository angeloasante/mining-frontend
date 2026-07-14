"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MiningGeoJSON, MiningDetection } from "@/types/geojson";
import { SelectedDetectionPanel } from "@/components/SelectedDetectionPanel";

const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#0B571A]/30 border-t-[#0B571A] animate-spin mx-auto"></div>
        <p className="mt-4 text-[#0B571A]/70">Loading satellite view...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [data, setData] = useState<MiningGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [probabilityFilter, setProbabilityFilter] = useState(0.5);
  const [selectedDetection, setSelectedDetection] = useState<MiningDetection | null>(null);
  const [showPoints, setShowPoints] = useState(true);

  useEffect(() => {
    // Fetch detections, falling through on ANY failure (HTTP error or
    // network refusal) so one dead source never blanks the whole map:
    // Railway API -> local API route -> bundled static snapshot.
    const TILE_SERVER = process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'https://minningbackend-production.up.railway.app';
    const sources = [
      `${TILE_SERVER}/api/detections`,
      "/api/detections",
      "/ghana_tarkwa_mining_wgs84.geojson",
    ];

    (async () => {
      for (const url of sources) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          return (await res.json()) as MiningGeoJSON;
        } catch {
          continue;
        }
      }
      throw new Error("Failed to load data");
    })()
      .then((geojson: MiningGeoJSON) => {
        setData(geojson);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#0B571A]/30 border-t-[#0B571A] animate-spin mx-auto"></div>
          <p className="mt-6 text-[#0B571A]/70 text-lg">Initializing Mining Detection System...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-xl font-bold text-red-400">Error Loading Data</p>
          <p className="mt-2 text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const filteredData = data?.features.filter(f => f.properties.probability >= probabilityFilter) || [];

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area - Full Width */}
        <main className="flex-1 relative">
          {/* Map */}
          <Map 
            data={data} 
            onSelectDetection={setSelectedDetection} 
            selectedDetection={selectedDetection} 
            probabilityFilter={probabilityFilter} 
            onFilterChange={setProbabilityFilter}
            showPoints={showPoints}
            onToggleShowPoints={() => setShowPoints(!showPoints)}
            detectionCount={filteredData.length}
          />

          {/* Selected Detection Info */}
          {selectedDetection && (
            <SelectedDetectionPanel
              detection={selectedDetection}
              onClose={() => setSelectedDetection(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
