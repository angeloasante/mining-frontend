"use client";

import { useEffect, useRef, useState } from "react";
import { MiningGeoJSON, MiningDetection } from "@/types/geojson";

interface MapProps {
  data: MiningGeoJSON | null;
  onSelectDetection: (detection: MiningDetection | null) => void;
  selectedDetection: MiningDetection | null;
  probabilityFilter: number;
  showPoints: boolean;
}

const BASEMAPS = {
  esri: {
    name: "ESRI Satellite",
    tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
    attribution: "© Esri, Maxar, Earthstar Geographics",
  },
  google: {
    name: "Google Satellite",
    tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
    attribution: "© Google",
  },
};

type BasemapKey = keyof typeof BASEMAPS;

const GEE_API = "http://localhost:5001";

export default function Map({ data, onSelectDetection, selectedDetection, probabilityFilter, showPoints }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const compareMapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const compareMapRef = useRef<any>(null);
  const [status, setStatus] = useState<string>("Loading MapLibre...");
  const [basemap, setBasemap] = useState<BasemapKey>("google");
  const [compareMode, setCompareMode] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [compareYear, setCompareYear] = useState<string | null>(null);
  const [compareTileUrl, setCompareTileUrl] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingTiles, setLoadingTiles] = useState(false);

  // Initialize main map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    import("maplibre-gl").then((maplibregl) => {
      setStatus("Initializing map...");
      
      const selectedBasemap = BASEMAPS[basemap];
      
      const map = new maplibregl.default.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          projection: { type: "globe" },
          sky: {
            "sky-color": "#000000",
            "sky-horizon-blend": 1,
            "horizon-color": "#000000",
            "horizon-fog-blend": 1,
            "fog-color": "#000000",
            "fog-ground-blend": 1,
            "atmosphere-blend": 1
          },
          sources: {
            satellite: {
              type: "raster",
              tiles: selectedBasemap.tiles,
              tileSize: 256,
              maxzoom: 19,
              attribution: selectedBasemap.attribution,
            },
            // CartoDB dark labels overlay (free, no API key required)
            labels: {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
                "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
                "https://c.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png"
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: "© OpenStreetMap contributors © CARTO",
            }
          },
          layers: [
            // Black background layer to hide any flat map rendering behind globe
            {
              id: "background",
              type: "background",
              paint: {
                "background-color": "#000000",
              },
            },
            {
              id: "satellite",
              type: "raster",
              source: "satellite",
            },
            // Labels overlay from CartoDB
            {
              id: "labels",
              type: "raster",
              source: "labels",
            }
          ],
        },
        center: [0, 20],
        zoom: 2,
        maxZoom: 19,
        minZoom: 1.5,
        renderWorldCopies: false, // Disable flat world copies for cleaner globe view
      });

      mapRef.current = map;

      map.on("load", () => {
        setStatus("");
        map.addControl(new maplibregl.default.NavigationControl(), "top-right");
      });

      map.on("error", (e: any) => {
        console.error("Map error:", e);
      });
    }).catch((err) => {
      console.error("Failed to load maplibre:", err);
      setStatus(`Failed to load map library: ${err.message}`);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch GEE tile URL for compare year
  const fetchGEETileUrl = async (year: string) => {
    setLoadingTiles(true);
    try {
      const response = await fetch(`${GEE_API}/api/tile-url/${year}`);
      const data = await response.json();
      if (data.success) {
        setCompareTileUrl(data.tileUrl);
        setCompareYear(year);
        setShowYearPicker(false);
        setCompareMode(true);
      } else {
        alert(`Error loading ${year} imagery: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to fetch GEE tiles:", err);
      alert("Failed to connect to GEE tile server. Make sure tile_server.py is running.");
    } finally {
      setLoadingTiles(false);
    }
  };

  // Initialize compare map when tile URL is ready
  useEffect(() => {
    if (!compareMode || !compareTileUrl || compareMapRef.current) return;

    // Wait a tick for the conditional DOM element to mount and ref to attach
    const timer = setTimeout(() => {
      if (!compareMapContainer.current) return;

      import("maplibre-gl").then((maplibregl) => {
        const currentCenter = mapRef.current?.getCenter() || { lng: -1.95, lat: 5.28 };
        const currentZoom = mapRef.current?.getZoom() || 11;

        const compareMap = new maplibregl.default.Map({
          container: compareMapContainer.current!,
        style: {
          version: 8,
          projection: { type: "globe" },
          sky: {
            "sky-color": "#000000",
            "sky-horizon-blend": 1,
            "horizon-color": "#000000",
            "horizon-fog-blend": 1,
            "fog-color": "#000000",
            "fog-ground-blend": 1,
            "atmosphere-blend": 1
          },
          sources: {
            satellite: {
              type: "raster",
              tiles: [compareTileUrl],
              tileSize: 256,
              maxzoom: 18,
              attribution: `© Google Earth Engine - Sentinel-2 ${compareYear}`,
            },
            labels: {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
                "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
                "https://c.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png"
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: "© OpenStreetMap contributors © CARTO",
            }
          },
          layers: [
            // Black background layer to hide any flat map rendering behind globe
            {
              id: "background",
              type: "background",
              paint: {
                "background-color": "#000000",
              },
            },
            {
              id: "satellite",
              type: "raster",
              source: "satellite",
            },
            {
              id: "labels",
              type: "raster",
              source: "labels",
            }
          ],
        },
        center: [currentCenter.lng, currentCenter.lat],
        zoom: currentZoom,
        maxZoom: 18,
        minZoom: 1.5,
        renderWorldCopies: false,
      });

      compareMapRef.current = compareMap;

      // Sync maps
      compareMap.on("load", () => {
        if (!mapRef.current || !compareMapRef.current) return;

        let isSyncing = false;

        const syncMove = (sourceMap: any, targetMap: any) => {
          if (isSyncing || !sourceMap || !targetMap) return;
          isSyncing = true;
          try {
            targetMap.setCenter(sourceMap.getCenter());
            targetMap.setZoom(sourceMap.getZoom());
            targetMap.setBearing(sourceMap.getBearing());
            targetMap.setPitch(sourceMap.getPitch());
          } catch (e) {
            // Map may have been removed
          }
          isSyncing = false;
        };

        mapRef.current.on("move", () => {
          if (mapRef.current && compareMapRef.current) {
            syncMove(mapRef.current, compareMapRef.current);
          }
        });
        compareMapRef.current.on("move", () => {
          if (mapRef.current && compareMapRef.current) {
            syncMove(compareMapRef.current, mapRef.current);
          }
        });
      });
    });
    });

    return () => {
      clearTimeout(timer);
      if (compareMapRef.current) {
        compareMapRef.current.remove();
        compareMapRef.current = null;
      }
    };
  }, [compareMode, compareTileUrl, compareYear]);

  // Switch basemap
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource("satellite");
    if (source) {
      const selectedBasemap = BASEMAPS[basemap];
      source.setTiles(selectedBasemap.tiles);
    }
  }, [basemap]);

  // Add/update data layer
  useEffect(() => {
    if (!mapRef.current || !data) return;

    const map = mapRef.current;
    
    const addData = () => {
      const filteredFeatures = data.features.filter(
        (f) => f.properties.probability >= probabilityFilter
      );

      const filteredData = {
        type: "FeatureCollection" as const,
        features: filteredFeatures,
      };

      if (map.getLayer("mining-circles")) map.removeLayer("mining-circles");
      if (map.getLayer("mining-rings")) map.removeLayer("mining-rings");
      if (map.getSource("mining-data")) map.removeSource("mining-data");

      map.addSource("mining-data", {
        type: "geojson",
        data: filteredData,
      });

      map.addLayer({
        id: "mining-rings",
        type: "circle",
        source: "mining-data",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 12, 14, 30, 18, 90],
          "circle-color": "transparent",
          "circle-stroke-width": 2,
          "circle-stroke-color": [
            "interpolate",
            ["linear"],
            ["get", "probability"],
            0.5, "#22d3ee",
            0.7, "#f59e0b",
            0.85, "#0B571A",
            1.0, "#ef4444",
          ],
          "circle-stroke-opacity": 0.4,
        },
        layout: {
          visibility: showPoints ? "visible" : "none",
        },
      });

      map.addLayer({
        id: "mining-circles",
        type: "circle",
        source: "mining-data",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 6, 12, 10, 16, 14],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "probability"],
            0.5, "#22d3ee",
            0.7, "#f59e0b",
            0.85, "#0B571A",
            1.0, "#ef4444",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
          "circle-blur": 0.1,
        },
        layout: {
          visibility: showPoints ? "visible" : "none",
        },
      });

      map.on("click", "mining-circles", (e: any) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const feature = data.features.find(
            (f) => f.properties.lat === props.lat && f.properties.lon === props.lon
          );
          if (feature) onSelectDetection(feature);
        }
      });

      map.on("mouseenter", "mining-circles", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "mining-circles", () => {
        map.getCanvas().style.cursor = "";
      });
    };

    if (map.loaded()) {
      addData();
    } else {
      map.on("load", addData);
    }
  }, [data, probabilityFilter, onSelectDetection, showPoints]);

  // Toggle visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer("mining-circles")) {
      map.setLayoutProperty("mining-circles", "visibility", showPoints ? "visible" : "none");
    }
    if (map.getLayer("mining-rings")) {
      map.setLayoutProperty("mining-rings", "visibility", showPoints ? "visible" : "none");
    }
  }, [showPoints]);

  // Fly to selected
  useEffect(() => {
    if (!mapRef.current || !selectedDetection) return;
    mapRef.current.flyTo({
      center: selectedDetection.geometry.coordinates,
      zoom: 15,
    });
  }, [selectedDetection]);

  const exitCompareMode = () => {
    setCompareMode(false);
    setCompareYear(null);
    setCompareTileUrl(null);
    if (compareMapRef.current) {
      compareMapRef.current.remove();
      compareMapRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(5, Math.min(95, position)));
  };

  const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

  return (
    <div 
      style={{ width: "100%", height: "100%", position: "relative", minHeight: "500px" }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Main Map (Current/2026) - always full width */}
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000",
        }}
      />

      {/* Compare Map (Historical) - full width, clipped to left side of slider */}
      {compareMode && compareTileUrl && (
        <div
          ref={compareMapContainer}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Slider */}
      {compareMode && compareTileUrl && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: "4px",
            background: "#0B571A",
            cursor: "ew-resize",
            zIndex: 30,
            boxShadow: "0 0 20px rgba(11, 87, 26, 0.6)",
            transform: "translateX(-50%)",
          }}
          onMouseDown={() => setIsDragging(true)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#0B571A",
              padding: "12px 6px",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(11, 87, 26, 0.6)",
            }}
          >
            <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
              <path d="M5 8L1 14L5 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 8L15 14L11 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}

      {/* Year Labels */}
      {compareMode && compareYear && (
        <>
          <div style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "rgba(11, 87, 26, 0.9)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "14px",
            zIndex: 25,
            boxShadow: "0 0 20px rgba(11, 87, 26, 0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            🛰️ {compareYear} (Sentinel-2)
          </div>
          <div style={{
            position: "absolute",
            top: "16px",
            right: "70px",
            background: "rgba(11, 87, 26, 0.9)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "14px",
            zIndex: 25,
            boxShadow: "0 0 20px rgba(11, 87, 26, 0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            🛰️ 2026 (Current)
          </div>
        </>
      )}

      {/* Exit Compare Button */}
      {compareMode && (
        <button
          onClick={exitCompareMode}
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "10px 24px",
            borderRadius: "12px",
            border: "1px solid rgba(11, 87, 26, 0.4)",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            zIndex: 35,
            boxShadow: "0 0 20px rgba(11, 87, 26, 0.4)",
          }}
        >
          ✕ Exit Compare
        </button>
      )}

      {/* Year Picker Modal */}
      {showYearPicker && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowYearPicker(false)}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(16px)",
              borderRadius: "20px",
              padding: "28px",
              maxWidth: "440px",
              width: "90%",
              boxShadow: "0 0 40px rgba(11, 87, 26, 0.4)",
              border: "1px solid rgba(11, 87, 26, 0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "bold", color: "white" }}>
              🛰️ Compare Historical Imagery
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#9ca3af", fontSize: "14px" }}>
              Select a year to compare Sentinel-2 imagery from Google Earth Engine. 
              Drag the slider to reveal changes in mining activity.
            </p>
            
            {loadingTiles && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  border: "3px solid rgba(11, 87, 26, 0.3)",
                  borderTop: "3px solid #0B571A",
                  borderRadius: "50%",
                  margin: "0 auto 12px",
                  animation: "spin 1s linear infinite",
                }}></div>
                <p style={{ color: "#9ca3af" }}>Loading GEE imagery...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            
            {!loadingTiles && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => fetchGEETileUrl(year)}
                      style={{
                        padding: "18px 12px",
                        fontSize: "18px",
                        fontWeight: "600",
                        background: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(11, 87, 26, 0.3)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: "white",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#0B571A";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(11, 87, 26, 0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
                        e.currentTarget.style.borderColor = "rgba(11, 87, 26, 0.3)";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowYearPicker(false)}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    padding: "14px",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(11, 87, 26, 0.3)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "#9ca3af",
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Basemap Switcher */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "12px",
          zIndex: 20,
          display: "flex",
          gap: "6px",
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "8px",
          borderRadius: "14px",
          boxShadow: "0 0 30px rgba(11, 87, 26, 0.3)",
          border: "1px solid rgba(11, 87, 26, 0.4)",
        }}
      >
        {(Object.keys(BASEMAPS) as BasemapKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setBasemap(key)}
            style={{
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: basemap === key ? "600" : "400",
              background: basemap === key ? "#0B571A" : "transparent",
              color: basemap === key ? "white" : "#9ca3af",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: basemap === key ? "0 0 15px rgba(11, 87, 26, 0.5)" : "none",
            }}
          >
            {BASEMAPS[key].name}
          </button>
        ))}
        {!compareMode && (
          <button
            onClick={() => setShowYearPicker(true)}
            style={{
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: "600",
              background: "#0B571A",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 15px rgba(11, 87, 26, 0.4)",
            }}
          >
            🔄 Compare Years
          </button>
        )}
      </div>

      {status && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(12px)",
            padding: "20px 30px",
            borderRadius: "16px",
            boxShadow: "0 0 40px rgba(11, 87, 26, 0.4)",
            border: "1px solid rgba(11, 87, 26, 0.4)",
            zIndex: 10,
            color: "white",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
