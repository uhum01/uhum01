import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ─── Easing ─────────────────────────────────────────────────────── */
// Premium "overshoot settle" used by Apple / Linear
const SILK = [0.22, 1, 0.36, 1] as const;
// Slower, more meditative ease
const CALM = [0.16, 1, 0.3, 1] as const;

/* ─── Icon orbit data ─────────────────────────────────────────────── */
const ICONS = [
    { e: "🧬", a: 0 },
    { e: "📊", a: 40 },
    { e: "🎯", a: 80 },
    { e: "🤖", a: 120 },
    { e: "🎙️", a: 160 },
    { e: "😴", a: 200 },
    { e: "👨‍⚕️", a: 240 },
    { e: "🎓", a: 280 },
    { e: "⚡", a: 320 },
];

/* ─── Static ambient particles (frozen on mount) ─────────────────── */
const PARTICLES = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.6 + 0.3,
    dur: Math.random() * 10 + 6,
    delay: Math.random() * 8,
    op: Math.random() * 0.28 + 0.06,
}));

/* ─── Meditation figure SVG path ─────────────────────────────────── */
// Single continuous stroke: head oval → body arc → lotus legs
const FIGURE_D = [
    // Head oval — center x=100, y=48
    "M 100 26",
    "C 117 26 127 36 127 48",
    "C 127 62 117 70 100 70",
    "C 83 70 73 62 73 48",
    "C 73 36 83 26 100 26",
    // Left shoulder / arm sweep → meets body center
    "M 100 70",
    "C 76 75 54 92 50 118",
    "C 46 142 60 157 80 158",
    "C 93 159 100 149 100 140",
    // Right shoulder / arm sweep (mirror)
    "M 100 70",
    "C 124 75 146 92 150 118",
    "C 154 142 140 157 120 158",
    "C 107 159 100 149 100 140",
    // Left lotus leg
    "M 100 158",
    "C 80 164 48 176 40 206",
    "C 30 238 50 256 77 257",
    "C 94 258 103 244 100 232",
    // Right lotus leg
    "M 100 158",
    "C 120 164 152 176 160 206",
    "C 170 238 150 256 123 257",
    "C 106 258 97 244 100 232",
].join(" ");

/* ─── Component ──────────────────────────────────────────────────── */
export default function UhumIntro({ onComplete }: { onComplete: () => void }) {
    /*
      Phases:
      0 = black/loading
      1 = figure draws
      2 = figure breathes + color glow
      3 = figure fades + line rises (OVERLAP: both visible)
      4 = icons float up (line stays)
      5 = UHUM logo reveals (icons stay)
      6 = gentle exit — line/icons/logo all dissolve slowly
      7 = background lightens → done
    */
    const [phase, setPhase] = useState(0);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Viewport-sized icon radius
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const iconRx = Math.min(vw * 0.36, 380);
    const iconRy = Math.min(vh * 0.275, 195);

    const skip = useCallback(() => {
        timerRefs.current.forEach(clearTimeout);
        setPhase(6);
        const t = setTimeout(onComplete, 2200);
        timerRefs.current = [t];
    }, [onComplete]);

    useEffect(() => {
        const ts = [
            setTimeout(() => setPhase(1), 180),     // Figure begins drawing
            setTimeout(() => setPhase(2), 3800),     // Color glow begins (slower)
            setTimeout(() => setPhase(3), 8000),     // Line rises — figure starts fade
            setTimeout(() => setPhase(4), 10200),    // Icons orbit up
            setTimeout(() => setPhase(5), 13000),    // UHUM materialises
            setTimeout(() => setPhase(6), 16500),    // Gentle exit begins
            // Fire right as phase 6 starts so the website appears while the logo is still fading
            setTimeout(onComplete, 16800),
        ];
        timerRefs.current = ts;
        return () => ts.forEach(clearTimeout);
    }, [onComplete]);

    // Figure visible from phase 1 → fades out during phase 3
    const figureVisible = phase >= 1 && phase <= 3;
    // Line visible phases 3-5 → fades out as exit begins at phase 6
    const lineVisible = phase >= 3 && phase < 6;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, perspective: "1400px", overflow: "hidden" }}>

            {/* ── Background: dark → website light ── */}
            <motion.div
                style={{ position: "absolute", inset: 0 }}
                animate={{
                    background: phase >= 6
                        ? "radial-gradient(ellipse 130% 90% at 50% 0%, #e0f0fa 0%, #f0f5f9 55%, #fdf4ef 100%)"
                        : "radial-gradient(ellipse 90% 65% at 50% 35%, #030d1a 0%, #010508 100%)",
                }}
                transition={{ duration: 4.5, ease: CALM }}
            />

            {/* ── Ambient star particles (only during dark phases) ── */}
            <motion.div
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                transition={{ duration: 3.8, ease: CALM }}
            >
                {PARTICLES.map(p => (
                    <motion.div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`, top: `${p.y}%`,
                            width: p.size, height: p.size,
                            borderRadius: "50%", background: "white",
                        }}
                        animate={{ opacity: [0, p.op, p.op * 0.3, p.op, 0], y: [0, -14, 0] }}
                        transition={{
                            opacity: { duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
                            y: { duration: p.dur * 1.5, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
                        }}
                    />
                ))}
            </motion.div>

            {/* ── Ambient colour orbs ── */}
            <motion.div
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                transition={{ duration: 3.8, ease: CALM }}
            >
                {[
                    { color: "rgba(74,175,218,0.09)", lx: "14%", ty: "18%", w: 420, h: 420, dur: 13 },
                    { color: "rgba(244,165,122,0.065)", lx: "76%", ty: "66%", w: 330, h: 330, dur: 16 },
                    { color: "rgba(79,163,165,0.075)", lx: "79%", ty: "14%", w: 290, h: 290, dur: 12 },
                    { color: "rgba(184,164,224,0.055)", lx: "9%", ty: "74%", w: 260, h: 260, dur: 15 },
                ].map((orb, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            left: orb.lx, top: orb.ty,
                            width: orb.w, height: orb.h,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${orb.color}, transparent 72%)`,
                            filter: "blur(45px)",
                            translateX: "-50%", translateY: "-50%",
                        }}
                        animate={{
                            scale: [0.88, 1.14, 0.88],
                            x: [0, 18, -12, 18, 0],
                            y: [0, -12, 8, -12, 0],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            scale: { duration: orb.dur * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 1.6 },
                            x: { duration: orb.dur * 1.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 },
                            y: { duration: orb.dur * 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 },
                            opacity: { duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.6 },
                        }}
                    />
                ))}
            </motion.div>

            {/* ══════════════════════════════════════════
          PHASE 1–3 · Meditation Figure
          Fades OUT slowly during phase 3 (overlapping with line)
      ══════════════════════════════════════════ */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    translateX: "-50%", translateY: "-52%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    pointerEvents: "none",
                }}
                animate={{
                    opacity: figureVisible ? 1 : 0,
                    scale: phase === 0 ? 0.88 : phase >= 3 ? 0.92 : 1,
                    filter: phase >= 3 ? "blur(18px)" : "blur(0px)",
                }}
                transition={{
                    opacity: { duration: phase >= 3 ? 3.2 : 1.2, ease: CALM },
                    scale: { duration: phase >= 3 ? 3.2 : 1.4, ease: CALM },
                    filter: { duration: phase >= 3 ? 3.5 : 0.9, ease: CALM },
                }}
            >
                {/* Colour energy glow bloom — fades in at phase 2 */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: 420, height: 520,
                        borderRadius: "50%",
                        background: "radial-gradient(ellipse, rgba(74,175,218,0.24) 0%, rgba(244,165,122,0.11) 42%, rgba(79,163,165,0.07) 62%, transparent 80%)",
                        filter: "blur(60px)",
                        pointerEvents: "none",
                    }}
                    animate={{
                        opacity: phase >= 2 ? [0.7, 1, 0.7] : 0,
                        scale: phase >= 2 ? [0.95, 1.08, 0.95] : 0.5,
                    }}
                    transition={{
                        opacity: { duration: 1.8, delay: phase >= 2 ? 0 : 0, ease: "easeInOut" },
                        scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                />

                {/* SVG drawing */}
                <motion.svg
                    viewBox="0 0 200 285"
                    width={260} height={371}
                    style={{ overflow: "visible" }}
                    animate={phase >= 2 ? { scale: [1, 1.018, 1, 1.018, 1] } : { scale: 1 }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <defs>
                        <filter id="fgInk" x="-55%" y="-55%" width="210%" height="210%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="fgEnergy" x="-65%" y="-65%" width="230%" height="230%">
                            <feGaussianBlur stdDeviation="5.5" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        {/* Animated colour gradient — activated at phase 2 */}
                        <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%">
                                <animate attributeName="stop-color"
                                    values="#ffffff;#4AAFDA;#7EC8E3;#4FA3A5;#F4A57A;#ffffff"
                                    dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="40%">
                                <animate attributeName="stop-color"
                                    values="#F4A57A;#ffffff;#4AAFDA;#7EC8E3;#ffffff;#F4A57A"
                                    dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="75%">
                                <animate attributeName="stop-color"
                                    values="#4AAFDA;#4FA3A5;#ffffff;#F4A57A;#4AAFDA;#4AAFDA"
                                    dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%">
                                <animate attributeName="stop-color"
                                    values="#7EC8E3;#F4A57A;#4AAFDA;#ffffff;#7EC8E3;#7EC8E3"
                                    dur="4s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                    </defs>

                    {/* Draw animation via pathLength 0 → 1 */}
                    <motion.path
                        d={FIGURE_D}
                        fill="none"
                        stroke={phase >= 2 ? "url(#energyFlow)" : "rgba(255,255,255,0.92)"}
                        strokeWidth={phase >= 2 ? 2.5 : 2.0}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={phase >= 2 ? "url(#fgEnergy)" : "url(#fgInk)"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            pathLength: { duration: 2.6, ease: [0.37, 0, 0.63, 1] },
                            opacity: { duration: 0.6, ease: "easeOut" },
                        }}
                    />
                </motion.svg>
            </motion.div>

            {/* ══════════════════════════════════════════
          PHASE 3–6 · Horizontal Glowing Line
          Rises gently while figure still fading
      ══════════════════════════════════════════ */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    translateX: "-50%", translateY: "-50%",
                    pointerEvents: "none",
                }}
                animate={{
                    opacity: lineVisible ? 1 : 0,
                    y: phase === 3 ? 12 : 0,   // rises up 12px as it appears
                }}
                transition={{
                    opacity: { duration: phase >= 6 ? 4.0 : 2.0, ease: CALM },
                    y: { duration: 2.8, ease: SILK },
                }}
            >
                {/* Fat outer halo */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: "60vw", height: 18,
                        translateX: "-50%", translateY: "-50%",
                        borderRadius: 10,
                        background: "linear-gradient(90deg, transparent, rgba(74,175,218,0.22) 22%, rgba(126,200,227,0.30) 50%, rgba(79,163,165,0.22) 78%, transparent)",
                        filter: "blur(12px)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: lineVisible ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: SILK }}
                />
                {/* Mid glow */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: "60vw", height: 5,
                        translateX: "-50%", translateY: "-50%",
                        borderRadius: 4,
                        background: "linear-gradient(90deg, transparent, rgba(74,175,218,0.55) 25%, #7EC8E3 50%, rgba(79,163,165,0.55) 75%, transparent)",
                        filter: "blur(3.5px)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: lineVisible ? 1 : 0 }}
                    transition={{ duration: 1.8, delay: 0.06, ease: SILK }}
                />
                {/* Bright core */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: "60vw", height: 1.8,
                        translateX: "-50%", translateY: "-50%",
                        borderRadius: 1,
                        background: "linear-gradient(90deg, transparent, #4AAFDA 22%, #C5E9F6 50%, #4FA3A5 78%, transparent)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{
                        scaleX: lineVisible ? 1 : 0,
                        boxShadow: [
                            "0 0 12px 2px rgba(74,175,218,0.38)",
                            "0 0 24px 4px rgba(74,175,218,0.6)",
                            "0 0 12px 2px rgba(74,175,218,0.38)",
                        ],
                    }}
                    transition={{
                        scaleX: { duration: 1.7, ease: SILK },
                        boxShadow: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
                    }}
                />
            </motion.div>

            {/* ══════════════════════════════════════════
          PHASE 4–6 · Floating Icon Orbit
      ══════════════════════════════════════════ */}
            {ICONS.map((item, i) => {
                const rad = ((item.a - 90) * Math.PI) / 180;
                const tx = Math.cos(rad) * iconRx;
                const ty = Math.sin(rad) * iconRy;

                const iconsIn = phase >= 4;
                const iconsOut = phase >= 6;

                return (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            top: "50%", left: "50%",
                            width: 54, height: 54,
                            marginLeft: -27, marginTop: -27,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.32rem",
                            borderRadius: 13,
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(74,175,218,0.22)",
                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",
                            boxShadow: "0 8px 32px rgba(74,175,218,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
                            willChange: "transform, opacity",
                        }}
                        animate={{
                            x: iconsIn ? tx : 0,
                            y: iconsIn ? (iconsOut ? ty - 60 : ty) : 40,
                            opacity: iconsIn ? (iconsOut ? 0 : 0.88) : 0,
                            scale: iconsIn ? (iconsOut ? 0.4 : 1) : 0.5,
                            rotateY: iconsIn ? 0 : 22,
                            filter: iconsOut ? "blur(6px)" : "blur(0px)",
                        }}
                        transition={{
                            duration: iconsOut ? 2.8 : 2.0,
                            delay: iconsOut ? i * 0.08 : i * 0.12,
                            ease: SILK,
                        }}
                    >
                        <motion.span
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3.0 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        >
                            {item.e}
                        </motion.span>
                        {/* Glass sheen */}
                        <div style={{
                            position: "absolute", inset: 0, borderRadius: 13,
                            background: "radial-gradient(circle at 38% 32%, rgba(74,175,218,0.14), transparent 62%)",
                            pointerEvents: "none",
                        }} />
                    </motion.div>
                );
            })}

            {/* ══════════════════════════════════════════
          PHASE 5–6 · UHUM Logo
      ══════════════════════════════════════════ */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    translateX: "-50%", translateY: "-50%",
                    textAlign: "center",
                    pointerEvents: "none",
                }}
                animate={{
                    opacity: phase >= 5 ? (phase >= 6 ? 0 : 1) : 0,
                    scale: phase >= 5 ? (phase >= 6 ? 0.18 : 1) : 0.6,
                    filter: phase >= 5 ? (phase >= 6 ? "blur(24px)" : "blur(0px)") : "blur(32px)",
                    y: phase >= 6 ? -140 : 0,
                }}
                transition={{
                    opacity: { duration: phase >= 6 ? 3.5 : 2.0, ease: CALM },
                    scale: { duration: phase >= 6 ? 3.2 : 1.8, ease: SILK },
                    filter: { duration: phase >= 6 ? 3.2 : 1.8, ease: CALM },
                    y: { duration: phase >= 6 ? 3.5 : 0, ease: CALM },
                }}
            >
                {/* Radial halo behind logo */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: 600, height: 240,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(ellipse, rgba(74,175,218,0.25) 0%, rgba(79,163,165,0.12) 42%, transparent 70%)",
                    filter: "blur(55px)",
                    pointerEvents: "none",
                }} />

                {/* Wordmark */}
                <motion.div
                    style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(4.5rem, 13.5vw, 11rem)",
                        fontWeight: 300,
                        background: "linear-gradient(140deg, #8ED4EC 0%, #4AAFDA 38%, #40A39E 72%, #6FC8C0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1,
                        letterSpacing: "0.24em",
                        filter: "drop-shadow(0 0 55px rgba(74,175,218,0.5)) drop-shadow(0 0 110px rgba(74,175,218,0.14))",
                    }}
                    animate={{
                        letterSpacing: phase >= 5 && phase < 6 ? "0.24em" : "0.40em",
                        opacity: phase >= 5 ? 1 : 0,
                    }}
                    transition={{ duration: 1.6, ease: SILK }}
                >
                    UHUM
                </motion.div>

                {/* Tagline */}
                <motion.p
                    style={{
                        margin: "1.3rem 0 0",
                        fontSize: "0.68rem",
                        letterSpacing: "0.48em",
                        color: "rgba(255,255,255,0.30)",
                        textTransform: "uppercase",
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 400,
                    }}
                    animate={{
                        opacity: phase >= 5 && phase < 6 ? 0.85 : 0,
                        y: phase >= 5 ? 0 : 14,
                    }}
                    transition={{ duration: 1.1, delay: 0.55, ease: SILK }}
                >
                    emotional intelligence
                </motion.p>

                {/* Thin rule below wordmark */}
                <motion.div
                    style={{
                        marginTop: "1.6rem",
                        height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(74,175,218,0.42), transparent)",
                        borderRadius: 1,
                    }}
                    animate={{
                        scaleX: phase >= 5 && phase < 6 ? 1 : 0,
                        opacity: phase >= 5 && phase < 6 ? 0.7 : 0,
                    }}
                    transition={{ duration: 1.3, delay: 0.38, ease: SILK }}
                />
            </motion.div>

            {/* ── Progress / skip ── */}
            <motion.button
                style={{
                    position: "absolute", bottom: 36, right: 44,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.40)",
                    borderRadius: 100,
                    padding: "6px 20px",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                    backdropFilter: "blur(8px)",
                    zIndex: 10,
                }}
                animate={{ opacity: phase >= 1 && phase < 6 ? 0.72 : 0 }}
                whileHover={{ opacity: 1, borderColor: "rgba(74,175,218,0.42)", color: "rgba(74,175,218,0.85)" }}
                transition={{ duration: 0.35 }}
                onClick={skip}
            >
                SKIP
            </motion.button>
        </div>
    );
}
