"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

// The map explorer is too dense for phone screens: compare slider, control
// columns, detection panels and the map itself all compete for space. Below
// this width we show a full-screen notice instead of a broken experience.
// Tablets (>= 768px) and up are allowed.
const MIN_WIDTH = 768;

export default function MobileGate({ children }: { children: React.ReactNode }) {
  // null until measured on the client — render nothing to avoid a flash
  const [tooSmall, setTooSmall] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MIN_WIDTH - 1}px)`);
    const update = () => setTooSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (tooSmall === null) return null;

  if (tooSmall) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8 text-center">
        <div>
          <div className="w-16 h-16 rounded-full bg-[#0B571A]/15 border border-[#0B571A]/40 flex items-center justify-center mx-auto mb-6">
            <Monitor size={28} className="text-[#0B571A]" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">
            This screen is too small
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto mb-6">
            The detection map packs in satellite imagery, year-by-year
            comparison, and live site data — more than a phone screen can
            hold. Please open it on a laptop, desktop, or tablet.
          </p>
          <p className="text-xs text-gray-600">
            Meanwhile, you can visit{" "}
            <a href="https://ecohealthgh.com" className="text-[#0B571A] underline">
              ecohealthgh.com
            </a>{" "}
            to learn about the project.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
