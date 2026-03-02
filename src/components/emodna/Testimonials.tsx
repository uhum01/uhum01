import { useState, useEffect, useCallback, useRef } from "react";
import { TESTIMONIALS } from "./data";
import FloatingElements from "./FloatingElements";
import { use3DScroll } from "@/hooks/use3DScroll";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = TESTIMONIALS.length;

  const headerRef = use3DScroll<HTMLDivElement>({ variant: "flip-up", threshold: 0.1 });
  const carouselRef = use3DScroll<HTMLDivElement>({ variant: "zoom-depth", delay: 150, threshold: 0.08 });

  const goTo = useCallback(
    (idx: number, dir: 1 | -1) => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive((idx + total) % total);
        setAnimating(false);
      }, 600);
    },
    [animating, total]
  );

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setDirection(1);
      setAnimating(true);
      setTimeout(() => {
        setActive(prev => (prev + 1) % total);
        setAnimating(false);
      }, 600);
    }, 4000);
  }, [total]);

  useEffect(() => {
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [resetAuto]);

  const handleNav = (dir: 1 | -1) => {
    goTo(active + dir, dir);
    resetAuto();
  };

  const handleDot = (i: number) => {
    goTo(i, i > active ? 1 : -1);
    resetAuto();
  };

  const t = TESTIMONIALS[active];

  return (
    <section className="py-[90px] px-[5%] gradient-testimonials relative overflow-hidden">
      <FloatingElements variant="peach" />

      {/* Header */}
      <div ref={headerRef} className="text-center mb-14">
        <span className="section-tag section-tag-peach">Real People, Real Growth</span>
        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] text-dark leading-[1.2] mb-4">
          What Our Users Say
        </h2>
        <p className="text-base text-soft leading-[1.8] max-w-[550px] mx-auto">
          Real people, real emotional breakthroughs — powered by UHUM.
        </p>
      </div>

      {/* Carousel */}
      <div ref={carouselRef} className="relative flex items-center justify-center" style={{ minHeight: 260 }}>

        {/* Left Arrow */}
        <button
          onClick={() => handleNav(-1)}
          className="absolute left-0 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Previous testimonial"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        {/* Card */}
        <div
          className="relative bg-card rounded-[20px] border-[1.5px] border-peach-mid shadow-peach overflow-hidden"
          style={{
            width: "min(480px, 88vw)",
            padding: "36px 36px 28px",
            transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction * 36}px) scale(0.96)`
              : "translateX(0) scale(1)",
          }}
        >
          {/* Large quote mark */}
          <div
            className="absolute top-4 right-5 font-display text-[5rem] leading-none select-none pointer-events-none"
            style={{ color: "hsl(20,85%,72%)", opacity: 0.18, lineHeight: 1 }}
          >
            "
          </div>

          {/* Stars */}
          <div className="text-[1rem] mb-4 tracking-wide" style={{ color: "hsl(38,90%,60%)" }}>
            {"★".repeat(t.stars)}
          </div>

          {/* Quote */}
          <p className="text-[0.95rem] text-mid leading-[1.85] mb-6 italic">
            "{t.text}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-[1.1rem] flex-shrink-0">
              {t.emoji}
            </div>
            <div>
              <div className="text-[0.9rem] font-bold text-dark">{t.name}</div>
              <div className="text-[0.78rem] text-soft">{t.role}</div>
            </div>
          </div>

          {/* Bottom progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3.5px]"
            style={{
              background: "linear-gradient(90deg, hsl(20,85%,72%), hsl(197,63%,57%))",
              opacity: 0.75,
            }}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleNav(1)}
          className="absolute right-0 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Next testimonial"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className="rounded-full"
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              background:
                i === active
                  ? "linear-gradient(90deg, hsl(20,85%,72%), hsl(197,63%,57%))"
                  : "hsl(0,0%,82%)",
              opacity: i === active ? 1 : 0.55,
              transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
