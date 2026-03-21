"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X, MapPin, User, Building2, FileText, ClipboardList, Mail, Phone } from "lucide-react";
import { GHANA_TOWNS, GhanaTown } from "@/data/ghanaTowns";

interface SearchReportButtonProps {
  onLocationSearch?: (location: string) => void;
}

export function SearchReportButton({ onLocationSearch }: SearchReportButtonProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTown, setSelectedTown] = useState<GhanaTown | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ id: string; reportUrl: string } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    residency: "",
    reason: "",
    organization: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTowns = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return GHANA_TOWNS;
    return GHANA_TOWNS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.region.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered towns by region
  const groupedTowns = useMemo(() => {
    const groups: Record<string, GhanaTown[]> = {};
    for (const town of filteredTowns) {
      if (!groups[town.region]) groups[town.region] = [];
      groups[town.region].push(town);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTowns]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTown = (town: GhanaTown) => {
    setSelectedTown(town);
    setSearchQuery(town.name);
    setDropdownOpen(false);
    if (onLocationSearch) {
      onLocationSearch(`${town.lat},${town.lon}`);
    }
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit =
    selectedTown && formData.email && isValidEmail(formData.email) && formData.name && !submitting;

  const handleSubmitReport = async () => {
    if (!selectedTown || !canSubmit) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitResult(null);

    try {
      const tileServerUrl =
        process.env.NEXT_PUBLIC_TILE_SERVER_URL ||
        "https://minningbackend-production.up.railway.app";

      const res = await fetch(`${tileServerUrl}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          town: selectedTown.name,
          region: selectedTown.region,
          lat: selectedTown.lat,
          lon: selectedTown.lon,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          residency: formData.residency,
          reason: formData.reason,
          organization: formData.organization,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setSubmitResult({ id: data.id, reportUrl: data.reportUrl });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", phone: "", residency: "", reason: "", organization: "" });
    setSearchQuery("");
    setSelectedTown(null);
    setSubmitResult(null);
    setSubmitError("");
  };

  return (
    <div className="absolute top-6 left-16 z-30">
      {/* Search Panel */}
      {showPanel && (
        <div className="absolute top-0 left-0 w-80 glass-card p-4 animate-in slide-in-from-left-2 duration-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ClipboardList size={16} className="text-[#0B571A]" />
              <span className="font-semibold text-white text-sm">Request Detection</span>
            </div>
            <button
              onClick={() => { setShowPanel(false); handleReset(); }}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Success State */}
          {submitResult && (
            <div className="space-y-3">
              <div className="bg-[#0B571A]/20 border border-[#0B571A]/40 rounded-lg p-3">
                <p className="text-sm text-white font-medium mb-1">Request submitted!</p>
                <p className="text-xs text-gray-300 mb-2">
                  We&apos;re running detection on <strong>{selectedTown?.name}</strong>. This takes about 15 minutes.
                  You&apos;ll receive an email when your report is ready.
                </p>
                <p className="text-xs text-gray-400">
                  Note: Reports are available for 7 days.
                </p>
              </div>
              <a
                href={submitResult.reportUrl}
                className="block w-full text-center bg-[#0B571A] hover:bg-[#0B571A]/80 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                View Report Status
              </a>
              <button
                onClick={handleReset}
                className="w-full text-center text-gray-400 hover:text-white text-xs py-2 transition-colors"
              >
                Submit another request
              </button>
            </div>
          )}

          {/* Form */}
          {!submitResult && (
            <>
              {/* Town Dropdown */}
              <div className="mb-4" ref={dropdownRef}>
                <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                  <MapPin size={12} />
                  <span>Select Town</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedTown(null);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search or select a town..."
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors pr-10"
                  />
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0B571A]/20 hover:bg-[#0B571A]/40 flex items-center justify-center transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`text-[#0B571A] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Dropdown List */}
                {dropdownOpen && (
                  <div className="mt-1 bg-black/90 border border-[#0B571A]/30 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {groupedTowns.length > 0 ? (
                      groupedTowns.map(([region, towns]) => (
                        <div key={region}>
                          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#0B571A] uppercase tracking-wider bg-[#0B571A]/10 sticky top-0">
                            {region}
                          </div>
                          {towns.map((town) => (
                            <button
                              key={`${town.name}-${town.region}`}
                              onClick={() => handleSelectTown(town)}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors border-b border-white/5 last:border-0 ${
                                selectedTown?.name === town.name && selectedTown?.region === town.region
                                  ? "bg-[#0B571A]/30 text-white"
                                  : "text-gray-300 hover:bg-[#0B571A]/20"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <MapPin size={10} className="text-[#0B571A] flex-shrink-0" />
                                <span>{town.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-xs text-gray-500 text-center">
                        No towns found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-4 pt-4">
                <p className="text-xs text-gray-400 mb-3">Your details (we&apos;ll email your report)</p>
              </div>

              {/* Report Form */}
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <User size={12} />
                    <span>Your Name <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <Mail size={12} />
                    <span>Email <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full bg-black/60 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      formData.email && !isValidEmail(formData.email)
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-[#0B571A]/30 focus:border-[#0B571A]"
                    }`}
                  />
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="text-red-400 text-[10px] mt-1">Please enter a valid email</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <Phone size={12} />
                    <span>Phone (optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors"
                  />
                </div>

                {/* Residency */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <MapPin size={12} />
                    <span>Residency</span>
                  </label>
                  <input
                    type="text"
                    value={formData.residency}
                    onChange={(e) => setFormData({ ...formData, residency: e.target.value })}
                    placeholder="Your location/residency"
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <FileText size={12} />
                    <span>Reason for Report</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Describe the reason for your report..."
                    rows={3}
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors resize-none"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="flex items-center space-x-2 text-xs text-gray-400 mb-1.5">
                    <Building2 size={12} />
                    <span>Organization</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Organization you're under (if any)"
                    className="w-full bg-black/60 border border-[#0B571A]/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0B571A] transition-colors"
                  />
                </div>

                {/* Error */}
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    <p className="text-red-400 text-xs">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReport}
                  disabled={!canSubmit}
                  className="w-full mt-2 bg-[#0B571A] hover:bg-[#0B571A]/80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  {submitting ? "Submitting..." : "Request Detection"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Report Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          showPanel
            ? "bg-[#0B571A] text-white shadow-[#0B571A]/40"
            : "bg-black/80 backdrop-blur-md border border-[#0B571A]/40 text-[#0B571A] hover:border-[#0B571A] hover:bg-[#0B571A]/10"
        }`}
        title="Request Detection"
      >
        <ClipboardList size={20} />
      </button>
    </div>
  );
}
