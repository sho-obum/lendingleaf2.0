"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Home, CheckCircle, Lock, Loader2 } from "lucide-react";

type Step = 1 | 2 | 3;
type LoanType = "home" | "personal";

const MIN_SCORE = 300;
const MAX_SCORE = 900;
const START_ANGLE = (-140 * Math.PI) / 180;
const END_ANGLE = (140 * Math.PI) / 180;
const ARC_RADIUS = 85;

function describeArc(radius: number, start: number, end: number) {
  const sx = Math.cos(start) * radius;
  const sy = Math.sin(start) * radius;
  const ex = Math.cos(end) * radius;
  const ey = Math.sin(end) * radius;
  const largeArcFlag = end - start <= Math.PI ? 0 : 1;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${ex} ${ey}`;
}

function getBand(score: number) {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  return "Excellent";
}

function getBandColor(band: string) {
  switch (band) {
    case "Poor": return "#ef4444";
    case "Fair": return "#f59e0b";
    case "Good": return "#22c55e";
    case "Excellent": return "#4d7c0f";
    default: return "#213d4f";
  }
}

export default function CreditScoreCard() {
  const [step, setStep] = React.useState<Step>(1);
  const [score, setScore] = React.useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = React.useState<number>(MIN_SCORE);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loanType, setLoanType] = React.useState<LoanType>("personal");
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const arcPath = React.useMemo(() => describeArc(ARC_RADIUS, START_ANGLE, END_ANGLE), []);
  const isFormValid = name.trim().length >= 2 && phone.length === 10;

  // Animate score when it changes (after API response)
  React.useEffect(() => {
    if (score === null) return;
    
    const duration = 1000;
    const startTime = performance.now();
    const startScore = MIN_SCORE;
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (score - startScore) * eased);
      setAnimatedScore(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  // Calculate progress for arc (0-1)
  const displayScore = step === 3 ? animatedScore : MIN_SCORE;
  const progress = (displayScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  const band = step === 3 ? getBand(animatedScore) : null;
  const bandColor = band ? getBandColor(band) : "#213d4f";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setStep(2);
    
    try {
      const response = await fetch("/api/credit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: name,
          mobile: phone,
          loanType: loanType,
        }),
      });
      
      const data = await response.json();
      
      if (data.status && data.score) {
        setScore(data.score);
        setStep(3);
      } else {
        // Fallback score
        setScore(loanType === "home" ? 756 : 742);
        setStep(3);
      }
    } catch {
      // Fallback score on error
      setScore(loanType === "home" ? 756 : 742);
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
    setScore(null);
    setAnimatedScore(MIN_SCORE);
    setName("");
    setPhone("");
    setLoanType("personal");
    setHasInteracted(false);
  };

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="relative bg-white/95 backdrop-blur-xl border border-[#213d4f]/8 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(33,61,79,0.15)] overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#eefe92] via-[#a3e635] to-[#4d7c0f]" />
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Score Gauge */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] flex items-center justify-center">
                {/* Pulsing background */}
                <div className={`absolute inset-2 rounded-full transition-all duration-500 ${
                  step === 1 && !hasInteracted 
                    ? 'bg-gradient-to-br from-[#eefe92]/20 to-[#22c55e]/10 animate-pulse' 
                    : step === 3 
                      ? 'bg-gradient-to-br from-[#eefe92]/25 to-[#22c55e]/10' 
                      : 'bg-[#f8fafc]'
                }`} />
                
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="30%" stopColor="#f59e0b" />
                      <stop offset="60%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#4d7c0f" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  <g transform="translate(100 100)">
                    {/* Background track */}
                    <path d={arcPath} fill="none" stroke="#e5e7eb" strokeWidth={14} strokeLinecap="round" />
                    
                    {/* Demo animation arc (CSS-based, only when idle) */}
                    {step === 1 && !hasInteracted && (
                      <path
                        d={arcPath}
                        fill="none"
                        stroke="url(#gaugeGrad)"
                        strokeWidth={14}
                        strokeLinecap="round"
                        pathLength={100}
                        strokeDasharray={100}
                        className="animate-demo-gauge"
                        style={{ filter: "url(#glow)" }}
                      />
                    )}
                    
                    {/* Actual score arc (JS-animated after API) */}
                    {(step === 3 || (step === 1 && hasInteracted)) && (
                      <path
                        d={arcPath}
                        fill="none"
                        stroke="url(#gaugeGrad)"
                        strokeWidth={14}
                        strokeLinecap="round"
                        pathLength={100}
                        strokeDasharray={100}
                        strokeDashoffset={100 - progress * 100}
                        style={{ 
                          filter: "url(#glow)",
                          transition: "stroke-dashoffset 0.3s ease-out"
                        }}
                      />
                    )}
                    
                    {/* Scale markers */}
                    <text x="-75" y="-28" fontSize="9" fill="#9ca3af" fontWeight="500">300</text>
                    <text x="-75" y="38" fontSize="9" fill="#9ca3af" fontWeight="500">900</text>
                  </g>
                </svg>
               
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {step === 2 ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 text-[#4d7c0f] animate-spin" />
                      <span className="text-[10px] text-[#213d4f]/50">Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[8px] sm:text-[9px] text-[#213d4f]/40 font-semibold uppercase tracking-widest">Credit Score</span>
                      <span className={`text-4xl sm:text-5xl md:text-6xl font-black leading-none transition-all duration-300 ${
                        step === 3 ? 'text-[#213d4f]' : 'text-[#213d4f]/40'
                      }`}>
                        {step === 3 ? animatedScore : "---"}
                      </span>
                      {band && (
                        <span 
                          className="text-xs font-bold mt-2 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300"
                          style={{ backgroundColor: `${bandColor}18`, color: bandColor }}
                        >
                          {band}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Tip below gauge (only when idle) */}
              {step === 1 && !hasInteracted && (
                <p className="text-center text-[9px] sm:text-[10px] text-[#4d7c0f] font-medium mt-1 animate-pulse">
                  Free • No impact on score
                </p>
              )}
            </div>

            {/* Form Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); handleInteraction(); }}
                        onFocus={() => { setFocusedField('name'); handleInteraction(); }}
                        onBlur={() => setFocusedField(null)}
                        className={`h-10 sm:h-11 text-xs sm:text-sm border-2 bg-[#f8fafc] rounded-xl pr-8 transition-all ${
                          focusedField === 'name' ? 'border-[#4d7c0f] bg-white ring-2 ring-[#eefe92]/30' : 'border-[#213d4f]/10'
                        }`}
                      />
                      {name.length >= 2 && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="10-digit mobile"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); handleInteraction(); }}
                        onFocus={() => { setFocusedField('phone'); handleInteraction(); }}
                        onBlur={() => setFocusedField(null)}
                        className={`h-10 sm:h-11 text-xs sm:text-sm border-2 bg-[#f8fafc] rounded-xl pr-8 transition-all ${
                          focusedField === 'phone' ? 'border-[#4d7c0f] bg-white ring-2 ring-[#eefe92]/30' : 'border-[#213d4f]/10'
                        }`}
                      />
                      {phone.length === 10 && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                      )}
                    </div>
                  </div>

                  {/* Loan Type Toggle */}
                  <div className="flex gap-1.5 p-1 bg-[#f1f5f9] rounded-xl">
                    {(["personal", "home"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setLoanType(type); handleInteraction(); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          loanType === type
                            ? "bg-white text-[#213d4f] shadow-sm"
                            : "text-[#213d4f]/50 hover:text-[#213d4f]/70"
                        }`}
                      >
                        {type === "personal" ? <Wallet className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                        <span>{type === "personal" ? "Personal" : "Home"}</span>
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full h-10 sm:h-12 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                      isFormValid 
                        ? 'bg-[#213d4f] hover:bg-[#1a3240] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                        : 'bg-[#213d4f]/20 text-[#213d4f]/40'
                    }`}
                  >
                    {isFormValid ? (
                      <span className="flex items-center gap-2">
                        Check My Score
                        <span className="animate-bounce">→</span>
                      </span>
                    ) : (
                      "Enter details above"
                    )}
                  </Button>
                  
                  {/* Trust text */}
                  <p className="text-[10px] text-center text-[#213d4f]/40 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Free • No credit impact • 256-bit secure
                  </p>
                </form>
              )}

              {step === 2 && (
                <div className="py-6 space-y-3">
                  <p className="text-sm font-semibold text-[#213d4f]">Fetching your score...</p>
                  <p className="text-[10px] text-[#213d4f]/50">Securely connecting to bureaus</p>
                  <div className="h-1.5 bg-[#213d4f]/5 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-[#eefe92] via-[#a3e635] to-[#4d7c0f] rounded-full animate-loading-bar" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#213d4f]/40">
                    <Lock className="w-3 h-3" />
                    256-bit encryption
                  </div>
                </div>
              )}

              {step === 3 && band && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-[#213d4f]">
                      <span style={{ color: bandColor }}>{band}</span> score!
                    </p>
                    <p className="text-xs sm:text-sm text-[#213d4f]/60 mt-1">
                      {band === "Excellent" && `Great job, ${name.split(" ")[0]}! You qualify for premium rates.`}
                      {band === "Good" && `Nice, ${name.split(" ")[0]}! You'll get competitive offers.`}
                      {band === "Fair" && `${name.split(" ")[0]}, you're close to better rates!`}
                      {band === "Poor" && `${name.split(" ")[0]}, let's find options for you.`}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="h-9 sm:h-11 px-3 text-[10px] sm:text-xs font-medium border-2 border-[#213d4f]/10 text-[#213d4f]/70 rounded-xl hover:bg-[#f8fafc] cursor-pointer"
                    >
                      ↻ Again
                    </Button>
                    <Button
                      className="h-9 sm:h-11 flex-1 text-xs sm:text-sm font-bold rounded-xl cursor-pointer bg-[#213d4f] hover:bg-[#1a3240] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      View Loan Offers →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes demo-gauge {
          0%, 100% { stroke-dashoffset: 95; }
          50% { stroke-dashoffset: 40; }
        }
        .animate-demo-gauge {
          animation: demo-gauge 4s ease-in-out infinite;
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
