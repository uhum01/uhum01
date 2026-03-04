import { useState, useRef, useEffect, useCallback, MouseEvent as ME, ReactNode } from "react";
import {
  motion, AnimatePresence, useInView, useReducedMotion,
  useSpring, useMotionValue, useTransform,
} from "framer-motion";
import { ALL_FEATURES } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEPTHS = [0, 55, 25, 80, 10, 65, 40, 95];
const getZ = (i: number) => DEPTHS[i % DEPTHS.length];

/* ── Warm particle field ───────────────────────────────── */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w; canvas.height = h;
    type P = { x: number; y: number; z: number; spd: number; op: number };
    const pts: P[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() * 1000, spd: Math.random() * 0.3 + 0.06,
      op: Math.random() * 0.25 + 0.04,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.z -= p.spd;
        if (p.z <= 1) { p.z = 1000; p.x = Math.random() * w; p.y = Math.random() * h; }
        const s = 1000 / p.z, px = (p.x - w / 2) * s + w / 2, py = (p.y - h / 2) * s + h / 2;
        const r = Math.max(0.3, s * 0.65), a = p.op * (1 - p.z / 1000);
        if (px < -10 || px > w + 10 || py < -10 || py > h + 10) continue;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,130,100,${a})`; ctx.fill();
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ── Back-layer 3D depth elements ─────────────────────── */
function BackLayer3D({ isInView }: { isInView: boolean }) {
  /* Ghost cards behind the main grid */
  const ghostCards = [
    { x: "8%", y: "22%", w: 220, h: 140, rot: -6, color: "rgba(244,165,122,0.15)", delay: 0 },
    { x: "62%", y: "12%", w: 180, h: 120, rot: 5, color: "rgba(74,175,218,0.12)", delay: 0.2 },
    { x: "38%", y: "60%", w: 240, h: 150, rot: -3, color: "rgba(184,164,224,0.13)", delay: 0.4 },
    { x: "75%", y: "55%", w: 170, h: 110, rot: 7, color: "rgba(244,165,122,0.10)", delay: 0.1 },
    { x: "22%", y: "68%", w: 190, h: 130, rot: -8, color: "rgba(110,203,168,0.11)", delay: 0.3 },
  ];

  /* Floating geometric rings */
  const rings = [
    { x: "15%", y: "30%", size: 90, dur: 14, delay: 0, color: "rgba(244,165,122,0.25)" },
    { x: "72%", y: "20%", size: 130, dur: 18, delay: 4, color: "rgba(74,175,218,0.20)" },
    { x: "50%", y: "70%", size: 110, dur: 16, delay: 8, color: "rgba(184,164,224,0.22)" },
    { x: "88%", y: "55%", size: 70, dur: 12, delay: 2, color: "rgba(110,203,168,0.20)" },
  ];

  /* Perspective grid lines (horizontal) */
  const gridLines = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: 1200, transformStyle: "preserve-3d", zIndex: 1 }}>

      {/* Perspective grid floor */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "50%", transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, rotateX: 60 }}
        animate={isInView ? { opacity: 1, rotateX: 60 } : {}}
        transition={{ duration: 1.4, ease: EASE }}
      >
        {gridLines.map((_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{
            top: `${(i / 5) * 100}%`, height: 1,
            background: `rgba(220,130,90,${0.06 + i * 0.015})`,
          }} />
        ))}
        {[0.1, 0.2, 0.3, 0.5, 0.65, 0.8, 0.9].map((x, i) => (
          <div key={i} className="absolute top-0 bottom-0" style={{
            left: `${x * 100}%`, width: 1,
            background: "rgba(220,130,90,0.06)",
          }} />
        ))}
      </motion.div>

      {/* Ghost cards at deep Z (negative depth = behind) */}
      {ghostCards.map((g, i) => (
        <motion.div key={i}
          className="absolute rounded-2xl"
          style={{
            left: g.x, top: g.y, width: g.w, height: g.h,
            background: g.color,
            backdropFilter: "blur(4px)",
            border: `1px solid ${g.color.replace(/[\d.]+\)$/, "0.3)")}`,
            rotate: g.rot,
            translateZ: -120,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: g.delay + 0.3, ease: EASE }}
        >
          {/* Ghost card inner lines */}
          <div className="absolute top-4 left-4 right-4 h-px bg-white/20 rounded" />
          <div className="absolute top-8 left-4 w-16 h-px bg-white/15 rounded" />
          <div className="absolute top-12 left-4 right-4 h-px bg-white/10 rounded" />
        </motion.div>
      ))}

      {/* Floating rings */}
      {rings.map((r, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            left: r.x, top: r.y,
            width: r.size, height: r.size,
            border: `1.5px solid ${r.color}`,
            translateX: "-50%", translateY: "-50%",
            translateZ: -80,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: r.dur, delay: r.delay, repeat: Infinity, ease: "linear" }}
          initial={{ opacity: 0, scale: 0.5 }}
        />
      ))}

      {/* Deep-background large shapes */}
      <motion.div className="absolute rounded-full"
        style={{
          width: 320, height: 320, left: "5%", top: "10%",
          background: "radial-gradient(circle, rgba(244,165,122,0.07) 0%, transparent 70%)",
          translateZ: -200
        }}
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute rounded-full"
        style={{
          width: 280, height: 280, right: "8%", bottom: "15%",
          background: "radial-gradient(circle, rgba(184,164,224,0.08) 0%, transparent 70%)",
          translateZ: -160
        }}
        animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 10, delay: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── Liquid Spring Tabs ─────────────────────────────────── */
function LiquidTabs({ tabs, active, onChange, show }: {
  tabs: string[]; active: string; onChange: (t: string) => void; show: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pLeft = useSpring(0, { stiffness: 160, damping: 22, mass: 0.7 });
  const pWidth = useSpring(0, { stiffness: 160, damping: 22, mass: 0.7 });
  const upd = useCallback(() => {
    if (!ref.current) return;
    const btn = ref.current.querySelector<HTMLButtonElement>(`[data-t="${active}"]`);
    if (!btn) return;
    const cl = ref.current.getBoundingClientRect().left, br = btn.getBoundingClientRect();
    pLeft.set(br.left - cl); pWidth.set(br.width);
  }, [active, pLeft, pWidth]);
  useEffect(() => { const id = requestAnimationFrame(upd); return () => cancelAnimationFrame(id); }, [active, upd]);

  return (
    <motion.div ref={ref} className="flex gap-1 flex-wrap relative my-7"
      initial="h" animate={show ? "s" : "h"}
      variants={{ h: {}, s: { transition: { staggerChildren: 0.06, delayChildren: 0.45 } } }}
    >
      <motion.div className="absolute inset-y-0 rounded-full pointer-events-none z-0"
        style={{
          left: pLeft, width: pWidth,
          background: "linear-gradient(135deg, hsl(20,85%,55%), hsl(15,75%,62%))",
          boxShadow: "0 4px 20px hsla(20,85%,55%,.35), 0 2px 8px rgba(0,0,0,.15)",
        }}
      />
      {tabs.map(t => (
        <motion.button key={t} data-t={t} onClick={() => onChange(t)}
          className={`relative z-10 py-1.5 px-4 rounded-full text-[0.82rem] font-bold cursor-pointer font-body whitespace-nowrap transition-colors duration-200 ${active === t ? "text-white" : "text-[hsl(20,40%,35%)] hover:text-[hsl(20,60%,30%)]"}`}
          variants={{ h: { opacity: 0, y: 8 }, s: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
        >{t}</motion.button>
      ))}
    </motion.div>
  );
}

/* ── Glassmorphic Feature Card (peach-adapted) ──────────── */
function Card3D({ icon, title, desc, index, zDepth }: {
  icon: ReactNode; title: string; desc: string; index: number; zDepth: number;
}) {
  const [hov, setHov] = useState(false);
  const rX = useSpring(0, { stiffness: 220, damping: 28 });
  const rY = useSpring(0, { stiffness: 220, damping: 28 });
  const gX = useMotionValue(50), gY = useMotionValue(50);
  const glow = useTransform([gX, gY], ([x, y]: number[]) =>
    `radial-gradient(circle at ${x}% ${y}%,rgba(244,165,122,0.22) 0%,transparent 62%)`);

  const onMove = (e: ME<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const xp = (e.clientX - r.left) / r.width, yp = (e.clientY - r.top) / r.height;
    rX.set(-(yp - 0.5) * 10); rY.set((xp - 0.5) * 10);
    gX.set(xp * 100); gY.set(yp * 100);
  };
  const onEnter = () => setHov(true);
  const onLeave = () => { setHov(false); rX.set(0); rY.set(0); gX.set(50); gY.set(50); };

  return (
    <motion.div
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 40, z: zDepth - 160, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, z: hov ? zDepth + 45 : zDepth, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 20, z: zDepth - 160, filter: "blur(8px)" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE, z: { duration: 0.3 } }}
      className="relative overflow-hidden rounded-2xl cursor-default"
    >
      {/* Warm glass surface */}
      <div className="absolute inset-0 rounded-2xl transition-all duration-300" style={{
        background: "rgba(255,250,248,0.72)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: hov ? "1px solid rgba(244,165,122,.55)" : "1px solid rgba(255,255,255,.85)",
        boxShadow: hov
          ? "0 20px 55px rgba(200,100,60,.18),0 6px 20px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.9)"
          : "0 4px 20px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.8)",
      }} />
      {/* Cursor warm glow */}
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: glow }} />
      {/* Top shimmer */}
      <div className="absolute top-0 left-6 right-6 h-px rounded" style={{
        background: `linear-gradient(90deg,transparent,${hov ? "rgba(244,165,122,.7)" : "rgba(255,255,255,.95)"},transparent)`,
        transition: "background .3s",
      }} />
      {/* Light sweep on hover */}
      {hov && (
        <motion.div className="absolute inset-0 pointer-events-none"
          initial={{ x: "-110%" }} animate={{ x: "250%" }} transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ background: "linear-gradient(105deg,transparent 36%,rgba(255,255,255,.4) 50%,transparent 64%)", width: "100%" }}
        />
      )}
      {/* Content */}
      <div className="relative z-10 p-6">
        <motion.div className="text-[1.9rem] mb-3 inline-block"
          animate={{ scale: hov ? 1.12 : 1, rotate: hov ? 4 : 0 }} transition={{ duration: 0.22 }}>
          {icon}
        </motion.div>
        <div className="text-[0.92rem] font-bold mb-1.5 leading-snug text-[hsl(218,30%,18%)]">{title}</div>
        <div className="text-[0.79rem] leading-[1.75] text-[hsl(215,20%,50%)]">{desc}</div>
      </div>
      {/* Bottom peach line */}
      <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-300" style={{
        background: `linear-gradient(90deg,transparent,hsla(20,85%,62%,${hov ? .5 : .15}),transparent)`,
      }} />
    </motion.div>
  );
}

/* ── Main Section ───────────────────────────────────────── */
export default function AllFeatures() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [tab, setTab] = useState("Core UHUM");
  const [display, setDisplay] = useState("Core UHUM");
  const [spotX, setSpotX] = useState(50);
  const [spotY, setSpotY] = useState(50);
  const tabKeys = Object.keys(ALL_FEATURES);

  /* Scene parallax rotation */
  const sceneRX = useSpring(0, { stiffness: 35, damping: 22 });
  const sceneRY = useSpring(0, { stiffness: 35, damping: 22 });

  const onMove = (e: ME<HTMLElement>) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    const xn = (e.clientX - r.left) / r.width, yn = (e.clientY - r.top) / r.height;
    sceneRX.set((yn - 0.5) * -4); sceneRY.set((xn - 0.5) * 5);
    setSpotX(xn * 100); setSpotY(yn * 100);
  };
  const onLeave = () => { sceneRX.set(0); sceneRY.set(0); };

  const switchTab = (t: string) => {
    if (t === tab) return;
    setTab(t);
    setTimeout(() => setDisplay(t), 360);
  };

  /* Warm ambient orbs */
  const ORBS = [
    { w: 460, h: 320, l: "2%", t: "5%", c: "hsl(20,90%,78%)", op: .35, dur: 16, dl: 0 },
    { w: 340, h: 240, l: "68%", t: "4%", c: "hsl(35,85%,80%)", op: .28, dur: 20, dl: 4 },
    { w: 300, h: 210, l: "55%", t: "62%", c: "hsl(10,80%,80%)", op: .25, dur: 14, dl: 8 },
    { w: 240, h: 170, l: "1%", t: "65%", c: "hsl(262,40%,82%)", op: .20, dur: 18, dl: 12 },
  ];

  return (
    <section ref={sectionRef} onMouseMove={onMove} onMouseLeave={onLeave}
      className="relative overflow-hidden py-[90px] px-[6%]"
      style={{
        background: "linear-gradient(145deg, hsl(25,85%,97%) 0%, hsl(20,70%,95%) 45%, hsl(30,65%,96%) 100%)",
        minHeight: "80vh",
      }}
    >
      {/* Particle field */}
      <ParticleField />

      {/* Back-layer 3D depth elements */}
      <BackLayer3D isInView={isInView} />

      {/* Ambient orbs */}
      {ORBS.map((o, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ width: o.w, height: o.h, left: o.l, top: o.t, background: o.c, filter: "blur(80px)", opacity: o.op }}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: o.dur, delay: o.dl, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Cursor warm spotlight */}
      <div className="absolute inset-0 pointer-events-none transition-[background] duration-100"
        style={{ background: `radial-gradient(ellipse 600px 380px at ${spotX}% ${spotY}%,hsla(20,85%,60%,.07) 0%,transparent 70%)` }}
      />

      {/* Soft ambient pulse */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse 800px 500px at 50% 38%,hsl(20,90%,85%) 0%,transparent 65%)" }}
      />

      {/* Thin floating vertical lines */}
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{
            width: 1, height: 65 + i * 30, left: `${12 + i * 24}%`, top: `${15 + i * 13}%`,
            background: `linear-gradient(180deg,transparent,hsla(20,85%,55%,.25),transparent)`
          }}
          animate={{ y: [0, -25, 0], opacity: [.2, .5, .2] }}
          transition={{ duration: 10 + i * 2, delay: i * 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── 3D Scene ── */}
      <motion.div className="relative z-10"
        style={{ perspective: 1200, transformStyle: "preserve-3d", rotateX: sceneRX, rotateY: sceneRY }}
        initial={prefersReduced ? false : { opacity: 0, y: 56, filter: "blur(12px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {/* Header */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 38, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        >
          <span className="block text-[0.7rem] font-extrabold uppercase tracking-[0.16em] mb-3 text-[hsl(20,70%,52%)]">
            Full Feature Set
          </span>
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.12] mb-3 text-[hsl(218,35%,15%)]">
            Every Feature, Explored
          </h2>
          <p className="text-[0.97rem] leading-[1.8] max-w-[500px] text-[hsl(215,20%,48%)]">
            48+ features across 8 categories — the most comprehensive emotional wellness platform ever built.
          </p>
        </motion.div>

        {/* Tabs */}
        <LiquidTabs tabs={tabKeys} active={tab} onChange={switchTab} show={isInView} />

        {/* 3D Card Grid */}
        <div style={{ perspective: 1200, transformStyle: "preserve-3d" }}>
          <AnimatePresence mode="wait">
            <motion.div key={display}
              className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, rotateY: -7, filter: "blur(8px)" }}
              animate={{ opacity: 1, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, rotateY: 7, filter: "blur(8px)", transition: { duration: 0.35, ease: EASE } }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {ALL_FEATURES[display]?.map((f, i) => (
                <Card3D key={`${display}-${f.title}`} {...f} index={i} zDepth={getZ(i)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
