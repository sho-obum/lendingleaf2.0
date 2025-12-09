"use client";

import React, { useEffect, useRef, useState } from "react";
import CreditScoreCard from "@/components/blocks/AccentCard";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Award,
  BarChart3,
  Lock,
  Eye,
} from "lucide-react";

export default function CreditScorePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredTip, setHoveredTip] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState({ checks: 0, accuracy: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate stats counter
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedStats({
        checks: Math.round(300000 * eased),
        accuracy: Math.round(99.9 * eased * 10) / 10,
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Auto-cycle through sections
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const tips = [
    {
      title: "Pay Bills on Time",
      description: "Payment history is the most important factor. Set up automatic payments to never miss a due date.",
      icon: Clock,
      color: "#22c55e",
      impact: "+35%",
    },
    {
      title: "Keep Credit Utilization Low",
      description: "Use less than 30% of your available credit. Lower is better - aim for under 10%.",
      icon: BarChart3,
      color: "#3b82f6",
      impact: "+30%",
    },
    {
      title: "Don't Close Old Accounts",
      description: "Length of credit history matters. Keep old cards active even if you don't use them often.",
      icon: Lock,
      color: "#a855f7",
      impact: "+15%",
    },
    {
      title: "Limit Hard Inquiries",
      description: "Too many credit applications in a short time can hurt your score. Apply only when necessary.",
      icon: Eye,
      color: "#f59e0b",
      impact: "+10%",
    },
    {
      title: "Monitor Your Credit Report",
      description: "Check for errors regularly. Dispute any inaccuracies you find with the credit bureau.",
      icon: Target,
      color: "#ef4444",
      impact: "+10%",
    },
  ];

  const scoreRanges = [
    { range: "300-579", label: "Poor", color: "red", gradient: "from-red-500 to-red-600", width: "25%" },
    { range: "580-669", label: "Fair", color: "amber", gradient: "from-amber-500 to-amber-600", width: "50%" },
    { range: "670-739", label: "Good", color: "lime", gradient: "from-lime-500 to-lime-600", width: "75%" },
    { range: "740-900", label: "Excellent", color: "emerald", gradient: "from-emerald-500 to-emerald-600", width: "100%" },
  ];

  return (
    <div className="overflow-hidden relative">
      {/* Unified Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-white from-0% via-[#f8fdf2] via-30% to-[#eefe92]/15 to-100% -z-10" />

      {/* Inject Custom Animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(77, 124, 15, 0.2); }
          50% { box-shadow: 0 0 40px rgba(77, 124, 15, 0.4); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
        .animate-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pt-20 pb-8 sm:pt-24 sm:pb-12 flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div
              className={`order-2 lg:order-1 space-y-6 sm:space-y-8 ${
                isVisible ? "animate-slide-up" : "opacity-0"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eefe92]/40 border border-[#4d7c0f]/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#4d7c0f] animate-pulse" />
                <span className="text-xs font-semibold text-[#4d7c0f] uppercase tracking-wider">
                  Free Credit Score Check
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-termina font-black text-[#213d4f] leading-[1.05] tracking-tight">
                  Know your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-[#4d7c0f] to-[#22c55e] bg-clip-text text-transparent">
                      score
                    </span>
                    <span className="absolute bottom-1 left-0 right-0 h-[0.3em] bg-[#eefe92] -z-0 -rotate-1 rounded-sm"></span>
                  </span>
                  <br />
                  <span className="text-[#213d4f]/80">unlock better</span>{" "}
                  <span className="relative">
                    <span className="text-[#4d7c0f]">₹</span>ates
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#213d4f]/60 max-w-xl leading-relaxed">
                  Check your credit score instantly for free. No hidden charges, no impact on your score.
                  <span className="text-[#4d7c0f] font-medium"> Get personalized loan offers</span> based on your creditworthiness.
                </p>
              </div>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
                {[
                  { value: `${(animatedStats.checks / 1000).toFixed(0)}K+`, label: "Scores Checked", icon: CheckCircle2 },
                  { value: `${animatedStats.accuracy}%`, label: "Accuracy", icon: Target },
                  { value: "Zero", label: "Score Impact", icon: Shield },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`relative group text-center p-3 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#213d4f]/5 hover:border-[#4d7c0f]/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isVisible ? "animate-scale-in" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                  >
                    <stat.icon className="w-5 h-5 text-[#4d7c0f] mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#4d7c0f]">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-[#213d4f]/50 mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { icon: Shield, text: "Bank-grade Security" },
                  { icon: Zap, text: "60-Second Results" },
                  { icon: Lock, text: "Data Protected" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-[#213d4f]/5 text-xs text-[#213d4f]/60"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-[#4d7c0f]" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Credit Score Card */}
            <div
              className={`order-1 lg:order-2 flex justify-center lg:justify-end ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative">
                {/* Glow Effect Behind Card */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4d7c0f]/20 to-[#eefe92]/30 blur-3xl scale-110 animate-pulse-glow" />
                <CreditScoreCard />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#eefe92]/30 to-[#4d7c0f]/10 rounded-full blur-3xl -z-10 animate-float-slow" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#4d7c0f]/10 to-[#22c55e]/10 rounded-full blur-3xl -z-10 animate-float-slow" style={{ animationDelay: "-3s" }} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#4d7c0f]/20 animate-float-slow"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>

        <GridPattern className="absolute inset-0 -z-10 opacity-30" />
      </section>

      {/* Why Credit Score Matters - Enhanced Visual Section */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eefe92]/30 border border-[#4d7c0f]/20 mb-6">
              <Award className="w-4 h-4 text-[#4d7c0f]" />
              <span className="text-xs font-semibold text-[#4d7c0f] uppercase tracking-wider">Why It Matters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-termina font-black text-[#213d4f] mb-6">
              Your Credit Score is Your
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#4d7c0f] to-[#22c55e] bg-clip-text text-transparent">
                  Financial Superpower
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2" stroke="#eefe92" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#213d4f]/60 max-w-2xl mx-auto">
              A good credit score isn't just a number — it's the key that unlocks better financial opportunities
            </p>
          </div>

          {/* Impact Cards - 3D Style */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                icon: TrendingUp,
                title: "Save ₹2-5 Lakhs",
                subtitle: "In Interest Payments",
                description: "A score of 750+ can get you 2-4% lower interest rates, saving lakhs over the loan tenure",
                gradient: "from-emerald-500 to-teal-600",
                stat: "Up to 4%",
                statLabel: "Lower Rates",
              },
              {
                icon: Zap,
                title: "24-Hour Approvals",
                subtitle: "Instant Decisions",
                description: "Good credit scores fast-track your application. Get approved in hours, not weeks",
                gradient: "from-blue-500 to-indigo-600",
                stat: "10x",
                statLabel: "Faster",
              },
              {
                icon: Target,
                title: "Higher Limits",
                subtitle: "Unlock More Credit",
                description: "Qualify for larger loan amounts and premium credit cards with excellent scores",
                gradient: "from-purple-500 to-pink-600",
                stat: "₹50L+",
                statLabel: "Max Loan",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group relative"
                style={{ perspective: "1000px" }}
              >
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#213d4f]/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <card.icon className="w-7 h-7 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 animate-shimmer" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#213d4f] mb-1">{card.title}</h3>
                  <p className="text-sm text-[#4d7c0f] font-semibold mb-3">{card.subtitle}</p>
                  <p className="text-sm text-[#213d4f]/60 mb-6 leading-relaxed">{card.description}</p>

                  {/* Stat */}
                  <div className="flex items-end gap-2 pt-4 border-t border-[#213d4f]/5">
                    <span className={`text-3xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                      {card.stat}
                    </span>
                    <span className="text-xs text-[#213d4f]/50 mb-1">{card.statLabel}</span>
                  </div>

                  {/* Decorative Corner */}
                  <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Score Range Visualizer */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-[#213d4f]/5 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#eefe92]/5 to-transparent" />
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#213d4f] mb-2 text-center">
                Understanding Credit Score Ranges
              </h3>
              <p className="text-sm text-[#213d4f]/50 text-center mb-10">
                Where do you stand? Check your score to find out.
              </p>

              {/* Visual Score Bar */}
              <div className="relative h-16 sm:h-20 rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-red-500 via-amber-500 via-lime-500 to-emerald-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Score Labels */}
                <div className="absolute inset-0 flex">
                  {scoreRanges.map((range, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-center text-white relative group cursor-pointer"
                      onMouseEnter={() => setActiveSection(i)}
                    >
                      <div className={`absolute inset-0 bg-white/10 opacity-0 ${activeSection === i ? 'opacity-100' : 'group-hover:opacity-50'} transition-opacity`} />
                      <span className="text-xs sm:text-sm font-bold relative z-10">{range.label}</span>
                      <span className="text-[10px] sm:text-xs opacity-80 relative z-10">{range.range}</span>
                    </div>
                  ))}
                </div>

                {/* Animated Indicator */}
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
                  style={{ left: `${25 + activeSection * 25}%` }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg animate-bounce-subtle" />
                </div>
              </div>

              {/* Score Details Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scoreRanges.map((range, i) => (
                  <div
                    key={i}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      activeSection === i
                        ? `border-${range.color}-400 bg-${range.color}-50/50 shadow-lg scale-105`
                        : "border-transparent bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={() => setActiveSection(i)}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${range.gradient} flex items-center justify-center mb-3`}>
                      <span className="text-white text-xs font-bold">{range.label.charAt(0)}</span>
                    </div>
                    <div className="text-lg font-bold text-[#213d4f] mb-1">{range.range}</div>
                    <div className={`text-sm font-semibold mb-2`} style={{ color: range.color === 'red' ? '#ef4444' : range.color === 'amber' ? '#f59e0b' : range.color === 'lime' ? '#84cc16' : '#22c55e' }}>{range.label}</div>
                    <p className="text-xs text-[#213d4f]/60 leading-relaxed">
                      {i === 0 && "Difficult to get approved. Focus on building credit history."}
                      {i === 1 && "Limited options with higher interest rates."}
                      {i === 2 && "Good rates available. Room for improvement."}
                      {i === 3 && "Best rates and terms. Premium card eligibility."}
                    </p>
                    
                    {activeSection === i && (
                      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${range.gradient} opacity-10 -z-10`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section - Interactive */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eefe92]/30 border border-[#4d7c0f]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#4d7c0f]" />
              <span className="text-xs font-semibold text-[#4d7c0f] uppercase tracking-wider">Pro Tips</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-termina font-black text-[#213d4f] mb-6">
              5 Ways to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#4d7c0f]">Boost</span>
                <span className="absolute bottom-1 left-0 right-0 h-[0.3em] bg-[#eefe92] -z-0 -rotate-1"></span>
              </span>{" "}
              Your Score
            </h2>
            <p className="text-base sm:text-lg text-[#213d4f]/60 max-w-2xl mx-auto">
              Take control of your financial future with these proven strategies
            </p>
          </div>

          {/* Tips Cards */}
          <div className="space-y-4 sm:space-y-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-[#213d4f]/5 overflow-hidden transition-all duration-500 ${
                  hoveredTip === index ? "shadow-2xl scale-[1.02]" : "shadow-lg hover:shadow-xl"
                }`}
                onMouseEnter={() => setHoveredTip(index)}
                onMouseLeave={() => setHoveredTip(null)}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  style={{ background: `linear-gradient(135deg, ${tip.color}, ${tip.color}50)` }}
                />

                <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Number & Icon */}
                  <div className="flex items-center gap-4">
                    <div
                      className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: `linear-gradient(135deg, ${tip.color}20, ${tip.color}10)` }}
                    >
                      <tip.icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: tip.color }} />
                      <div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-sm"
                        style={{ color: tip.color }}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#213d4f]">{tip.title}</h3>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: tip.color }}
                      >
                        {tip.impact} Impact
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-[#213d4f]/60 leading-relaxed">{tip.description}</p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#213d4f]/5 group-hover:bg-[#4d7c0f] transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-[#213d4f]/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-[#213d4f]/5">
                  <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                      width: hoveredTip === index ? "100%" : "0%",
                      background: `linear-gradient(90deg, ${tip.color}, ${tip.color}80)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="h-14 px-8 bg-[#4d7c0f] hover:bg-[#3d6310] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span>Check Your Score Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <span className="text-sm text-[#213d4f]/40">It's 100% free • No impact on score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </div>
  );
}
