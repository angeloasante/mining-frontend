"use client";

import { MiningGeoJSON } from "@/types/geojson";

interface EnvironmentPanelProps {
  data: MiningGeoJSON | null;
  probabilityFilter: number;
}

export default function EnvironmentPanel({ data, probabilityFilter }: EnvironmentPanelProps) {
  const filtered = data?.features.filter(f => f.properties.probability >= probabilityFilter) || [];
  
  // Calculate mock environmental impact metrics based on detections
  const impactScore = Math.min(100, Math.round(filtered.length * 0.54));
  const forestRisk = Math.min(100, Math.round(filtered.filter(f => f.properties.probability >= 0.7).length * 2.1));
  const waterRisk = Math.min(100, Math.round(filtered.filter(f => f.properties.probability >= 0.8).length * 3.2));

  return (
    <div className="space-y-4">
      {/* Air Quality Style Panel */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <span className="text-sm font-semibold text-white">Risk Assessment</span>
          </div>
          <button className="px-3 py-1 rounded text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white">
            On
          </button>
        </div>

        {/* Measurement Group Dropdown */}
        <div className="mb-4">
          <label className="text-[10px] text-gray-500 block mb-1">Measurement Group</label>
          <div className="flex items-center justify-between bg-black/60 rounded-lg px-3 py-2 border border-emerald-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
              <span className="text-sm text-gray-300">Impact Score</span>
            </div>
            <span className="text-gray-500">▼</span>
          </div>
        </div>

        {/* Influence Arcs Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-emerald-500/20">
          <span className="text-xs text-gray-400">Influence Arcs</span>
          <button className="px-3 py-1 rounded text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white">
            On
          </button>
        </div>
      </div>

      {/* Environmental Monitor */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
          <span className="text-green-400">🌿</span>
          <span>Environmental Monitor</span>
        </h3>

        {/* Impact Score */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">▽ Impact Score</span>
            <span className={`text-sm font-bold ${impactScore >= 70 ? 'text-red-400' : impactScore >= 40 ? 'text-orange-400' : 'text-green-400'}`}>
              {impactScore} pts
            </span>
          </div>
          {/* Mini Chart */}
          <div className="h-12 bg-black/40 rounded-lg overflow-hidden relative">
            <svg className="w-full h-full" viewBox="0 0 200 48">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 L20,35 L40,38 L60,30 L80,32 L100,25 L120,28 L140,20 L160,22 L180,15 L200,18 L200,48 L0,48 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,40 L20,35 L40,38 L60,30 L80,32 L100,25 L120,28 L140,20 L160,22 L180,15 L200,18"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
              />
              <circle cx="200" cy="18" r="3" fill="#22d3ee" className="animate-pulse" />
            </svg>
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] text-gray-600">
              <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span><span>A</span>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-3 pt-3 border-t border-emerald-500/20">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">▽ Forest Risk</span>
            <span className={`text-sm font-bold ${forestRisk >= 70 ? 'text-red-400' : forestRisk >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              {forestRisk}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">▽ Water Risk</span>
            <span className={`text-sm font-bold ${waterRisk >= 70 ? 'text-red-400' : waterRisk >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
              {waterRisk}%
            </span>
          </div>
        </div>
      </div>

      {/* On-site Monitoring Cards */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">On-site Monitoring</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/60 rounded-lg p-2 flex items-center space-x-2">
            <span className="text-lg">🌡️</span>
            <div>
              <div className="text-sm font-bold text-cyan-400">28.5°C</div>
              <div className="text-[9px] text-gray-500">Temperature</div>
            </div>
          </div>
          <div className="bg-black/60 rounded-lg p-2 flex items-center space-x-2">
            <span className="text-lg">💧</span>
            <div>
              <div className="text-sm font-bold text-blue-400">72%</div>
              <div className="text-[9px] text-gray-500">Humidity</div>
            </div>
          </div>
          <div className="bg-black/60 rounded-lg p-2 flex items-center space-x-2">
            <span className="text-lg">☁️</span>
            <div>
              <div className="text-sm font-bold text-gray-300">15%</div>
              <div className="text-[9px] text-gray-500">Cloud Cover</div>
            </div>
          </div>
          <div className="bg-black/60 rounded-lg p-2 flex items-center space-x-2">
            <span className="text-lg">☀️</span>
            <div>
              <div className="text-sm font-bold text-yellow-400">High</div>
              <div className="text-[9px] text-gray-500">Visibility</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
