"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FloatingFilterButtonProps {
  probabilityFilter: number;
  onFilterChange: (value: number) => void;
}

export function FloatingFilterButton({ probabilityFilter, onFilterChange }: FloatingFilterButtonProps) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="absolute top-6 left-3 z-30">
      {/* Filter Panel */}
      {showPanel && (
        <div className="absolute top-14 left-0 w-72 glass-card p-4 mt-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal size={16} className="text-[#0B571A]" />
              <span className="font-semibold text-white text-sm">Detection Filters</span>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Confidence Slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-gray-400">Minimum Confidence</label>
              <span className="text-sm font-bold text-[#0B571A]">
                {(probabilityFilter * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={probabilityFilter * 100}
              onChange={(e) => onFilterChange(Number(e.target.value) / 100)}
              className="w-full accent-[#0B571A]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="pt-3 border-t border-[#0B571A]/30">
            <label className="text-xs text-gray-400 mb-2 block">Quick Filters</label>
            <div className="flex gap-2">
              {[0.5, 0.7, 0.9].map((val) => (
                <button
                  key={val}
                  onClick={() => onFilterChange(val)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-all ${
                    probabilityFilter === val
                      ? "bg-[#0B571A] text-white border-transparent shadow-lg shadow-[#0B571A]/30"
                      : "bg-black/60 text-gray-400 border-[#0B571A]/30 hover:border-[#0B571A] hover:text-white"
                  }`}
                >
                  ≥{val * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          showPanel
            ? "bg-[#0B571A] text-white shadow-[#0B571A]/40"
            : "bg-black/80 backdrop-blur-md border border-[#0B571A]/40 text-[#0B571A] hover:border-[#0B571A] hover:bg-[#0B571A]/10"
        }`}
        title="Filter Detections"
      >
        <SlidersHorizontal size={20} />
      </button>
      
      {/* Filter indicator badge */}
      {probabilityFilter > 0.5 && !showPanel && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B571A] text-white text-[10px] font-bold flex items-center justify-center">
          {(probabilityFilter * 100).toFixed(0)}
        </div>
      )}
    </div>
  );
}
