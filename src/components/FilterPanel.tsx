"use client";

interface FilterPanelProps {
  probabilityFilter: number;
  onFilterChange: (value: number) => void;
}

export default function FilterPanel({ probabilityFilter, onFilterChange }: FilterPanelProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
        <span className="text-[#0B571A]">🔍</span>
        <span>Filters</span>
      </h3>
      
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
          className="w-full"
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
  );
}
