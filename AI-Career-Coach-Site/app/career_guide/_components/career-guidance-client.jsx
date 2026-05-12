"use client";

import { useState, useRef } from "react";
import { Sparkles, RefreshCw, Target, Lightbulb, GraduationCap, Loader2, Copy, Check, Download, ChevronRight, ChevronLeft, Clock, Briefcase, Save, History, X } from "lucide-react";

// ─── Parse AI Markdown into timeline sections ───────────────────────────────
function parseRoadmapSections(text) {
  const sectionIcons = {
    "Career Path": "🎯",
    "Learning": "📚",
    "Projects": "💼",
    "Certifications": "🎓",
    "Career Progression": "🚀",
    "Next Steps": "🌟",
  };
  const lines = text.split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      const title = line.replace(/^##\s+/, "").replace(/[🎯📚💼🎓🚀🌟]\s*/g, "").trim();
      const iconKey = Object.keys(sectionIcons).find((k) => title.includes(k)) || "";
      current = { title, icon: sectionIcons[iconKey] || "✨", items: [] };
    } else if (current && line.trim()) {
      current.items.push(line.trim());
    }
  }
  if (current) sections.push(current);
  return sections;
}

// ─── Timeline Card ────────────────────────────────────────────────────────────
function TimelineCard({ section, index, total }) {
  const [open, setOpen] = useState(index === 0);
  const colors = [
    "from-teal-500 to-cyan-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-green-500 to-emerald-600",
    "from-yellow-500 to-amber-600",
  ];
  const bg = colors[index % colors.length];

  return (
    <div className="relative flex gap-4">
      {/* Line */}
      {index < total - 1 && (
        <div className="absolute left-[22px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-transparent z-0" />
      )}
      {/* Icon circle */}
      <div className={`relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-xl shadow-lg mt-1`}>
        {section.icon}
      </div>
      {/* Card */}
      <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r ${bg} text-white font-bold text-left`}
        >
          <span className="text-base">{section.title}</span>
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
            <ChevronRight className="w-5 h-5" />
          </span>
        </button>
        {open && (
          <div className="px-5 py-4 space-y-2">
            {section.items.map((item, i) => (
              <p key={i} className="text-gray-700 text-sm leading-relaxed border-l-2 border-teal-300 pl-3">
                {item.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "")}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Your Background", "Skills & Goals", "Get Roadmap"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${i === step ? "bg-[#0e7472] text-white shadow-lg scale-105" : i < step ? "bg-teal-200 text-teal-800" : "bg-white/40 text-white"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? "bg-white text-[#0e7472]" : i < step ? "bg-teal-600 text-white" : "bg-white/30 text-white"}`}>
              {i < step ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-white/60" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CareerGuidanceClient({ userProfile }) {
  // Pre-fill from onboarding
  const onboardingSkills = userProfile?.skills?.join(", ") || "";
  const onboardingIndustry = userProfile?.industry?.replace(/-/g, " ") || "";
  const onboardingExp = userProfile?.experience ? `${userProfile.experience} years` : "";

  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState(onboardingSkills);
  const [interests, setInterests] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState(onboardingExp);
  const [location, setLocation] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("careerRoadmaps") || "[]"); } catch { return []; }
    }
    return [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const roadmapRef = useRef(null);

  const buildPrompt = () =>
    `You are a professional career counselor. Create a personalized career roadmap for:
- Skills: ${skills || "N/A"}
- Interests: ${interests || "N/A"}
- Education: ${degree || "N/A"}
- Experience: ${experience || "N/A"}
- Target Location: ${location || "N/A"}
- Industry Background: ${onboardingIndustry || "N/A"}

Use clear markdown headings (##, ###), bullet points, be specific and actionable.

## 🎯 Career Path Overview
[1-2 sentence summary]

## 📚 Key Learning Areas
- [Skill]: [brief description]

## 💼 Recommended Projects
1. **[Project]**: [1 sentence]

## 🎓 Valuable Certifications
- [Cert] - [Why valuable]

## 🚀 Career Progression & Salary
**Entry (0-2 yrs):** [Role] - $XX,XXX
**Mid (2-5 yrs):** [Role] - $XX,XXX
**Senior (5+ yrs):** [Role] - $XXX,XXX

## 🌟 Next Steps
- [Immediate action]`;

  const getRoadmap = async (retryCount = 0) => {
    setError("");
    setIsLoading(true);
    setRoadmap("");
    setSections([]);
    try {
      const prompt = buildPrompt();
      const res = await fetch("/api/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.output && data.output.trim()) {
        const text = data.output.trim();
        setRoadmap(text);
        setSections(parseRoadmapSections(text));
      } else if (retryCount < 1) {
        // Auto-retry once if AI gives empty response
        setIsLoading(false);
        await getRoadmap(retryCount + 1);
        return;
      } else {
        setError("AI did not respond. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && !experience && !onboardingExp) {
      setError("Please enter your experience level."); return;
    }
    setError("");
    if (step === 0) { setStep(1); return; }
    if (step === 1) { setStep(2); getRoadmap(); }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roadmap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      skills, interests, degree,
      preview: roadmap.substring(0, 120) + "...",
      full: roadmap,
    };
    const updated = [entry, ...savedRoadmaps].slice(0, 10);
    setSavedRoadmaps(updated);
    localStorage.setItem("careerRoadmaps", JSON.stringify(updated));
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 3000);
  };

  const handleDeleteHistory = (id) => {
    const updated = savedRoadmaps.filter((r) => r.id !== id);
    setSavedRoadmaps(updated);
    localStorage.setItem("careerRoadmaps", JSON.stringify(updated));
  };

  const handleDownloadPDF = async () => {
    if (!roadmap) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxW = pageW - margin * 2;
    // Title
    doc.setFontSize(20);
    doc.setTextColor(14, 116, 114);
    doc.text("Your Personalized Career Roadmap", margin, 20);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Skills: ${skills || "N/A"}  |  Generated: ${new Date().toLocaleDateString()}`, margin, 28);
    doc.setDrawColor(14, 116, 114);
    doc.line(margin, 31, pageW - margin, 31);
    // Body text
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    const cleanText = roadmap.replace(/[#*`]/g, "").replace(/\n{3,}/g, "\n\n");
    const lines = doc.splitTextToSize(cleanText, maxW);
    let y = 38;
    for (const line of lines) {
      if (y > 275) { doc.addPage(); y = 15; }
      doc.text(line, margin, y);
      y += 6;
    }
    doc.save("career-roadmap.pdf");
  };

  const quickTags = [
    { label: "💻 Software Engineer", skills: "JavaScript, React, Node.js", interests: "Web Development" },
    { label: "📊 Data Science", skills: "Python, SQL, Machine Learning", interests: "Data Analysis" },
    { label: "🎨 UI/UX Designer", skills: "Figma, Wireframing", interests: "Design, User Research" },
    { label: "📈 Digital Marketing", skills: "SEO, Social Media", interests: "Marketing, Content" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#163235] via-[#0e7472] to-[#163235]">
      <div className="pt-20 md:pt-24" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-white flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10" /> AI Career Guidance
        </h1>
        <p className="text-center text-white/70 mb-10 text-sm">
          Powered by your profile · Personalized just for you
        </p>

        {/* History Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition text-sm font-medium"
          >
            <History className="w-4 h-4" />
            Saved Roadmaps ({savedRoadmaps.length})
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white/95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#0e7472]" /> Saved Roadmaps
            </h3>
            {savedRoadmaps.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved roadmaps yet.</p>
            ) : (
              <div className="space-y-3">
                {savedRoadmaps.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{r.date} · {r.skills}</p>
                      <p className="text-sm text-gray-700">{r.preview}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setRoadmap(r.full); setSections(parseRoadmapSections(r.full)); setStep(2); setShowHistory(false); }}
                        className="text-[#0e7472] text-xs font-semibold hover:underline"
                      >View</button>
                      <button onClick={() => handleDeleteHistory(r.id)} className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step Bar */}
        <StepBar step={step} />

        {/* ── STEP 0: Background ── */}
        {step === 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#0e7472]" /> Your Background
            </h2>
            {userProfile && (
              <p className="text-xs text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 mb-5">
                ✅ Pre-filled from your profile — you can edit if needed
              </p>
            )}
            <div className="space-y-5">
              <div>
                <label className="text-gray-700 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#0e7472]" /> Years of Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 2 years, Fresher, 5+ years"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0e7472] outline-none transition text-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-sm flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-[#0e7472]" /> Degree / Education
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. BBA, B.Tech, MBA, BSc CS"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0e7472] outline-none transition text-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-sm flex items-center gap-2 mb-2">
                  🌍 Target Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0e7472] outline-none transition text-gray-700 bg-white"
                >
                  <option value="">Select location...</option>
                  <option>Pakistan</option>
                  <option>USA</option>
                  <option>UAE / Gulf</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Remote / Global</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#163235] to-[#0e7472] text-white font-bold py-3 rounded-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Skills & Goals ── */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#0e7472]" /> Skills & Goals
            </h2>
            {userProfile?.skills?.length > 0 && (
              <p className="text-xs text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 mb-4">
                ✅ Skills pre-filled from your profile — add more if you like
              </p>
            )}

            {/* Quick Tags */}
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick fill:</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {quickTags.map((t) => (
                <button
                  key={t.label}
                  onClick={() => { setSkills(t.skills); setInterests(t.interests); }}
                  className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-100 transition font-medium"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-gray-700 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#0e7472]" /> Skills
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Python, Teamwork, React"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0e7472] outline-none transition text-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-sm flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-[#0e7472]" /> Interests
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. AI, Data Science, Marketing"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#0e7472] outline-none transition text-gray-700"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#163235] to-[#0e7472] text-white font-bold py-3 rounded-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Roadmap</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Roadmap Result ── */}
        {step === 2 && (
          <div>
            {isLoading ? (
              <div className="bg-white/95 rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
                <Loader2 className="w-12 h-12 text-[#0e7472] mx-auto mb-4 animate-spin" />
                <p className="text-xl font-semibold text-gray-700">CareerCraft is building your roadmap...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
              </div>
            ) : roadmap ? (
              <div>
                {/* Action bar */}
                <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Edit Inputs
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-2 bg-white text-[#0e7472] px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-semibold border border-gray-200">
                      {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-semibold border border-gray-200">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-gradient-to-r from-[#163235] to-[#0e7472] text-white px-4 py-2 rounded-lg hover:shadow-lg transition text-sm font-semibold">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button onClick={() => getRoadmap()} disabled={isLoading} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-semibold disabled:opacity-50">
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                  </div>
                </div>

                {/* Timeline Roadmap */}
                <div ref={roadmapRef} className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0e7472] to-[#163235] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Your Personalized Career Roadmap</h2>
                      <p className="text-sm text-gray-500">Based on: {skills || "your profile"}</p>
                    </div>
                  </div>

                  {sections.length > 0 ? (
                    <div className="mt-4">
                      {sections.map((sec, i) => (
                        <TimelineCard key={i} section={sec} index={i} total={sections.length} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{roadmap}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-white/80 mt-10">
                <p>Something went wrong. Please try again.</p>
                <button onClick={() => setStep(1)} className="mt-4 bg-white text-[#0e7472] px-6 py-2 rounded-lg font-semibold hover:shadow-md transition">
                  Go Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Save Success Modal ── */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowSaveModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            style={{ animation: "bounceIn 0.35s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Roadmap Saved! 🎉</h3>
            <p className="text-gray-500 text-sm mb-1">Your career roadmap has been saved successfully.</p>
            <p className="text-gray-400 text-xs">Access it anytime from <strong className="text-[#0e7472]">Saved Roadmaps</strong></p>
            <div className="mt-5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ animation: "shrinkBar 3s linear forwards" }} />
            </div>
            <button
              onClick={() => setShowSaveModal(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrinkBar { from { width: 100% } to { width: 0% } }
        @keyframes bounceIn {
          0% { transform: scale(0.75); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
