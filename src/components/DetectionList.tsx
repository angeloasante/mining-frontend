"use client";

import { MiningGeoJSON, MiningDetection } from "@/types/geojson";

interface DetectionListProps {
  data: MiningGeoJSON | null;
  probabilityFilter: number;
  onSelectDetection: (detection: MiningDetection) => void;
  selectedDetection: MiningDetection | null;
}

export default function DetectionList({ 
  data, 
  probabilityFilter, 
  onSelectDetection,
  selectedDetection 
}: DetectionListProps) {
  if (!data) return null;

  const sorted = [...data.features]
    .filter(f => f.properties.probability >= probabilityFilter)
    .sort((a, b) => b.properties.probability - a.properties.probability);

  const getProbabilityStyle = (prob: number) => {
    if (prob >= 0.9) return "from-red-500 to-pink-500 text-white";
    if (prob >= 0.7) return "from-orange-500 to-amber-500 text-white";
    if (prob >= 0.5) return "from-yellow-500 to-orange-500 text-white";
    return "from-gray-500 to-gray-600 text-white";
  };

  const getGlowColor = (prob: number) => {
    if (prob >= 0.9) return "shadow-red-500/30";
    if (prob >= 0.7) return "shadow-orange-500/30";
    return "shadow-yellow-500/30";
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#0B571A]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#0B571A]">📋</span>
            <h3 className="text-sm font-semibold text-white">Detection List</h3>
          </div>
          <span className="text-xs text-gray-500">{sorted.length} shown</span>
        </div>
      </div>
      
      {/* List */}
      <div className="max-h-64 overflow-y-auto">
        {sorted.slice(0, 50).map((detection, idx) => {
          const isSelected = selectedDetection?.geometry.coordinates[0] === detection.geometry.coordinates[0] &&
                            selectedDetection?.geometry.coordinates[1] === detection.geometry.coordinates[1];
          
          return (
            <button
              key={idx}
              onClick={() => onSelectDetection(detection)}
              className={`w-full text-left p-3 border-b border-[#0B571A]/10 transition-all hover:bg-[#0B571A]/10 ${
                isSelected ? "bg-[#0B571A]/20 border-l-2 border-l-[#0B571A]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r shadow-lg ${getProbabilityStyle(detection.properties.probability)} ${getGlowColor(detection.properties.probability)}`}>
                    {(detection.properties.probability * 100).toFixed(0)}%
                  </span>
                  <div>
                    <span className="text-xs text-gray-300">Mining Site</span>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {detection.properties.lat.toFixed(4)}°, {detection.properties.lon.toFixed(4)}°
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-600">#{idx + 1}</span>
              </div>
            </button>
          );
        })}
        {sorted.length > 50 && (
          <div className="p-3 text-center text-xs text-gray-500 bg-black/30">
            Showing top 50 of {sorted.length}
          </div>
        )}
        {sorted.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <span className="text-2xl block mb-2">🔍</span>
            <span className="text-xs">No detections match filters</span>
          </div>
        )}
      </div>
    </div>
  );
}
