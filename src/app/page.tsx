"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MiningGeoJSON, MiningDetection } from "@/types/geojson";
import { MapPin, ChevronDown, ChevronUp, X } from "lucide-react";

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

// Format region name for display
function formatRegionName(region: string | undefined): string {
  if (!region) return "";
  // Convert "ghana_tarkwa" or "Tarkwa-Nsuaem" to readable "Tarkwa-Nsuaem, Ghana"
  const cleaned = region
    .replace(/^ghana_/i, "")
    .replace(/_/g, " ")
    .replace(/-/g, "-");
  // Capitalize each word
  return cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function Home() {
  const [data, setData] = useState<MiningGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [probabilityFilter, setProbabilityFilter] = useState(0.5);
  const [selectedDetection, setSelectedDetection] = useState<MiningDetection | null>(null);
  const [showPoints, setShowPoints] = useState(true);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [detectionPanelExpanded, setDetectionPanelExpanded] = useState(true);

  // Reverse geocode to get location name
  const fetchLocationName = useCallback(async (lat: number, lon: number) => {
    setLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
        { headers: { "User-Agent": "MineWatchAI/1.0" } }
      );
      const data = await response.json();
      if (data.address) {
        const { village, town, city, county, state, country } = data.address;
        const parts = [village || town || city, county || state, country].filter(Boolean);
        setLocationName(parts.slice(0, 2).join(", "));
      } else {
        setLocationName(null);
      }
    } catch {
      setLocationName(null);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  // Fetch location when detection is selected
  useEffect(() => {
    if (selectedDetection) {
      fetchLocationName(selectedDetection.properties.lat, selectedDetection.properties.lon);
    } else {
      setLocationName(null);
    }
  }, [selectedDetection, fetchLocationName]);

  useEffect(() => {
    // Fetch from tile server API (Railway) which pulls from GitHub
    const TILE_SERVER = process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'https://minningbackend-production.up.railway.app';
    
    fetch(`${TILE_SERVER}/api/detections`)
      .then((res) => {
        if (!res.ok) {
          // Fallback to local API route
          return fetch("/api/detections");
        }
        return res;
      })
      .then((res) => {
        if (!res.ok) {
          // Final fallback to static file
          return fetch("/ghana_tarkwa_mining_wgs84.geojson");
        }
        return res;
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
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
            <div className="absolute top-6 right-6 z-20">
              <div className="glass-card p-4 w-72">
                {/* Header with collapse/close buttons */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <MapPin size={16} className="text-[#0B571A]" />
                    <span>Selected Detection</span>
                  </h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setDetectionPanelExpanded(!detectionPanelExpanded)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      {detectionPanelExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>
                    <button
                      onClick={() => setSelectedDetection(null)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Collapsible content */}
                {detectionPanelExpanded && (
                  <>
                    {/* Location Name */}
                    <div className="mb-3 pb-3 border-b border-white/10">
                  {loadingLocation ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full border border-[#0B571A]/50 border-t-[#0B571A] animate-spin"></div>
                      <span className="text-xs text-gray-400">Finding location...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-white font-medium text-base">
                        {locationName || formatRegionName(selectedDetection.properties.region) || "Unknown Location"}
                      </p>
                      {selectedDetection.properties.region && locationName && (
                        <p className="text-xs text-gray-400 mt-1">
                          Region: {formatRegionName(selectedDetection.properties.region)}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className={`font-bold ${
                      selectedDetection.properties.probability >= 0.9 
                        ? "text-red-400" 
                        : selectedDetection.properties.probability >= 0.7 
                          ? "text-orange-400" 
                          : "text-[#0B571A]"
                    }`}>
                      {(selectedDetection.properties.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Coordinates</span>
                    <span className="text-cyan-400 font-mono text-xs">
                      {selectedDetection.properties.lat.toFixed(5)}°, {selectedDetection.properties.lon.toFixed(5)}°
                    </span>
                  </div>
                  {selectedDetection.properties.detected_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Detected</span>
                      <span className="text-gray-300 text-xs">
                        {new Date(selectedDetection.properties.detected_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${selectedDetection.properties.lat},${selectedDetection.properties.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  >
                    🗺️ Google Maps
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${selectedDetection.properties.lat.toFixed(6)}, ${selectedDetection.properties.lon.toFixed(6)}`
                      );
                    }}
                    className="flex-1 text-center text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-2 px-3 rounded-lg transition-colors"
                  >
                    📋 Copy Coords
                  </button>
                </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
