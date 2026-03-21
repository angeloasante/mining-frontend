"use client";

import { MiningGeoJSON, MiningDetection } from "@/types/geojson";

interface DetectionListPanelProps {
  data: MiningGeoJSON | null;
  probabilityFilter: number;
  selectedDetection: MiningDetection | null;
  onSelectDetection: (detection: MiningDetection | null) => void;
  detectionCount?: number;
  showDetectionList: boolean;
  setShowDetectionList: (show: boolean) => void;
  mapRef: React.MutableRefObject<any>;
}

export function DetectionListPanel({
  data,
  probabilityFilter,
  selectedDetection,
  onSelectDetection,
  detectionCount,
  showDetectionList,
  setShowDetectionList,
  mapRef,
}: DetectionListPanelProps) {
  const getProbColor = (prob: number) => {
    if (prob >= 0.9) return "#ef4444";
    if (prob >= 0.7) return "#f97316";
    return "#eab308";
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        right: "12px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(12px)",
        padding: "8px",
        borderRadius: "14px",
        boxShadow: "0 0 30px rgba(11, 87, 26, 0.3)",
        border: "1px solid rgba(11, 87, 26, 0.4)",
        transition: "all 0.3s ease",
        maxHeight: showDetectionList ? "400px" : "auto",
        width: showDetectionList ? "280px" : "auto",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setShowDetectionList(!showDetectionList)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: "#0B571A",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 0 15px rgba(11, 87, 26, 0.5)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* List Icon SVG */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>
            Detections
          </span>
          {detectionCount !== undefined && (
            <span 
              style={{ 
                background: "rgba(255,255,255,0.2)", 
                color: "white", 
                fontSize: "10px", 
                fontWeight: "700",
                padding: "2px 6px", 
                borderRadius: "8px",
                minWidth: "24px",
                textAlign: "center",
              }}
            >
              {detectionCount}
            </span>
          )}
        </div>
        <span style={{ 
          transform: showDetectionList ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          fontSize: "10px",
          color: "white",
        }}>
          ▼
        </span>
      </button>

      {/* Expanded Detection List */}
      {showDetectionList && data && (
        <div style={{ 
          marginTop: "8px", 
          maxHeight: "320px", 
          overflowY: "auto",
          borderRadius: "8px",
        }}>
          {(() => {
            const sorted = [...data.features]
              .filter(f => f.properties.probability >= probabilityFilter)
              .sort((a, b) => b.properties.probability - a.properties.probability)
              .slice(0, 50);

            return sorted.map((detection, idx) => {
              const isSelected = selectedDetection?.geometry.coordinates[0] === detection.geometry.coordinates[0] &&
                                selectedDetection?.geometry.coordinates[1] === detection.geometry.coordinates[1];
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectDetection(detection);
                    // Fly to detection on map
                    if (mapRef.current) {
                      mapRef.current.flyTo({
                        center: [detection.properties.lon, detection.properties.lat],
                        zoom: 15,
                        duration: 1500,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    background: isSelected ? "rgba(11, 87, 26, 0.3)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(11, 87, 26, 0.2)",
                    borderLeft: isSelected ? "2px solid #0B571A" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "rgba(11, 87, 26, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      background: getProbColor(detection.properties.probability),
                      color: "white",
                      minWidth: "36px",
                      textAlign: "center",
                    }}>
                      {(detection.properties.probability * 100).toFixed(0)}%
                    </span>
                    <div>
                      <div style={{ fontSize: "11px", color: "#d1d5db" }}>Mining Site</div>
                      <div style={{ fontSize: "10px", color: "#6b7280", fontFamily: "monospace" }}>
                        {detection.properties.lat.toFixed(4)}°, {detection.properties.lon.toFixed(4)}°
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", color: "#4b5563" }}>#{idx + 1}</span>
                </button>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
