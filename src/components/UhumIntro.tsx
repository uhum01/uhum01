import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Easing ─────────────────────────────────────────────────────── */
const SILK = [0.22, 1, 0.36, 1] as const;
const CALM = [0.16, 1, 0.3, 1] as const;

/* ─── Mobile detection (runs once, never re-reads) ───────────────── */
const IS_MOBILE =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

/* ─── Icon orbit data ─────────────────────────────────────────────── */
const ALL_ICONS = [
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
// On mobile show only 5 icons evenly spread — fewer compositing layers
const ICONS = IS_MOBILE
    ? ALL_ICONS.filter((_, i) => i % 2 === 0).slice(0, 5)
    : ALL_ICONS;

/* ─── Ambient particles ───────────────────────────────────────────── */
// Mobile: 18 particles  |  Desktop: 55 particles
const PARTICLE_COUNT = IS_MOBILE ? 18 : 55;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.6 + 0.3,
    dur: Math.random() * 10 + 6,
    delay: Math.random() * 8,
    op: Math.random() * 0.28 + 0.06,
}));

/* ─── Ambient colour orbs ─────────────────────────────────────────── */
const ORB_DATA = [
    { color: "rgba(74,175,218,0.09)", lx: "14%", ty: "18%", w: 420, h: 420, dur: 13 },
    { color: "rgba(244,165,122,0.065)", lx: "76%", ty: "66%", w: 330, h: 330, dur: 16 },
    { color: "rgba(79,163,165,0.075)", lx: "79%", ty: "14%", w: 290, h: 290, dur: 12 },
    { color: "rgba(184,164,224,0.055)", lx: "9%", ty: "74%", w: 260, h: 260, dur: 15 },
];
// On mobile render only 2 orbs — fewer blurred layers = huge perf win
const ORBS = IS_MOBILE ? ORB_DATA.slice(0, 2) : ORB_DATA;

/* ─── Meditation figure SVG path ─────────────────────────────────── */
const FIGURE_D = [
    "M 100 26",
    "C 117 26 127 36 127 48",
    "C 127 62 117 70 100 70",
    "C 83 70 73 62 73 48",
    "C 73 36 83 26 100 26",
    "M 100 70",
    "C 76 75 54 92 50 118",
    "C 46 142 60 157 80 158",
    "C 93 159 100 149 100 140",
    "M 100 70",
    "C 124 75 146 92 150 118",
    "C 154 142 140 157 120 158",
    "C 107 159 100 149 100 140",
    "M 100 158",
    "C 80 164 48 176 40 206",
    "C 30 238 50 256 77 257",
    "C 94 258 103 244 100 232",
    "M 100 158",
    "C 120 164 152 176 160 206",
    "C 170 238 150 256 123 257",
    "C 106 258 97 244 100 232",
].join(" ");

/* ─── Component ──────────────────────────────────────────────────── */
export default function UhumIntro({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState(0);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;

    // Tighter orbit radius on mobile so icons don't go off-screen
    const iconRx = IS_MOBILE
        ? Math.min(vw * 0.30, 160)
        : Math.min(vw * 0.36, 380);
    const iconRy = IS_MOBILE
        ? Math.min(vh * 0.22, 120)
        : Math.min(vh * 0.275, 195);

    const skip = useCallback(() => {
        timerRefs.current.forEach(clearTimeout);
        setPhase(6);
        const t = setTimeout(onComplete, 1400);
        timerRefs.current = [t];
    }, [onComplete]);

    useEffect(() => {
        const ts = [
            setTimeout(() => setPhase(1), 180),
            setTimeout(() => setPhase(2), 3800),
            setTimeout(() => setPhase(3), 8000),
            setTimeout(() => setPhase(4), 10200),
            setTimeout(() => setPhase(5), 13000),
            setTimeout(() => setPhase(6), 16500),
            setTimeout(onComplete, 16800),
        ];
        timerRefs.current = ts;
        return () => ts.forEach(clearTimeout);
    }, [onComplete]);

    const figureVisible = phase >= 1 && phase <= 3;
    const lineVisible = phase >= 3 && phase < 6;

    // On mobile skip perspective — it forces a new stacking context
    // and triggers expensive GPU compositing for every child layer.
    const rootStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        ...(IS_MOBILE ? {} : { perspective: "1400px" }),
    };

    return (
        <div style={rootStyle}>

            {/* ── Background ── */}
            <motion.div
                style={{ position: "absolute", inset: 0 }}
                animate={{
                    background: phase >= 6
                        ? "radial-gradient(ellipse 130% 90% at 50% 0%, #e0f0fa 0%, #f0f5f9 55%, #fdf4ef 100%)"
                        : "radial-gradient(ellipse 90% 65% at 50% 35%, #030d1a 0%, #010508 100%)",
                }}
                transition={{ duration: IS_MOBILE ? 3.0 : 4.5, ease: CALM }}
            />

            {/* ── Ambient star particles ── */}
            <motion.div
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                transition={{ duration: IS_MOBILE ? 2.5 : 3.8, ease: CALM }}
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
                        animate={
                            IS_MOBILE
                                // On mobile: simple fade only — no y movement = no layout recalc
                                ? { opacity: [0, p.op, 0] }
                                : { opacity: [0, p.op, p.op * 0.3, p.op, 0], y: [0, -14, 0] }
                        }
                        transition={{
                            opacity: { duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
                            ...(IS_MOBILE ? {} : {
                                y: { duration: p.dur * 1.5, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
                            }),
                        }}
                    />
                ))}
            </motion.div>

            {/* ── Ambient colour orbs ── */}
            <motion.div
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                transition={{ duration: IS_MOBILE ? 2.5 : 3.8, ease: CALM }}
            >
                {ORBS.map((orb, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            left: orb.lx, top: orb.ty,
                            width: IS_MOBILE ? orb.w * 0.65 : orb.w,
                            height: IS_MOBILE ? orb.h * 0.65 : orb.h,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${orb.color}, transparent 72%)`,
                            // Reduce blur radius on mobile — blur is extremely costly on GPU
                            filter: IS_MOBILE ? "blur(22px)" : "blur(45px)",
                            translateX: "-50%", translateY: "-50%",
                        }}
                        animate={
                            IS_MOBILE
                                // Simple opacity pulse only — no scale/xy movement
                                ? { opacity: [0.5, 1, 0.5] }
                                : {
                                    scale: [0.88, 1.14, 0.88],
                                    x: [0, 18, -12, 18, 0],
                                    y: [0, -12, 8, -12, 0],
                                    opacity: [0.5, 1, 0.5],
                                }
                        }
                        transition={{
                            opacity: { duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.6 },
                            ...(IS_MOBILE ? {} : {
                                scale: { duration: orb.dur * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 1.6 },
                                x: { duration: orb.dur * 1.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 },
                                y: { duration: orb.dur * 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 },
                            }),
                        }}
                    />
                ))}
            </motion.div>

            {/* ── Meditation Figure ── */}
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
                    // On mobile skip blur — filter: blur() during animation is extremely slow
                    filter: (!IS_MOBILE && phase >= 3) ? "blur(18px)" : "blur(0px)",
                }}
                transition={{
                    opacity: { duration: phase >= 3 ? (IS_MOBILE ? 2.0 : 3.2) : 1.2, ease: CALM },
                    scale: { duration: phase >= 3 ? (IS_MOBILE ? 2.0 : 3.2) : 1.4, ease: CALM },
                    filter: { duration: phase >= 3 ? (IS_MOBILE ? 2.0 : 3.5) : 0.9, ease: CALM },
                }}
            >
                {/* Energy glow bloom — simplified on mobile */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: IS_MOBILE ? 260 : 420,
                        height: IS_MOBILE ? 320 : 520,
                        borderRadius: "50%",
                        background: "radial-gradient(ellipse, rgba(74,175,218,0.24) 0%, rgba(244,165,122,0.11) 42%, rgba(79,163,165,0.07) 62%, transparent 80%)",
                        filter: IS_MOBILE ? "blur(25px)" : "blur(60px)",
                        pointerEvents: "none",
                    }}
                    animate={{
                        opacity: phase >= 2 ? [0.7, 1, 0.7] : 0,
                        ...(IS_MOBILE ? {} : { scale: phase >= 2 ? [0.95, 1.08, 0.95] : 0.5 }),
                    }}
                    transition={{
                        opacity: { duration: 1.8, ease: "easeInOut" },
                        ...(IS_MOBILE ? {} : {
                            scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                        }),
                    }}
                />

                {/* SVG drawing */}
                <motion.svg
                    viewBox="0 0 200 285"
                    width={IS_MOBILE ? 180 : 260}
                    height={IS_MOBILE ? 257 : 371}
                    style={{ overflow: "visible" }}
                    // Skip breathing scale on mobile
                    animate={(!IS_MOBILE && phase >= 2) ? { scale: [1, 1.018, 1, 1.018, 1] } : { scale: 1 }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <defs>
                        {/* Simplified filter on mobile — single pass instead of merge */}
                        {IS_MOBILE ? (
                            <filter id="fgInk" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="1.5" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        ) : (
                            <>
                                <filter id="fgInk" x="-55%" y="-55%" width="210%" height="210%">
                                    <feGaussianBlur stdDeviation="3" result="b" />
                                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                                <filter id="fgEnergy" x="-65%" y="-65%" width="230%" height="230%">
                                    <feGaussianBlur stdDeviation="5.5" result="b" />
                                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </>
                        )}
                        {/* Energy gradient — on mobile use solid teal to skip SVG animation overhead */}
                        {IS_MOBILE ? (
                            <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#7EC8E3" />
                                <stop offset="50%" stopColor="#4AAFDA" />
                                <stop offset="100%" stopColor="#4FA3A5" />
                            </linearGradient>
                        ) : (
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
                        )}
                    </defs>

                    <motion.path
                        d={FIGURE_D}
                        fill="none"
                        stroke={phase >= 2 ? "url(#energyFlow)" : "rgba(255,255,255,0.92)"}
                        strokeWidth={phase >= 2 ? 2.5 : 2.0}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // On mobile: skip the heavy fgEnergy filter during phase 2+
                        filter={IS_MOBILE
                            ? "url(#fgInk)"
                            : (phase >= 2 ? "url(#fgEnergy)" : "url(#fgInk)")
                        }
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            pathLength: { duration: IS_MOBILE ? 2.0 : 2.6, ease: [0.37, 0, 0.63, 1] },
                            opacity: { duration: 0.6, ease: "easeOut" },
                        }}
                    />
                </motion.svg>
            </motion.div>

            {/* ── Glowing Horizon Line ── */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    translateX: "-50%", translateY: "-50%",
                    pointerEvents: "none",
                }}
                animate={{
                    opacity: lineVisible ? 1 : 0,
                    y: phase === 3 ? 12 : 0,
                }}
                transition={{
                    opacity: { duration: phase >= 6 ? (IS_MOBILE ? 2.5 : 4.0) : 2.0, ease: CALM },
                    y: { duration: 2.8, ease: SILK },
                }}
            >
                {/* Fat outer halo — skip on mobile */}
                {!IS_MOBILE && (
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
                )}
                {/* Mid glow */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: IS_MOBILE ? "80vw" : "60vw", height: 5,
                        translateX: "-50%", translateY: "-50%",
                        borderRadius: 4,
                        background: "linear-gradient(90deg, transparent, rgba(74,175,218,0.55) 25%, #7EC8E3 50%, rgba(79,163,165,0.55) 75%, transparent)",
                        filter: IS_MOBILE ? "blur(2px)" : "blur(3.5px)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: lineVisible ? 1 : 0 }}
                    transition={{ duration: 1.8, delay: 0.06, ease: SILK }}
                />
                {/* Bright core */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: IS_MOBILE ? "80vw" : "60vw", height: 1.8,
                        translateX: "-50%", translateY: "-50%",
                        borderRadius: 1,
                        background: "linear-gradient(90deg, transparent, #4AAFDA 22%, #C5E9F6 50%, #4FA3A5 78%, transparent)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{
                        scaleX: lineVisible ? 1 : 0,
                        boxShadow: IS_MOBILE
                            ? "0 0 12px 2px rgba(74,175,218,0.38)"
                            : [
                                "0 0 12px 2px rgba(74,175,218,0.38)",
                                "0 0 24px 4px rgba(74,175,218,0.6)",
                                "0 0 12px 2px rgba(74,175,218,0.38)",
                            ],
                    }}
                    transition={{
                        scaleX: { duration: 1.7, ease: SILK },
                        boxShadow: IS_MOBILE
                            ? { duration: 0 }
                            : { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
                    }}
                />
            </motion.div>

            {/* ── Floating Icon Orbit ── */}
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
                            width: IS_MOBILE ? 42 : 54,
                            height: IS_MOBILE ? 42 : 54,
                            marginLeft: IS_MOBILE ? -21 : -27,
                            marginTop: IS_MOBILE ? -21 : -27,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: IS_MOBILE ? "1.05rem" : "1.32rem",
                            borderRadius: IS_MOBILE ? 10 : 13,
                            background: IS_MOBILE
                                // On mobile: solid dark bg instead of glassmorphism (no backdrop-filter)
                                ? "rgba(10, 28, 46, 0.75)"
                                : "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(74,175,218,0.22)",
                            // backdrop-filter is one of the most expensive CSS properties on mobile — remove it
                            ...(IS_MOBILE ? {} : {
                                backdropFilter: "blur(18px)",
                                WebkitBackdropFilter: "blur(18px)",
                            }),
                            boxShadow: IS_MOBILE
                                ? "0 4px 16px rgba(74,175,218,0.12)"
                                : "0 8px 32px rgba(74,175,218,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
                            willChange: "transform, opacity",
                        }}
                        animate={{
                            x: iconsIn ? tx : 0,
                            y: iconsIn ? (iconsOut ? ty - 60 : ty) : 40,
                            opacity: iconsIn ? (iconsOut ? 0 : 0.88) : 0,
                            scale: iconsIn ? (iconsOut ? 0.4 : 1) : 0.5,
                            // Skip rotateY on mobile — triggers expensive 3D compositing
                            ...(IS_MOBILE ? {} : { rotateY: iconsIn ? 0 : 22 }),
                            // Skip per-icon blur on exit for mobile
                            ...(IS_MOBILE ? {} : { filter: iconsOut ? "blur(6px)" : "blur(0px)" }),
                        }}
                        transition={{
                            duration: iconsOut ? (IS_MOBILE ? 1.8 : 2.8) : (IS_MOBILE ? 1.4 : 2.0),
                            delay: iconsOut ? i * 0.08 : i * 0.12,
                            ease: SILK,
                        }}
                    >
                        <motion.span
                            animate={IS_MOBILE ? {} : { y: [0, -5, 0] }}
                            transition={{ duration: 3.0 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        >
                            {item.e}
                        </motion.span>
                        {/* Glass sheen — skip on mobile */}
                        {!IS_MOBILE && (
                            <div style={{
                                position: "absolute", inset: 0, borderRadius: 13,
                                background: "radial-gradient(circle at 38% 32%, rgba(74,175,218,0.14), transparent 62%)",
                                pointerEvents: "none",
                            }} />
                        )}
                    </motion.div>
                );
            })}

            {/* ── UHUM Logo ── */}
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
                    opacity: { duration: phase >= 6 ? (IS_MOBILE ? 2.2 : 3.5) : 2.0, ease: CALM },
                    scale: { duration: phase >= 6 ? (IS_MOBILE ? 2.0 : 3.2) : 1.8, ease: SILK },
                    filter: { duration: phase >= 6 ? (IS_MOBILE ? 2.0 : 3.2) : 1.8, ease: CALM },
                    y: { duration: phase >= 6 ? (IS_MOBILE ? 2.2 : 3.5) : 0, ease: CALM },
                }}
            >
                {/* Radial halo — simplified on mobile */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: IS_MOBILE ? 340 : 600,
                    height: IS_MOBILE ? 160 : 240,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(ellipse, rgba(74,175,218,0.25) 0%, rgba(79,163,165,0.12) 42%, transparent 70%)",
                    filter: IS_MOBILE ? "blur(28px)" : "blur(55px)",
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
                        // Reduce drop-shadow layers on mobile — each drop-shadow is a separate GPU pass
                        filter: IS_MOBILE
                            ? "drop-shadow(0 0 30px rgba(74,175,218,0.45))"
                            : "drop-shadow(0 0 55px rgba(74,175,218,0.5)) drop-shadow(0 0 110px rgba(74,175,218,0.14))",
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

                {/* Rule below wordmark */}
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

            {/* ── Skip button ── */}
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
                    fontWeight: 400,
                    // No backdrop-filter on the skip button either
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
