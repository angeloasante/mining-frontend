"use client";

import { MiningGeoJSON } from "@/types/geojson";

interface StatsPanelProps {
  data: MiningGeoJSON | null;
  probabilityFilter: number;
}

export default function StatsPanel({ data, probabilityFilter }: StatsPanelProps) {
  if (!data) return null;

  const filtered = data.features.filter(f => f.properties.probability >= probabilityFilter);
  const total = filtered.length;
  
  const highConf = filtered.filter(f => f.properties.probability >= 0.9).length;
  const medConf = filtered.filter(f => f.properties.probability >= 0.7 && f.properties.probability < 0.9).length;
  const lowConf = filtered.filter(f => f.properties.probability >= 0.5 && f.properties.probability < 0.7).length;

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
        <span className="text-[#0B571A]">📊</span>
        <span>Detection Stats</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Total */}
        <div className="bg-black/60 rounded-xl p-3 border border-[#0B571A]/30">
          <div className="text-2xl font-bold text-white stat-value">{total}</div>
          <div className="text-[10px] text-gray-400 mt-1">Total Sites</div>
        </div>
        
        {/* High Confidence */}
        <div className="bg-black/60 rounded-xl p-3 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400 stat-value">{highConf}</div>
          <div className="text-[10px] text-gray-400 mt-1">Critical (&gt;90%)</div>
        </div>
        
        {/* Medium */}
        <div className="bg-black/60 rounded-xl p-3 border border-orange-500/20">
          <div className="text-2xl font-bold text-orange-400 stat-value">{medConf}</div>
          <div className="text-[10px] text-gray-400 mt-1">High (70-90%)</div>
        </div>
        
        {/* Low */}
        <div className="bg-black/60 rounded-xl p-3 border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400 stat-value">{lowConf}</div>
          <div className="text-[10px] text-gray-400 mt-1">Medium (50-70%)</div>
        </div>
      </div>
    </div>
  );
}
