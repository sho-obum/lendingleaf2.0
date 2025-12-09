"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Gift,
  Percent,
  Plane,
  ShoppingBag,
  Fuel,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CreditCardData {
  id: number;
  name: string;
  bank: string;
  bankLogo: string;
  cardImage: string;
  offer: string;
  offerIcon: React.ElementType;
  offerColor: string;
  annualFee: string;
  joiningFee: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}

const creditCards: CreditCardData[] = [
  {
    id: 1,
    name: "HDFC Regalia",
    bank: "HDFC Bank",
    bankLogo: "/images/banks/hdfc.png",
    cardImage: "/images/cards/hdfc-regalia.png",
    offer: "5X Rewards",
    offerIcon: Gift,
    offerColor: "#8b5cf6",
    annualFee: "₹2,500",
    joiningFee: "₹2,500",
    features: [
      "Complimentary lounge access",
      "2% cashback on all spends",
      "Premium concierge service",
      "Zero forex markup",
    ],
    gradient: "from-[#1e3a5f] to-[#0d1b2a]",
    popular: true,
  },
  {
    id: 2,
    name: "Axis Flipkart",
    bank: "Axis Bank",
    bankLogo: "/images/banks/axis.png",
    cardImage: "/images/cards/axis-flipkart.png",
    offer: "5% Cashback",
    offerIcon: Percent,
    offerColor: "#f59e0b",
    annualFee: "₹500",
    joiningFee: "FREE",
    features: [
      "5% unlimited cashback on Flipkart",
      "4% on preferred partners",
      "1.5% on all other spends",
      "No minimum spend required",
    ],
    gradient: "from-[#047857] to-[#064e3b]",
  },
  {
    id: 3,
    name: "SBI SimplyCLICK",
    bank: "SBI Card",
    bankLogo: "/images/banks/sbi.png",
    cardImage: "/images/cards/sbi-simplyclick.png",
    offer: "10X Points",
    offerIcon: ShoppingBag,
    offerColor: "#3b82f6",
    annualFee: "₹499",
    joiningFee: "₹499",
    features: [
      "10X rewards on online shopping",
      "Amazon vouchers worth ₹2,000",
      "Fuel surcharge waiver",
      "1% on other purchases",
    ],
    gradient: "from-[#1e40af] to-[#1e3a8a]",
  },
  {
    id: 4,
    name: "ICICI Amazon Pay",
    bank: "ICICI Bank",
    bankLogo: "/images/banks/icici.png",
    cardImage: "/images/cards/icici-amazon.png",
    offer: "5% Amazon",
    offerIcon: ShoppingBag,
    offerColor: "#f97316",
    annualFee: "FREE",
    joiningFee: "FREE",
    features: [
      "5% back for Prime members",
      "3% on Amazon non-Prime",
      "2% on bill payments",
      "1% on all other spends",
    ],
    gradient: "from-[#0f172a] to-[#1e293b]",
    popular: true,
  },
  {
    id: 5,
    name: "Indusind Jet Airways",
    bank: "IndusInd Bank",
    bankLogo: "/images/banks/indusind.png",
    cardImage: "/images/cards/indusind-jet.png",
    offer: "Free Flights",
    offerIcon: Plane,
    offerColor: "#06b6d4",
    annualFee: "₹3,000",
    joiningFee: "₹1,500",
    features: [
      "1 free domestic flight/year",
      "3 JP Miles per ₹100 spent",
      "Airport lounge access",
      "Travel insurance cover",
    ],
    gradient: "from-[#831843] to-[#500724]",
  },
  {
    id: 6,
    name: "BPCL SBI Card",
    bank: "SBI Card",
    bankLogo: "/images/banks/sbi.png",
    cardImage: "/images/cards/bpcl-sbi.png",
    offer: "13x Fuel",
    offerIcon: Fuel,
    offerColor: "#ef4444",
    annualFee: "₹499",
    joiningFee: "₹499",
    features: [
      "13X rewards on BPCL fuel",
      "Fuel surcharge waiver",
      "5X on groceries & movies",
      "1% on all other purchases",
    ],
    gradient: "from-[#dc2626] to-[#991b1b]",
  },
];

export default function CreditCards() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(3);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update cards to show based on screen size
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = creditCards.length - cardsToShow;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, cardsToShow]);

  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? creditCards.length - cardsToShow : prev - 1));
  }, [cardsToShow]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = creditCards.length - cardsToShow;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [cardsToShow]);

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section
      id="credit-cards"
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32 -mt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#eefe92]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#22c55e]/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40 pb-12">
        <GridPattern
          width={50}
          height={50}
          x={0}
          y={0}
          squares={[
            [2, 1], [4, 3], [6, 2], [8, 4], [10, 1],
            [3, 5], [5, 7], [7, 3], [9, 6], [11, 4],
          ]}
          className="fill-[#4d7c0f]/8 stroke-[#4d7c0f]/15"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div
          className={`text-center mb-10 sm:mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#4d7c0f]/20 rounded-full shadow-sm mb-4 sm:mb-6">
            <CreditCard className="w-3.5 h-3.5 text-[#4d7c0f]" />
            <span className="text-xs font-medium text-[#213d4f]">Premium Credit Cards</span>
          </div>

          {/* Headline */}
          <h2 className="font-termina text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#213d4f] leading-tight">
            Find your perfect{" "}
            <span className="relative inline-block">
              <span className="relative z-10">credit card</span>
              <span className="absolute bottom-1 left-0 w-full h-2 sm:h-3 bg-[#eefe92] -z-0 rounded"></span>
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#213d4f]/60 max-w-xl mx-auto">
            Compare top credit cards with exclusive rewards, cashback, and benefits tailored for you.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className={`relative transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#4d7c0f]/10 flex items-center justify-center text-[#213d4f] hover:bg-[#eefe92] hover:text-[#213d4f] transition-all duration-300 hover:scale-110"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-[#4d7c0f]/10 flex items-center justify-center text-[#213d4f] hover:bg-[#eefe92] hover:text-[#213d4f] transition-all duration-300 hover:scale-110"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Cards Carousel */}
          <div className="overflow-hidden mx-6 sm:mx-8 lg:mx-10" ref={carouselRef}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {creditCards.map((card, index) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / cardsToShow}%` }}
                >
                  <div
                    className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-[#213d4f]/8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${
                      card.popular ? "ring-2 ring-[#4d7c0f]/30" : ""
                    }`}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                  >
                    {/* Popular Badge */}
                    {card.popular && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#4d7c0f] text-white text-[10px] sm:text-xs font-semibold rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Popular
                        </div>
                      </div>
                    )}

                    {/* Card Image Section */}
                    <div className={`relative h-36 sm:h-44 md:h-48 bg-gradient-to-br ${card.gradient} p-4 sm:p-6 overflow-hidden`}>
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                      
                      {/* Card Image Placeholder - Replace with actual images */}
                      <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="w-48 sm:w-56 md:w-64 h-28 sm:h-32 md:h-36 bg-gradient-to-br from-white/20 to-white/5 rounded-xl border border-white/20 shadow-2xl transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 flex items-center justify-center">
                          <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-white/60" />
                        </div>
                      </div>

                      {/* Offer Badge */}
                      <div
                        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full shadow-lg"
                        style={{ color: card.offerColor }}
                      >
                        <card.offerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-bold">{card.offer}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 md:p-6">
                      {/* Bank & Card Name */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-[10px] sm:text-xs text-[#213d4f]/50 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">
                          {card.bank}
                        </p>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#213d4f]">
                          {card.name}
                        </h3>
                      </div>

                      {/* Fee Info */}
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-[#213d4f]/50">Joining:</span>{" "}
                          <span className={`font-semibold ${card.joiningFee === "FREE" ? "text-[#22c55e]" : "text-[#213d4f]"}`}>
                            {card.joiningFee}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-[#213d4f]/10" />
                        <div>
                          <span className="text-[#213d4f]/50">Annual:</span>{" "}
                          <span className={`font-semibold ${card.annualFee === "FREE" ? "text-[#22c55e]" : "text-[#213d4f]"}`}>
                            {card.annualFee}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                        {card.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#213d4f]/70">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4d7c0f] flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Apply Button */}
                      <Button className="w-full h-10 sm:h-11 bg-[#213d4f] hover:bg-[#1a3240] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 group/btn">
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: creditCards.length - cardsToShow + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-[#4d7c0f]"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#213d4f]/20 hover:bg-[#213d4f]/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`mt-10 sm:mt-12 lg:mt-16 text-center transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm sm:text-base text-[#213d4f]/60 mb-4">
            Not sure which card is right for you?
          </p>
          <Button
            variant="outline"
            className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold border-2 border-[#4d7c0f] text-[#4d7c0f] hover:bg-[#4d7c0f] hover:text-white rounded-xl transition-all duration-300"
          >
            Compare All Cards
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
