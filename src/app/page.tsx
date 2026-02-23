"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MiningGeoJSON, MiningDetection } from "@/types/geojson";
import FilterPanel from "@/components/FilterPanel";
import DetectionList from "@/components/DetectionList";
import StatsPanel from "@/components/StatsPanel";

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch from API route (falls back to static file if API unavailable)
    fetch("/api/detections")
      .then((res) => {
        if (!res.ok) {
          // Fallback to static file
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
      {/* Top Header Bar */}
      <header className="h-14 bg-black/90 backdrop-blur-md border-b border-[#0B571A]/30 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-4">
          {/* Left Sidebar Toggle */}
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="w-8 h-8 rounded-lg bg-black/60 border border-[#0B571A]/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#0B571A] transition-all"
          >
            {leftSidebarOpen ? "◀" : "▶"}
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B571A] flex items-center justify-center shadow-lg shadow-[#0B571A]/30">
              <span className="text-white text-lg">🛰️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0B571A]">GhanaMine Detect</h1>
            </div>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Type here to search..."
              className="w-full bg-black/80 border border-[#0B571A]/30 rounded-full px-5 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0B571A]"></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-black/60 rounded-lg border border-[#0B571A]/30">
            <span className="text-sm text-gray-400">🌍</span>
            <span className="text-sm text-gray-300">Tactical View</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0B571A] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#0B571A]/30">
            TM
          </div>
          <button className="w-8 h-8 rounded-lg bg-black/60 border border-[#0B571A]/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`${leftSidebarOpen ? 'w-72' : 'w-0'} bg-black/80 backdrop-blur-md border-r border-[#0B571A]/30 flex flex-col overflow-hidden transition-all duration-300`}>
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${leftSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            {/* Display Controls */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[#0B571A]">📡</span>
                  <span className="font-semibold text-white">Display Controls</span>
                </div>
                <span className="text-gray-500">▼</span>
              </div>

              {/* Detection Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#0B571A]">🎯</span>
                  <span className="text-gray-300 text-sm">Detections</span>
                </div>
                <button
                  onClick={() => setShowPoints(!showPoints)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    showPoints
                      ? "bg-[#0B571A] text-white shadow-lg shadow-[#0B571A]/30"
                      : "bg-gray-700/50 text-gray-400"
                  }`}
                >
                  {showPoints ? "On" : "Off"}
                </button>
              </div>
            </div>

            {/* Filters */}
            <FilterPanel 
              probabilityFilter={probabilityFilter} 
              onFilterChange={setProbabilityFilter} 
            />

            {/* Stats Cards */}
            <StatsPanel data={data} probabilityFilter={probabilityFilter} />

            {/* Detection List */}
            <DetectionList 
              data={data} 
              probabilityFilter={probabilityFilter} 
              onSelectDetection={setSelectedDetection}
              selectedDetection={selectedDetection}
            />
          </div>

          {/* Bottom DateTime */}
          <div className="p-4 border-t border-[#0B571A]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 px-3 py-2 bg-[#0B571A]/20 rounded-lg">
                <span className="text-[#0B571A]">📅</span>
                <span className="text-sm text-white">
                  {currentTime.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>🕐</span>
                <span className="text-sm font-mono">
                  {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          {/* Radar Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Compass Lines */}
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#0B571A]/30 via-transparent to-[#0B571A]/30"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-[#0B571A]/30 via-transparent to-[#0B571A]/30"></div>
            
            {/* Radar Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#0B571A]/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#0B571A]/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#0B571A]/10"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#0B571A]/50 text-xs">360°</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#0B571A]/50 text-xs">180°</div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#0B571A]/50 text-xs">270°</div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[#0B571A]/50 text-xs">90°</div>
          </div>

          {/* Map */}
          <Map 
            data={data} 
            onSelectDetection={setSelectedDetection} 
            selectedDetection={selectedDetection} 
            probabilityFilter={probabilityFilter} 
            showPoints={showPoints} 
          />

          {/* Selected Detection Info - Moved from right sidebar */}
          {selectedDetection && (
            <div className="absolute top-6 right-6 z-20">
              <div className="glass-card p-4 w-64">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <span className="text-[#0B571A]">📍</span>
                  <span>Selected Detection</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-[#0B571A] font-bold">
                      {(selectedDetection.properties.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Latitude</span>
                    <span className="text-cyan-400 font-mono text-xs">
                      {selectedDetection.properties.lat.toFixed(5)}°
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Longitude</span>
                    <span className="text-cyan-400 font-mono text-xs">
                      {selectedDetection.properties.lon.toFixed(5)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
