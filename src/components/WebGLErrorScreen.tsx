"use client";

import { Monitor, Wrench, Search, Lightbulb, RefreshCw, Globe } from "lucide-react";

interface WebGLErrorScreenProps {
  visible: boolean;
}

export function WebGLErrorScreen({ visible }: WebGLErrorScreenProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 0 60px rgba(11, 87, 26, 0.3)",
          border: "1px solid rgba(11, 87, 26, 0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
            <Monitor size={48} color="#0B571A" />
          </div>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: "0 0 8px" }}>
            WebGL Not Available
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            The 3D map requires WebGL (hardware acceleration) to render.
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#0B571A", fontSize: "16px", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Wrench size={16} /> How to fix in Chrome:
          </h3>
          <ol style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "2", paddingLeft: "20px", margin: 0 }}>
            <li>Open <code style={{ background: "rgba(11, 87, 26, 0.3)", padding: "2px 8px", borderRadius: "4px" }}>chrome://settings/system</code></li>
            <li>Enable <strong>&quot;Use hardware acceleration when available&quot;</strong></li>
            <li>Restart Chrome completely</li>
          </ol>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#0B571A", fontSize: "16px", fontWeight: "600", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={16} /> Still not working? Check WebGL status:
          </h3>
          <ol style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "2", paddingLeft: "20px", margin: 0 }}>
            <li>Go to <code style={{ background: "rgba(11, 87, 26, 0.3)", padding: "2px 8px", borderRadius: "4px" }}>chrome://gpu</code></li>
            <li>Look for &quot;WebGL&quot; - should say &quot;Hardware accelerated&quot;</li>
            <li>If blocked, go to <code style={{ background: "rgba(11, 87, 26, 0.3)", padding: "2px 8px", borderRadius: "4px" }}>chrome://flags</code> and enable &quot;Override software rendering list&quot;</li>
          </ol>
        </div>

        <div style={{ background: "rgba(11, 87, 26, 0.15)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <h3 style={{ color: "#0B571A", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Lightbulb size={14} /> Other solutions:
          </h3>
          <ul style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.8", paddingLeft: "16px", margin: 0 }}>
            <li>Update your graphics drivers</li>
            <li>Try Firefox or Safari browser</li>
            <li>If on a VM/remote desktop, use a local machine</li>
            <li>Disable browser extensions that may block WebGL</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#0B571A",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#0d6b1f";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#0B571A";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <RefreshCw size={16} /> Retry After Enabling
          </button>
          <a
            href="https://get.webgl.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Globe size={16} /> Test WebGL
          </a>
        </div>
      </div>
    </div>
  );
}
