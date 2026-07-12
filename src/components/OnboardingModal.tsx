"use client";

import { useEffect, useState } from "react";
import {
  Satellite,
  SlidersHorizontal,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  Crosshair,
  Map as MapIcon,
  List,
  MousePointerClick,
} from "lucide-react";

const SEEN_KEY = "ecohealth-onboarding-seen";

// Confidence bands matching the map's circle-color interpolation
const LEGEND = [
  { color: "#ef4444", label: "95%+", desc: "Near-certain" },
  { color: "#0B571A", label: "85–95%", desc: "High confidence" },
  { color: "#f59e0b", label: "70–85%", desc: "Likely" },
  { color: "#22d3ee", label: "50–70%", desc: "Possible" },
];

const CONTROLS = [
  { icon: SlidersHorizontal, name: "Filters", desc: "Set the minimum confidence shown on the map", corner: "top left" },
  { icon: ClipboardList, name: "Request a scan", desc: "Run the AI on any town in Ghana — report by email or SMS", corner: "top left" },
  { icon: BarChart3, name: "Statistics", desc: "Hover for site counts by confidence level", corner: "left" },
  { icon: Crosshair, name: "Display", desc: "Show or hide the detection markers", corner: "left" },
  { icon: MapIcon, name: "Basemap & Compare", desc: "Switch imagery, or compare any year since 2016 side-by-side", corner: "bottom left" },
  { icon: List, name: "All detections", desc: "Browse every site — click one to fly to it", corner: "bottom right" },
  { icon: MousePointerClick, name: "Any circle", desc: "Click for coordinates, confidence, and a Google Maps link", corner: "on the map" },
];

export function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY) !== "1") setShow(true);
  }, []);

  if (!show) return null;

  const finish = () => {
    localStorage.setItem(SEEN_KEY, "1");
    setShow(false);
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="glass-card max-w-lg w-full p-6 border border-[#0B571A]/40">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B571A]/20 border border-[#0B571A]/50 flex items-center justify-center shrink-0">
              <Satellite size={18} className="text-[#0B571A]" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">
                {step === 0 ? "Reading this map" : "The controls"}
              </h2>
              <p className="text-xs text-gray-400">
                {step === 0 ? "What the circles mean" : "Where everything lives"}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500">{step + 1} / 2</span>
        </div>

        {step === 0 ? (
          <div className="space-y-4 text-sm text-gray-300">
            <p>
              Every circle is a <span className="text-white font-medium">suspected mining site</span> detected
              by our AI from Sentinel-2 satellite imagery. The whole mining belt is
              re-scanned automatically every Monday.
            </p>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Color = how confident the model is
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LEGEND.map((l) => (
                  <div key={l.label} className="flex items-center gap-2.5 bg-black/40 rounded-lg px-3 py-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border-2 border-white/80"
                      style={{ backgroundColor: l.color }}
                    />
                    <div>
                      <span className="text-white text-xs font-semibold">{l.label}</span>
                      <span className="text-gray-400 text-xs"> · {l.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg px-3 py-2.5">
              <AlertTriangle size={15} className="text-[#f59e0b] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                <span className="text-white font-medium">The AI can make mistakes.</span> Detections
                are strong indicators, not proof — some sites may be missed and some flags may be
                wrong, and the model keeps improving as we train it on more Ghanaian terrain. Use
                the year-by-year comparison to verify what actually changed on the ground.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {CONTROLS.map((c) => (
              <div key={c.name} className="flex items-center gap-3 bg-black/40 rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#0B571A]/15 border border-[#0B571A]/40 flex items-center justify-center shrink-0">
                  <c.icon size={14} className="text-[#0B571A]" />
                </div>
                <div className="min-w-0">
                  <span className="text-white text-xs font-semibold">{c.name}</span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wide"> · {c.corner}</span>
                  <p className="text-gray-400 text-xs leading-snug">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          {step === 1 && (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 border border-white/20 hover:bg-white/10 text-gray-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => (step === 0 ? setStep(1) : finish())}
            className="flex-[2] bg-[#0B571A] hover:bg-[#0B571A]/80 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {step === 0 ? "Next — the controls" : "Explore the map"}
          </button>
        </div>
        {step === 0 && (
          <button
            type="button"
            onClick={finish}
            className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
