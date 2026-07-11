"use client";

import { useEffect, useState } from "react";
import { Monitor, ArrowRight } from "lucide-react";

// The map explorer is designed for larger displays: the compare slider,
// control columns, detection panels and the map itself compete for space.
// Below this width we present a notice first — visitors may still choose
// to continue on a phone, and that choice persists for the session.
const MIN_WIDTH = 768;
const BYPASS_KEY = "ecohealth-mobile-bypass";

export default function MobileGate({ children }: { children: React.ReactNode }) {
  // null until measured on the client — render nothing to avoid a flash
  const [tooSmall, setTooSmall] = useState<boolean | null>(null);
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    setBypassed(sessionStorage.getItem(BYPASS_KEY) === "1");
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
    const update = () => setTooSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (tooSmall === null) return null;

  if (tooSmall && !bypassed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8 text-center">
        <div>
          <div className="w-16 h-16 rounded-full bg-[#0B571A]/15 border border-[#0B571A]/40 flex items-center justify-center mx-auto mb-6">
            <Monitor size={28} className="text-[#0B571A]" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">
            Best experienced on a larger screen
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto mb-8">
            For the full, immersive experience — the interactive satellite map,
            year-by-year comparison, and live detection data — we recommend a
            laptop, desktop, or tablet. On a phone, the experience is
            significantly reduced.
          </p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(BYPASS_KEY, "1");
              setBypassed(true);
            }}
            className="inline-flex items-center gap-2 bg-[#0B571A] hover:bg-[#0B571A]/80 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
          >
            Continue on this device
            <ArrowRight size={15} />
          </button>
          <p className="text-xs text-gray-600 mt-6">
            Or learn about the project at{" "}
            <a href="https://ecohealthgh.com" className="text-[#0B571A] underline">
              ecohealthgh.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
