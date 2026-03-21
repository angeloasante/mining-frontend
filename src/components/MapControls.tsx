"use client";

import { MiningGeoJSON } from "@/types/geojson";
import { Crosshair } from "lucide-react";

// Stats Button Props
interface StatsButtonProps {
  data: MiningGeoJSON | null;
  probabilityFilter: number;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
}

// Display Control Button Props
interface DisplayControlButtonProps {
  showPoints: boolean;
  onToggleShowPoints: () => void;
  showDisplay: boolean;
  setShowDisplay: (show: boolean) => void;
}

// Circular Stats Button Component
export function StatsButton({ data, probabilityFilter, showStats, setShowStats }: StatsButtonProps) {
  const filtered = data?.features.filter(f => f.properties.probability >= probabilityFilter) || [];
  const total = filtered.length;
  const highConf = filtered.filter(f => f.properties.probability >= 0.9).length;
  const medConf = filtered.filter(f => f.properties.probability >= 0.7 && f.properties.probability < 0.9).length;
  const lowConf = filtered.filter(f => f.properties.probability >= 0.5 && f.properties.probability < 0.7).length;

  return (
    <div
      style={{
        position: "absolute",
        top: "80px",
        left: "12px",
        zIndex: 20,
      }}
      onMouseEnter={() => setShowStats(true)}
      onMouseLeave={() => setShowStats(false)}
    >
      {/* Circular Button */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: showStats ? "rgba(11, 87, 26, 0.9)" : "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(11, 87, 26, 0.5)",
          boxShadow: showStats ? "0 0 25px rgba(11, 87, 26, 0.6)" : "0 0 15px rgba(11, 87, 26, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {/* Chart Icon SVG */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={showStats ? "white" : "#0B571A"}
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transition: "stroke 0.2s" }}
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </div>

      {/* Expanded Stats Panel */}
      {showStats && data && (
        <div style={{ 
          position: "absolute",
          top: "0",
          left: "54px",
          background: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          padding: "12px",
          border: "1px solid rgba(11, 87, 26, 0.4)",
          boxShadow: "0 0 30px rgba(11, 87, 26, 0.3)",
          minWidth: "180px",
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{ fontSize: "10px", color: "#0B571A", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Detection Stats
          </div>
          
          {/* Stats List - Clean monochrome design */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>Total Sites</span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{total}</span>
            </div>
            <div style={{ height: "1px", background: "rgba(11, 87, 26, 0.2)" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>Critical (&gt;90%)</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0B571A" }}>{highConf}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>High (70-90%)</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0B571A" }}>{medConf}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>Medium (50-70%)</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0B571A" }}>{lowConf}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Circular Display Control Button Component
export function DisplayControlButton({ showPoints, onToggleShowPoints, showDisplay, setShowDisplay }: DisplayControlButtonProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "134px",
        left: "12px",
        zIndex: 20,
      }}
      onMouseEnter={() => setShowDisplay(true)}
      onMouseLeave={() => setShowDisplay(false)}
    >
      {/* Circular Button */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: showDisplay ? "rgba(11, 87, 26, 0.9)" : "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(11, 87, 26, 0.5)",
          boxShadow: showDisplay ? "0 0 25px rgba(11, 87, 26, 0.6)" : "0 0 15px rgba(11, 87, 26, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {/* Radar/Display Icon SVG */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={showDisplay ? "white" : "#0B571A"}
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ transition: "stroke 0.2s" }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
          <line x1="12" y1="2" x2="12" y2="6"></line>
        </svg>
      </div>

      {/* Expanded Display Panel */}
      {showDisplay && (
        <div style={{ 
          position: "absolute",
          top: "0",
          left: "54px",
          background: "rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          padding: "12px",
          border: "1px solid rgba(11, 87, 26, 0.4)",
          boxShadow: "0 0 30px rgba(11, 87, 26, 0.3)",
          minWidth: "160px",
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{ fontSize: "10px", color: "#0B571A", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Display Controls
          </div>
          
          {/* Detections Toggle */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "8px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Crosshair size={14} color="#0B571A" />
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>Detections</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleShowPoints();
              }}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "none",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                background: showPoints ? "#0B571A" : "rgba(55, 65, 81, 0.5)",
                color: showPoints ? "white" : "#9ca3af",
                boxShadow: showPoints ? "0 0 10px rgba(11, 87, 26, 0.4)" : "none",
              }}
            >
              {showPoints ? "On" : "Off"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
