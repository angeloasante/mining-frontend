"use client";

import { useState, useEffect, useCallback } from "react";
import { MiningDetection } from "@/types/geojson";
import { MapPin, ChevronDown, ChevronUp, X } from "lucide-react";

// Format region name for display: "ghana_tarkwa" -> "Tarkwa"
function formatRegionName(region: string | undefined): string {
  if (!region) return "";
  const cleaned = region.replace(/^ghana_/i, "").replace(/_/g, " ");
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface SelectedDetectionPanelProps {
  detection: MiningDetection;
  onClose: () => void;
}

// Info card for a selected detection: reverse-geocoded location, confidence,
// coordinates, Google Maps link and copy-coordinates. Shared between the main
// map page and custom report pages.
export function SelectedDetectionPanel({ detection, onClose }: SelectedDetectionPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLocationName = useCallback(async (lat: number, lon: number) => {
    setLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
        { headers: { "User-Agent": "EcoHealth/1.0" } }
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

  useEffect(() => {
    setCopied(false);
    fetchLocationName(detection.properties.lat, detection.properties.lon);
  }, [detection, fetchLocationName]);

  return (
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
              onClick={() => setExpanded(!expanded)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Collapsible content */}
        {expanded && (
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
                    {locationName || formatRegionName(detection.properties.region) || "Unknown Location"}
                  </p>
                  {detection.properties.region && locationName && (
                    <p className="text-xs text-gray-400 mt-1">
                      Region: {formatRegionName(detection.properties.region)}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Confidence</span>
                <span className={`font-bold ${
                  detection.properties.probability >= 0.9
                    ? "text-red-400"
                    : detection.properties.probability >= 0.7
                      ? "text-orange-400"
                      : "text-[#0B571A]"
                }`}>
                  {(detection.properties.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Coordinates</span>
                <span className="text-cyan-400 font-mono text-xs">
                  {detection.properties.lat.toFixed(5)}°, {detection.properties.lon.toFixed(5)}°
                </span>
              </div>
              {detection.properties.detected_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Detected</span>
                  <span className="text-gray-300 text-xs">
                    {new Date(detection.properties.detected_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
              <a
                href={`https://www.google.com/maps?q=${detection.properties.lat},${detection.properties.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-2 px-3 rounded-lg transition-colors"
              >
                🗺️ Google Maps
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${detection.properties.lat.toFixed(6)}, ${detection.properties.lon.toFixed(6)}`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 text-center text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-2 px-3 rounded-lg transition-colors"
              >
                {copied ? "✓ Copied" : "📋 Copy Coords"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
