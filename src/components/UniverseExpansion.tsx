import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─── Easing ─────────────────────────────────────────────────────── */
const CALM = [0.16, 1, 0.3, 1] as const;
const SILK = [0.22, 1, 0.36, 1] as const;

/* ─── Mobile detection ───────────────────────────────────────────── */
const IS_MOBILE =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

/* ─── Continuity particles ───────────────────────────────────────── */
// Mobile: 8 particles  |  Desktop: 22 particles
const PARTICLE_COUNT = IS_MOBILE ? 8 : 22;
const CONT_PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    dur: Math.random() * 5 + 3,
    delay: Math.random() * 1.2,
    op: Math.random() * 0.22 + 0.05,
    colorBlue: Math.random() > 0.5,
}));

interface Props {
    onComplete: () => void;
}

/**
 * UniverseExpansion
 * ─────────────────
 * Fixed full-screen overlay that bridges the dark UHUM intro
 * and the light website background.
 *
 * Sequence (total ~2.8s):
 *  0.0s  overlay appears (instant, dark matches end of intro)
 *  0.0s  background begins expanding & colour-morphing
 *  0.0s  ambient glow bloom fires from centre
 *  0.0s  continuity particles begin floating up and fading
 *  1.4s  overlay starts fading out (opacity → 0 over 1.4s)
 *  2.8s  onComplete fires → website fully visible
 */
export default function UniverseExpansion({ onComplete }: Props) {
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        timerRef.current = setTimeout(onComplete, 2000);
        return () => clearTimeout(timerRef.current);
    }, [onComplete]);

    return (
        /* Wrapper fades out starting at 1.4s, gone by 2.8s */
        <motion.div
            style={{
                position: "fixed", inset: 0, zIndex: 500,
                ...(IS_MOBILE ? {} : { perspective: "1400px" }),
                overflow: "hidden",
                pointerEvents: "none",
                willChange: "opacity",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.2, ease: CALM }}
        >
            {/* ── Expanding background ────────────────────────────────── */}
            {/*
        Starts matching intro's final dark colour.
        Blooms outward (scale 1 → 1.18) while colour morphs
        dark navy → teal+blue+peach mid → soft white website bg.
      */}
            <motion.div
                style={{
                    position: "absolute",
                    inset: "-20%",              // oversized so scale doesn't reveal edges
                    transformOrigin: "center center",
                }}
                animate={{
                    scale: [1.0, 1.12, 1.02],
                    background: [
                        /* 0%  — end-of-intro dark */
                        "radial-gradient(ellipse 75% 65% at 50% 38%, #0d2030 0%, #061018 50%, #010508 100%)",
                        /* 45% — colour awakening */
                        "radial-gradient(ellipse 105% 88% at 50% 33%, rgba(74,175,218,0.45) 0%, rgba(79,163,165,0.30) 28%, rgba(244,165,122,0.14) 58%, rgba(232,244,252,0.95) 100%)",
                        /* 100% — website gradient, seamless */
                        "radial-gradient(ellipse 130% 110% at 50% 28%, #e8f4fd 0%, #f0f5f9 45%, #fef7f0 100%)",
                    ],
                }}
                transition={{
                    duration: 2.0,
                    ease: SILK,
                    times: [0, 0.40, 1],
                }}
            />

            {/* ── Central ambient glow bloom ───────────────────────────── */}
            {/*
        Soft radial pulse expands from centre.
        Opacity 0 → 0.14 → 0 — barely perceptible, emotionally felt.
      */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: "90vw", height: "90vh",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(74,175,218,0.28) 0%, rgba(126,200,227,0.14) 38%, rgba(244,165,122,0.06) 65%, transparent 80%)",
                    filter: IS_MOBILE ? "blur(28px)" : "blur(55px)",
                    pointerEvents: "none",
                }}
                animate={IS_MOBILE
                    ? { opacity: [0, 0.1, 0], scale: [0.5, 1.5, 2.2] }
                    : { opacity: [0, 0.14, 0.06, 0], scale: [0.5, 1.3, 1.9, 2.4] }
                }
                transition={{ duration: IS_MOBILE ? 1.6 : 2.2, ease: CALM, times: IS_MOBILE ? [0, 0.4, 1] : [0, 0.3, 0.65, 1] }}
            />

            {/* ── Continuity particles ─────────────────────────────────── */}
            {/*
        A subset of the intro's stars — they float upward and
        lighten in tone as the gradient brightens, creating
        environmental continuity between the two scenes.
      */}
            {CONT_PARTICLES.map(p => (
                <motion.div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`, top: `${p.y}%`,
                        width: p.size, height: p.size,
                        borderRadius: "50%",
                        background: p.colorBlue
                            ? "rgba(74,175,218,0.9)"
                            : "rgba(255,255,255,0.85)",
                        filter: `blur(${p.size > 1.2 ? 0.5 : 0}px)`,
                        boxShadow: p.colorBlue
                            ? "0 0 4px rgba(74,175,218,0.4)"
                            : "0 0 3px rgba(255,255,255,0.3)",
                    }}
                    animate={{
                        y: [-4, -30, -55],
                        opacity: [p.op * 1.3, p.op * 0.6, 0],
                        scale: [1.0, 0.7, 0.3],
                    }}
                    transition={{
                        duration: p.dur,
                        delay: p.delay,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* ── Soft horizon glow (top edge warmth) ─────────────────── */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0, left: "10%",
                    width: "80%", height: "35vh",
                    background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(74,175,218,0.18) 0%, transparent 70%)",
                    filter: IS_MOBILE ? "blur(14px)" : "blur(30px)",
                    pointerEvents: "none",
                }}
                animate={{ opacity: [0, 0.8, 0.3, 0] }}
                transition={{ duration: 2.2, ease: CALM, times: [0, 0.35, 0.7, 1] }}
            />

            {/* ── Bottom peach warm bloom ──────────────────────────────── */}
            <motion.div
                style={{
                    position: "absolute",
                    bottom: 0, left: "20%",
                    width: "60%", height: "30vh",
                    background: "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(244,165,122,0.14) 0%, transparent 70%)",
                    filter: IS_MOBILE ? "blur(18px)" : "blur(40px)",
                    pointerEvents: "none",
                }}
                animate={{ opacity: [0, 0.65, 0.2, 0] }}
                transition={{ duration: 2.2, ease: CALM, times: [0, 0.4, 0.75, 1] }}
            />
        </motion.div>
    );
}
