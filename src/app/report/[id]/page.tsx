"use client";

import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import { MiningGeoJSON, MiningDetection } from "@/types/geojson";
import { MapPin, Clock, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

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

const TILE_SERVER_URL =
  process.env.NEXT_PUBLIC_TILE_SERVER_URL ||
  "https://minningbackend-production.up.railway.app";

interface ReportMetadata {
  request_id: string;
  town: string;
  region: string;
  center: { lat: number; lon: number };
  generated_at: string;
  total_detections: number;
  threshold: number;
  model_version: string;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<MiningGeoJSON | null>(null);
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDetection, setSelectedDetection] = useState<MiningDetection | null>(null);
  const [probabilityFilter, setProbabilityFilter] = useState(0.5);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`${TILE_SERVER_URL}/api/reports/${id}`);

        if (res.status === 404) {
          setError("pending");
          return;
        }

        if (!res.ok) {
          setError("Failed to load report");
          return;
        }

        const geojson = await res.json();
        setMetadata(geojson.metadata || null);

        // Transform to MiningGeoJSON format
        const miningData: MiningGeoJSON = {
          type: "FeatureCollection",
          features: (geojson.features || []).map((f: Record<string, unknown>) => {
            const props = f.properties as Record<string, unknown>;
            const geom = f.geometry as { coordinates: number[] };
            return {
              type: "Feature",
              geometry: {
                type: "Point" as const,
                coordinates: geom.coordinates,
              },
              properties: {
                probability: (props.probability as number) || 0,
                lat: (props.lat as number) || geom.coordinates[1],
                lon: (props.lon as number) || geom.coordinates[0],
                region: (props.region as string) || "",
                detected_at: (props.detected_at as string) || "",
                model_version: (props.model_version as string) || "",
              },
            };
          }),
          metadata: geojson.metadata
            ? {
                generated_at: geojson.metadata.generated_at,
                model_version: geojson.metadata.model_version,
                regions: [geojson.metadata.town],
                total_detections: geojson.metadata.total_detections,
              }
            : undefined,
        };

        setData(miningData);
      } catch {
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#0B571A] animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading report...</p>
        </div>
      </div>
    );
  }

  // Pending / processing state
  if (error === "pending") {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <Clock size={48} className="text-[#0B571A] mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Report Processing</h1>
          <p className="text-gray-400 mb-4">
            Your detection report is being generated. This typically takes about 15 minutes.
          </p>
          <div className="bg-[#0B571A]/10 border border-[#0B571A]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">
              You&apos;ll receive an email when your report is ready. This page will automatically show your results.
            </p>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Report ID: {id}
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-[#0B571A] hover:text-[#0B571A]/80 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to main map</span>
          </a>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Report Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 text-[#0B571A] hover:text-[#0B571A]/80 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to main map</span>
          </a>
        </div>
      </div>
    );
  }

  const filteredCount = data
    ? data.features.filter((f) => f.properties.probability >= probabilityFilter).length
    : 0;

  return (
    <div className="h-screen w-full relative">
      {/* Report header overlay */}
      <div className="absolute top-4 left-4 z-30 glass-card p-4 max-w-sm">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <MapPin size={14} className="text-[#0B571A]" />
              <h1 className="text-white font-semibold text-sm">
                {metadata?.town || "Detection Report"}
              </h1>
            </div>
            {metadata?.region && (
              <p className="text-gray-400 text-xs">{metadata.region} Region</p>
            )}
          </div>
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
            title="Back to main map"
          >
            <ArrowLeft size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-black/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-gray-500 uppercase">Detections</p>
            <p className="text-lg font-bold text-white">{filteredCount}</p>
          </div>
          <div className="bg-black/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-gray-500 uppercase">Threshold</p>
            <p className="text-lg font-bold text-white">{Math.round(probabilityFilter * 100)}%</p>
          </div>
        </div>

        {metadata?.generated_at && (
          <p className="text-[10px] text-gray-500 mt-2">
            Generated {new Date(metadata.generated_at).toLocaleDateString()}
          </p>
        )}

        <p className="text-[10px] text-gray-500 mt-1">
          Report available for 7 days • ID: {id}
        </p>
      </div>

      {/* Map */}
      <Map
        data={data}
        onSelectDetection={setSelectedDetection}
        selectedDetection={selectedDetection}
        probabilityFilter={probabilityFilter}
        onFilterChange={setProbabilityFilter}
        showPoints={true}
        onToggleShowPoints={() => {}}
        detectionCount={filteredCount}
        initialCenter={metadata?.center ? [metadata.center.lon, metadata.center.lat] : undefined}
        initialZoom={12}
        hideRequestButton={true}
      />
    </div>
  );
}
