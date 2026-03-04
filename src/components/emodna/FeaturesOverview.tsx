import { FEATURE_CARDS } from "./data";
import { use3DScroll } from "@/hooks/use3DScroll";
import {
  useState, useEffect, useCallback, useRef, ReactNode,
  MouseEvent as ME,
} from "react";
import {
  motion, AnimatePresence, useSpring, useMotionValue, useTransform,
} from "framer-motion";

/* ─── Color map ─────────────────────────────────────────────────── */
const colorMap = {
  sky: { glow: "rgba(74,175,218,0.28)", bar: "hsl(197,63%,57%)", dot: "hsl(197,63%,57%)", pill: "hsl(197,63%,52%)", bg: "hsla(197,63%,57%,.07)" },
  peach: { glow: "rgba(244,165,122,0.28)", bar: "hsl(20,85%,72%)", dot: "hsl(20,85%,72%)", pill: "hsl(20,75%,58%)", bg: "hsla(20,85%,72%,.07)" },
  mint: { glow: "rgba(110,203,168,0.28)", bar: "hsl(155,50%,61%)", dot: "hsl(155,50%,61%)", pill: "hsl(155,48%,46%)", bg: "hsla(155,50%,61%,.07)" },
  lavender: { glow: "rgba(184,164,224,0.28)", bar: "hsl(262,45%,76%)", dot: "hsl(262,45%,76%)", pill: "hsl(262,45%,60%)", bg: "hsla(262,45%,76%,.07)" },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Single Carousel Card ──────────────────────────────────────── */
interface CardProps {
  card: typeof FEATURE_CARDS[0] & { icon: ReactNode };
  offset: number;        /* -2…2, 0 = center */
  isHovered: boolean;    /* this card is the hovered one */
  anyHovered: boolean;   /* any card in carousel is hovered */
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function CarouselCard({ card, offset, isHovered, anyHovered, onClick, onHoverStart, onHoverEnd }: CardProps) {
  const c = colorMap[card.color];
  const abs = Math.abs(offset);
  const isCenter = offset === 0;

  /* ── Cursor-tracking tilt (only when this card is hovered + centered) */
  const rotX = useSpring(0, { stiffness: 260, damping: 32, mass: 0.8 });
  const rotY = useSpring(0, { stiffness: 260, damping: 32, mass: 0.8 });
  const gX = useMotionValue(50), gY = useMotionValue(50);
  const cursorGlow = useTransform(
    [gX, gY],
    ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, ${c.glow.replace("0.28", "0.18")} 0%, transparent 65%)`
  );

  const onMove = (e: ME<HTMLDivElement>) => {
    if (!isHovered && !isCenter) return;
    const r = e.currentTarget.getBoundingClientRect();
    rotX.set(-(((e.clientY - r.top) / r.height) - 0.5) * 8);
    rotY.set((((e.clientX - r.left) / r.width) - 0.5) * 8);
    gX.set(((e.clientX - r.left) / r.width) * 100);
    gY.set(((e.clientY - r.top) / r.height) * 100);
  };
  const onLeaveCard = () => { rotX.set(0); rotY.set(0); gX.set(50); gY.set(50); };

  /* ── Computed positional values ───────────────────────────── */
  const baseX = isHovered ? 0 : offset * 310;
  const baseZ = isHovered ? 120 : isCenter ? 20 : anyHovered ? -(abs > 1 ? 160 : 90) : (abs === 0 ? 20 : abs === 1 ? -40 : -100);
  const baseS = isHovered ? 1.18 : isCenter ? 1 : abs === 1 ? 0.82 : 0.66;
  const baseOp = isHovered ? 1 : isCenter ? 1 : anyHovered ? (abs === 1 ? 0.35 : 0.15) : abs === 1 ? 0.55 : 0.25;
  const baseBlur = isHovered ? 0 : isCenter ? 0 : anyHovered ? (abs === 1 ? 5 : 9) : abs === 1 ? 2.5 : 5;
  const baseRotY = isHovered ? 0 : isCenter ? 0 : offset > 0 ? Math.min(16, abs * 12) : -Math.min(16, abs * 12);
  const zIdx = isHovered ? 30 : isCenter ? 15 : 10 - abs * 3;

  if (abs > 2) return null;

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={onHoverStart}
      onMouseLeave={() => { onHoverEnd(); onLeaveCard(); }}
      className="absolute select-none"
      style={{
        width: 320, top: "50%", marginTop: -170,
        zIndex: zIdx,
        cursor: isCenter || isHovered ? "default" : "pointer",
        rotateX: isHovered ? rotX : 0,
        rotateY: isHovered ? rotY : baseRotY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        x: baseX,
        z: baseZ,
        scale: baseS,
        opacity: baseOp,
        filter: `blur(${baseBlur}px)`,
        rotateY: isHovered ? 0 : baseRotY,
      }}
      transition={{ duration: 0.65, ease: EASE, rotateY: { duration: 0.55, ease: EASE } }}
    >
      {/* Glow ring behind hovered card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-[-24px] rounded-[36px] pointer-events-none -z-10"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ background: c.glow, filter: "blur(32px)" }}
          />
        )}
      </AnimatePresence>

      {/* Card body */}
      <motion.div
        className="relative overflow-hidden rounded-[24px]"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid ${isHovered || isCenter ? c.bar + "88" : "rgba(0,0,0,0.07)"}`,
          boxShadow: isHovered
            ? `0 32px 80px ${c.glow}, 0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,.9)`
            : isCenter
              ? `0 12px 42px ${c.glow}, 0 2px 12px rgba(0,0,0,0.06)`
              : "0 4px 16px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Cursor glow overlay */}
        <motion.div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{ background: cursorGlow }} />

        {/* Light sweep on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-[24px] pointer-events-none"
              initial={{ x: "-120%" }}
              animate={{ x: "240%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ background: "linear-gradient(105deg, transparent 36%, rgba(255,255,255,.55) 50%, transparent 64%)", width: "100%" }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-7">
          {/* Icon */}
          <motion.div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.6rem] mb-5"
            style={{ background: c.bg, border: `1px solid ${c.bar}44` }}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {card.icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-[1.15rem] font-bold mb-2.5" style={{ color: "hsl(218,35%,18%)" }}>
            {card.title}
          </h3>

          {/* Desc */}
          <p className="text-[0.88rem] leading-[1.7] mb-4" style={{ color: "hsl(215,18%,52%)" }}>
            {card.desc}
          </p>

          {/* Bullet items — staggered reveal on hover */}
          <ul className="flex flex-col gap-1.5">
            {card.items.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-center gap-2 text-[0.82rem] font-semibold"
                style={{ color: "hsl(215,20%,38%)" }}
                initial={{ opacity: isHovered ? 0 : 1, x: isHovered ? -12 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: isHovered ? 0.18 + i * 0.08 : 0, ease: EASE }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: c.dot }}
                  animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
                  transition={{ duration: 0.4, delay: 0.18 + i * 0.08 }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom color bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-[24px]"
          animate={{ height: isHovered || isCenter ? 3 : 1.5, opacity: isHovered ? 1 : isCenter ? 0.8 : 0.3 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ background: `linear-gradient(90deg, ${c.bar}, ${c.bar}88)` }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function FeaturesOverview() {
  const [active, setActive] = useState(0);
  const [hoveredIdx, setHov] = useState<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = FEATURE_CARDS.length;

  const headerRef = use3DScroll<HTMLDivElement>({ variant: "flip-up", threshold: 0.1 });
  const carouselRef = use3DScroll<HTMLDivElement>({ variant: "zoom-depth", delay: 150, threshold: 0.08 });
  const dotsRef = use3DScroll<HTMLDivElement>({ variant: "rise", delay: 300, threshold: 0.08 });

  /* ── Auto-play (pauses while hovering) ────────────── */
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (hoveredIdx !== null) return;          // pause on hover
      setActive(prev => (prev + 1) % total);
    }, 3500);
  }, [total, hoveredIdx]);

  useEffect(() => { startAuto(); return () => { if (autoRef.current) clearInterval(autoRef.current); }; }, [startAuto]);

  const goTo = (idx: number) => { setActive((idx + total) % total); startAuto(); };

  /* ── Card offset helper ────────────────────────────── */
  const getOffset = (idx: number) => {
    let off = idx - active;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  };

  const activeCard = FEATURE_CARDS[active];
  const c = colorMap[activeCard.color];

  return (
    <section id="features" className="py-[90px] px-[5%] bg-soft-white relative overflow-hidden">

      {/* Header */}
      <div ref={headerRef} className="text-center mb-16">
        <span className="section-tag section-tag-sky">Everything You Need</span>
        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] text-dark leading-[1.2] mb-4">
          A Complete Emotional Wellness Ecosystem
        </h2>
        <p className="text-base text-soft leading-[1.8] max-w-[550px] mx-auto">
          Not just another mood tracker — an end-to-end emotional intelligence platform.
        </p>
        <p className="text-sm text-soft/70 leading-[1.8] max-w-[520px] mx-auto mt-3 italic">
          Some features are currently in development and will be introduced gradually during early access.
        </p>
      </div>

      {/* Vignette when hover-focused */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              background: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 20%, rgba(240,235,230,0.6) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── 3D Carousel ─────────────────────────────────── */}
      <div
        ref={carouselRef}
        className="relative flex items-center justify-center"
        style={{ minHeight: 380, perspective: 1400, transformStyle: "preserve-3d" }}
      >
        {/* Left arrow */}
        <button
          onClick={() => goTo(active - 1)}
          className="absolute left-0 z-30 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        {/* Cards */}
        <div className="relative flex items-center justify-center w-full" style={{ height: 380, transformStyle: "preserve-3d" }}>
          {FEATURE_CARDS.map((card, idx) => {
            const off = getOffset(idx);
            if (Math.abs(off) > 2) return null;
            return (
              <CarouselCard
                key={card.title}
                card={card}
                offset={off}
                isHovered={hoveredIdx === idx}
                anyHovered={hoveredIdx !== null}
                onClick={() => { if (off !== 0) goTo(idx); }}
                onHoverStart={() => setHov(idx)}
                onHoverEnd={() => setHov(null)}
              />
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => goTo(active + 1)}
          className="absolute right-0 z-30 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div ref={dotsRef} className="flex items-center justify-center gap-2 mt-8">
        {FEATURE_CARDS.map((f, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full"
            style={{
              width: i === active ? 28 : 8, height: 8,
              background: i === active ? colorMap[f.color].bar : "#D1D5DB",
              opacity: i === active ? 1 : 0.5,
              transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
