import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const PARTICLES = [
  { top: "8%", left: "12%", size: "2px", delay: 0 },
  { top: "15%", left: "85%", size: "3px", delay: 0.5 },
  { top: "25%", left: "5%", size: "2px", delay: 1.2 },
  { top: "30%", left: "70%", size: "1px", delay: 0.3 },
  { top: "45%", left: "90%", size: "2px", delay: 0.8 },
  { top: "55%", left: "15%", size: "3px", delay: 1.5 },
  { top: "60%", left: "80%", size: "2px", delay: 0.2 },
  { top: "70%", left: "30%", size: "1px", delay: 1.0 },
  { top: "75%", left: "60%", size: "3px", delay: 0.7 },
  { top: "85%", left: "45%", size: "2px", delay: 1.3 },
  { top: "90%", left: "10%", size: "1px", delay: 0.4 },
  { top: "20%", left: "50%", size: "2px", delay: 0.9 },
  { top: "40%", left: "40%", size: "1px", delay: 1.1 },
  { top: "65%", left: "55%", size: "3px", delay: 0.6 },
  { top: "10%", left: "35%", size: "2px", delay: 1.4 },
];

const Hero = () => {
  useEffect(() => {
    gsap.fromTo(
      ".hero-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-title",
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(
      ".hero-description",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
      ".hero-stats",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.7 }
    );
    gsap.fromTo(
      ".hero-cta",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.9 }
    );
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden px-4">
      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl" />

      {/* Star particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-30 animate-pulse"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        {/* AI Badge */}
        <div className="hero-badge mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-blue-300 border border-blue-500/40 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            🤖 Powered by Gemini AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-title mb-6">
          <span className="block text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight">
            Plan Your Dream Trip
          </span>
          <span className="block text-4xl sm:text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
            with AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-description text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
          Tell RoamCraft where you want to go. Get a personalized itinerary,
          hotel picks, and day-by-day plans — in seconds.
        </p>

        {/* Stat pills */}
        <div className="hero-stats flex flex-wrap items-center justify-center gap-3 mb-10">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-200 border border-white/10">
            🌍 50+ Countries
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-200 border border-white/10">
            ⚡ Plans in seconds
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-200 border border-white/10">
            🏨 Hotel recommendations
          </span>
        </div>

        {/* CTA Button */}
        <div className="hero-cta">
          <Link to="/create-trip">
            <button className="px-10 py-4 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30">
              ✨ Start Planning for Free →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
