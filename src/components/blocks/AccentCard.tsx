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

// Demo tips that cycle during idle animation
const DEMO_TIPS = [
  "750+ = Premium rates",
  "Free, no impact on score",
  "Results in 60 seconds",
  "Compare 50+ lenders",
  "100% secure & private",
];

function describeArc(radius: number, start: number, end: number) {
  const sx = Math.cos(start) * radius;
  const sy = Math.sin(start) * radius;
  const ex = Math.cos(end) * radius;
  const ey = Math.sin(end) * radius;
  const largeArcFlag = end - start <= Math.PI ? 0 : 1;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${ex} ${ey}`;
}

function getBand(score: number | null) {
  if (score == null) return null;
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  return "Excellent";
}

function getBandColor(band: string | null) {
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
  const [animScore, setAnimScore] = React.useState<number | null>(null);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loanType, setLoanType] = React.useState<LoanType>("personal");
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  
  // Demo mode state
  const [isDemoMode, setIsDemoMode] = React.useState(true);
  const [demoScore, setDemoScore] = React.useState(650);
  const [demoTipIndex, setDemoTipIndex] = React.useState(0);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [transitionScore, setTransitionScore] = React.useState<number | null>(null);

  const arcPath = React.useMemo(() => describeArc(ARC_RADIUS, START_ANGLE, END_ANGLE), []);

  // Demo mode animation - smooth 350→random→350 with ease-in transitions
  React.useEffect(() => {
    if (!isDemoMode || hasInteracted) return;
    
    const randomTargets = [500, 650, 780, 620, 720]; // Random target scores
    let currentTargetIndex = 0;
    let animationFrameId: number;
    
    const animateToTarget = (startScore: number, targetScore: number, duration: number) => {
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-in-out for smooth animation
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentScore = Math.round(startScore + (targetScore - startScore) * eased);
        setDemoScore(currentScore);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const runCycle = () => {
      const targetScore = randomTargets[currentTargetIndex];
      
      // 350 → target (1.5s)
      animateToTarget(350, targetScore, 1500);
      
      setTimeout(() => {
        // target → 350 (1.5s)
        animateToTarget(targetScore, 350, 1500);
        
        setTimeout(() => {
          // Wait 2 seconds, then next cycle
          currentTargetIndex = (currentTargetIndex + 1) % randomTargets.length;
          runCycle();
        }, 1500 + 2000); // 1.5s animation + 2s wait
      }, 1500);
    };
    
    // Start first cycle
    setDemoScore(350);
    setTimeout(runCycle, 500); // Small initial delay
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDemoMode, hasInteracted]);

  // Cycle through tips during demo
  React.useEffect(() => {
    if (!isDemoMode || hasInteracted) return;
    const interval = setInterval(() => {
      setDemoTipIndex((prev) => (prev + 1) % DEMO_TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isDemoMode, hasInteracted]);

  // Smooth transition animation when user starts interacting
  React.useEffect(() => {
    if (!isTransitioning) return;
    
    let frameId: number;
    const startScore = transitionScore ?? demoScore;
    const duration = 800; // smooth 800ms fade down
    const startTime = performance.now();
    
    const animateTransition = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      // Animate down to 370 instead of MIN_SCORE
      const newScore = Math.round(startScore - (startScore - 370) * eased);
      setTransitionScore(newScore);
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animateTransition);
      } else {
        setIsTransitioning(false);
        setTransitionScore(null);
        setIsDemoMode(false);
      }
    };
    
    frameId = requestAnimationFrame(animateTransition);
    return () => cancelAnimationFrame(frameId);
  }, [isTransitioning, transitionScore, demoScore]);

  // Stop demo when user interacts - with smooth transition
  const handleInteraction = () => {
    if (!hasInteracted && !isTransitioning) {
      setHasInteracted(true);
      setTransitionScore(demoScore);
      setIsTransitioning(true);
    }
  };

  // Real score animation
  React.useEffect(() => {
    if (score == null) { setAnimScore(null); return; }
    let frameId: number;
    const from = animScore ?? MIN_SCORE;
    const to = score;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const tRaw = Math.min(1, (now - startTime) / duration);
      const t = 1 - Math.pow(1 - tRaw, 4);
      setAnimScore(Math.round(from + (to - from) * t));
      if (tRaw < 1) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Display logic
  const displayScore = isTransitioning && transitionScore !== null 
    ? transitionScore 
    : isDemoMode && !hasInteracted 
      ? demoScore 
      : "---";
  const currentScore = isTransitioning && transitionScore !== null
    ? transitionScore
    : isDemoMode && !hasInteracted 
      ? demoScore 
      : 370; // Stuck at 370 position when user interacts
  const band = getBand(currentScore);
  const bandColor = getBandColor(band);
  const progress = currentScore == null ? 0 : Math.max(0, Math.min(1, (currentScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)));
  const isFormValid = name.trim().length >= 2 && phone.length === 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep(2);
    setTimeout(() => {
      setScore(loanType === "home" ? 756 : 742);
      setStep(3);
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setScore(null);
    setAnimScore(null);
    setName("");
    setPhone("");
    setLoanType("personal");
    setHasInteracted(false);
    setIsDemoMode(true);
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="relative bg-white/95 backdrop-blur-xl border border-[#213d4f]/8 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(33,61,79,0.15)] overflow-hidden transition-all duration-300 hover:shadow-[0_25px_70px_-15px_rgba(33,61,79,0.2)]">
        {/* Animated gradient border top */}
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#eefe92] via-[#a3e635] to-[#4d7c0f] bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="p-4 sm:p-6 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Score Gauge - BIGGER */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] flex items-center justify-center">
                {/* Pulsing background ring */}
                <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
                  isDemoMode && !hasInteracted 
                    ? 'bg-gradient-to-br from-[#eefe92]/20 to-[#22c55e]/5 animate-pulse' 
                    : step === 3 
                      ? 'bg-gradient-to-br from-[#eefe92]/25 to-[#22c55e]/10 scale-100' 
                      : 'bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] scale-95'
                }`} />
                
                <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="30%" stopColor="#f59e0b" />
                      <stop offset="60%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#4d7c0f" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="softShadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                    </filter>
                  </defs>
                  <g transform="translate(100 100)">
                    {/* Background track */}
                    <path d={arcPath} fill="none" stroke="#e5e7eb" strokeWidth={16} strokeLinecap="round" filter="url(#softShadow)" />
                    {/* Progress arc */}
                    <path
                      d={arcPath}
                      fill="none"
                      stroke="url(#gaugeGrad)"
                      strokeWidth={16}
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={100 - progress * 100}
                      filter="url(#glow)"
                      className={isDemoMode && !hasInteracted ? "" : "transition-all duration-700"}
                    />
                    {/* Scale markers - positioned at arc ends */}
                    <text x="-78" y="-33" fontSize="10" fill="#9ca3af" fontWeight="500">300</text>
                    <text x="-78" y="42" fontSize="10" fill="#9ca3af" fontWeight="500">900</text>
                  </g>
                </svg>
               
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {step === 2 ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#4d7c0f] animate-spin" />
                      <span className="text-[10px] sm:text-xs text-[#213d4f]/50 animate-pulse">Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[8px] sm:text-[9px] text-[#213d4f]/40 font-semibold uppercase tracking-widest">Credit Score</span>
                      <span className={`text-4xl sm:text-5xl md:text-6xl font-black leading-none transition-all duration-300 ${
                        step === 3 ? 'text-[#213d4f] scale-105' : isDemoMode && !hasInteracted ? 'text-[#213d4f]/60' : 'text-[#213d4f]/80'
                      }`}>{displayScore}</span>
                      {band && (
                        <span 
                          className="text-xs font-bold mt-2 px-3 py-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: `${bandColor}18`, color: bandColor }}
                        >
                          {band}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Demo tip below gauge */}
              {isDemoMode && !hasInteracted && step === 1 && (
                <div className="text-center mt-1 sm:mt-2">
                  <p className="text-[9px] sm:text-[10px] text-[#4d7c0f] font-medium animate-pulse transition-all duration-500">
                    {DEMO_TIPS[demoTipIndex]}
                  </p>
                </div>
              )}
            </div>

            {/* Form Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                  {/* Header */}
                 
                  {/* Inputs */}
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="relative">
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); handleInteraction(); }}
                        onFocus={() => { setFocusedField('name'); handleInteraction(); }}
                        onBlur={() => setFocusedField(null)}
                        className={`h-10 sm:h-11 text-xs sm:text-sm border-2 bg-[#f8fafc] rounded-lg sm:rounded-xl pr-8 transition-all duration-200 ${
                          focusedField === 'name' ? 'border-[#4d7c0f] bg-white ring-2 ring-[#eefe92]/30' : 'border-[#213d4f]/10 hover:border-[#213d4f]/20'
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
                        className={`h-10 sm:h-11 text-xs sm:text-sm border-2 bg-[#f8fafc] rounded-lg sm:rounded-xl pr-8 transition-all duration-200 ${
                          focusedField === 'phone' ? 'border-[#4d7c0f] bg-white ring-2 ring-[#eefe92]/30' : 'border-[#213d4f]/10 hover:border-[#213d4f]/20'
                        }`}
                      />
                      {phone.length === 10 && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                      )}
                    </div>
                  </div>

                  {/* Loan Type Toggle */}
                  <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-[#f1f5f9] rounded-lg sm:rounded-xl">
                    {(["personal", "home"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setLoanType(type); handleInteraction(); }}
                        className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
                          loanType === type
                            ? "bg-white text-[#213d4f] shadow-sm"
                            : "text-[#213d4f]/50 hover:text-[#213d4f]/70"
                        }`}
                      >
                        {type === "personal" ? <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        <span>{type === "personal" ? "Personal" : "Home"}</span>
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full h-10 sm:h-12 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer ${
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
                      <span className={`${!hasInteracted ? 'animate-pulse' : ''}`}>
                        {!hasInteracted ? "Try it — Enter your details" : "Enter details above"}
                      </span>
                    )}
                  </Button>
                  
                  {/* Trust micro-text */}
                  <p className="text-[10px] text-center text-[#213d4f]/40 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Free • No credit impact • 256-bit secure
                  </p>
                </form>
              )}

              {step === 2 && (
                <div className="py-6 sm:py-8 space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-sm sm:text-base font-semibold text-[#213d4f]">Fetching your score...</p>
                    <p className="text-[10px] sm:text-xs text-[#213d4f]/50">Securely connecting to bureaus</p>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-[#213d4f]/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#eefe92] via-[#a3e635] to-[#4d7c0f] rounded-full animate-[loading_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#213d4f]/40">
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    256-bit encryption
                  </div>
                </div>
              )}

              {step === 3 && band && (
                <div className="space-y-3 sm:space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-500">
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
                  <div className="flex gap-1.5 sm:gap-2">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="h-9 sm:h-11 px-3 sm:px-4 text-[10px] sm:text-xs font-medium border-2 border-[#213d4f]/10 text-[#213d4f]/70 rounded-lg sm:rounded-xl hover:bg-[#f8fafc] cursor-pointer"
                    >
                      ↻ Again
                    </Button>
                    <Button
                      className="h-9 sm:h-11 flex-1 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl cursor-pointer bg-[#213d4f] hover:bg-[#1a3240] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
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

      {/* Custom keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes loading {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
    </div>
  );
}
