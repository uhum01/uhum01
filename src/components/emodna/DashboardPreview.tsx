import { useEffect, useRef, useState, useCallback } from "react";
import { GiDna1, GiMedal } from "react-icons/gi";
import { MdOutlineBarChart } from "react-icons/md";
import { FiTarget } from "react-icons/fi";
import { HEATMAP_COLORS } from "./data";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface StatCard {
  icon: React.ReactNode;
  val: string;
  lbl: string;
  change: string;
  changePositive: boolean;
  detail: string;
  trend: number[];
}

interface DonutSeg {
  color: string;
  pct: number;
  label: string;
  glow: string;
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const STAT_CARDS: StatCard[] = [
  {
    icon: <GiDna1 size={24} />, val: "78", lbl: "UHUM Score", change: "+3 this week",
    changePositive: true, detail: "Top 18% of all users",
    trend: [70, 71, 73, 74, 75, 76, 78],
  },
  {
    icon: <MdOutlineBarChart size={24} />, val: "23", lbl: "Check-ins Done", change: "92% consistency",
    changePositive: true, detail: "Streak: 6 days",
    trend: [18, 19, 20, 20, 21, 22, 23],
  },
  {
    icon: <FiTarget size={22} />, val: "12", lbl: "Triggers Mapped", change: "+2 new",
    changePositive: true, detail: "3 resolved this week",
    trend: [8, 9, 9, 10, 10, 11, 12],
  },
  {
    icon: <GiMedal size={24} />, val: "6", lbl: "Badges Earned", change: "1 pending",
    changePositive: false, detail: "Next: Resilience Streak",
    trend: [4, 4, 5, 5, 5, 6, 6],
  },
];

const BARS = [55, 70, 62, 85, 73, 68, 78];
const BAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DONUT_SEGS: DonutSeg[] = [
  { color: "#4AAFDA", pct: 35, label: "Flow", glow: "rgba(74,175,218,0.5)" },
  { color: "#F4A57A", pct: 28, label: "Flight", glow: "rgba(244,165,122,0.5)" },
  { color: "#6ECBA8", pct: 22, label: "Freeze", glow: "rgba(110,203,168,0.5)" },
  { color: "#B8A4E0", pct: 15, label: "Fight", glow: "rgba(184,164,224,0.5)" },
];

/* ─────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

/* ─────────────────────────────────────────
   Stat Card (with focus-mode logic)
───────────────────────────────────────── */
function StatCardItem({
  card, index, focusedIndex, onFocus, onBlur,
}: {
  card: StatCard;
  index: number;
  focusedIndex: number | null;
  onFocus: (i: number) => void;
  onBlur: () => void;
}) {
  const isFocused = focusedIndex === index;
  const isRecessed = focusedIndex !== null && !isFocused;
  const countVal = useCountUp(parseInt(card.val), isFocused);
  const glowRef = useRef<HTMLDivElement>(null);

  // Light-sweep on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (focusedIndex !== null) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, [focusedIndex]);

  return (
    <div
      className="stat-card-3d"
      data-focused={isFocused}
      data-recessed={isRecessed}
      onClick={() => isFocused ? onBlur() : onFocus(index)}
      onMouseMove={handleMouseMove}
    >
      {/* Radial glow behind */}
      <div className="stat-card-glow" ref={glowRef} />
      {/* Light sweep */}
      <div className="stat-card-sweep" />

      <div className="stat-card-inner">
        <div className="stat-icon">{card.icon}</div>
        <div className="stat-value">
          {isFocused ? countVal : card.val}
        </div>
        <div className="stat-label">{card.lbl}</div>
        <div className={`stat-change ${card.changePositive ? "positive" : "pending"}`}>
          {card.change}
        </div>

        {/* Expanded focus content */}
        <div className="stat-expanded">
          <div className="stat-detail">{card.detail}</div>
          {/* Mini sparkline */}
          <svg viewBox="0 0 70 28" className="stat-spark" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`sg${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4AAFDA" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4AAFDA" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={card.trend.map((v, i) => {
                const px = (i / (card.trend.length - 1)) * 70;
                const py = 28 - ((v - Math.min(...card.trend)) / (Math.max(...card.trend) - Math.min(...card.trend) || 1)) * 24 - 2;
                return `${i === 0 ? "M" : "L"}${px},${py}`;
              }).join(" ")}
              fill="none" stroke="#4AAFDA" strokeWidth="2" strokeLinecap="round"
            />
            <path
              d={[
                ...card.trend.map((v, i) => {
                  const px = (i / (card.trend.length - 1)) * 70;
                  const py = 28 - ((v - Math.min(...card.trend)) / (Math.max(...card.trend) - Math.min(...card.trend) || 1)) * 24 - 2;
                  return `${i === 0 ? "M" : "L"}${px},${py}`;
                }),
                "L70,28 L0,28 Z"
              ].join(" ")}
              fill={`url(#sg${index})`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Bar Chart
───────────────────────────────────────── */
function BarChart({ revealed }: { revealed: boolean }) {
  return (
    <div className="chart-panel">
      <div className="chart-title">7-Day Emotional Trend</div>
      <div className="bar-chart-wrap" style={{ perspective: "800px" }}>
        {BARS.map((h, i) => (
          <div key={i} className="bar-col">
            <div
              className="bar-3d"
              style={{
                height: `${h}%`,
                animationDelay: revealed ? `${i * 0.1}s` : "0s",
                animationPlayState: revealed ? "running" : "paused",
              } as React.CSSProperties}
            />
            <div className="bar-day">{BAR_DAYS[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Donut Chart
───────────────────────────────────────── */
function DonutChart() {
  const [hoveredSeg, setHoveredSeg] = useState<number | null>(null);
  const donutRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!donutRef.current) return;
    const rect = donutRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY = dx * 8;
    const rotX = -dy * 8;
    donutRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const handleMouseLeave = () => {
    if (donutRef.current)
      donutRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    setHoveredSeg(null);
  };

  let cum = 0;
  const segments = DONUT_SEGS.map((s, i) => {
    const start = cum;
    cum += s.pct;
    return { ...s, start, index: i };
  });

  return (
    <div className="chart-panel">
      <div className="chart-title">Response Style</div>
      <div
        className="donut-wrap"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "600px" }}
      >
        <div ref={donutRef} className="donut-3d-inner">
          <svg viewBox="0 0 80 80" className="donut-svg">
            {segments.map((seg) => {
              const isHov = hoveredSeg === seg.index;
              return (
                <circle
                  key={seg.label}
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHov ? 14 : 12}
                  strokeDasharray={`${seg.pct * 2.01} 200`}
                  strokeDashoffset={-seg.start * 2.01}
                  transform="rotate(-90 40 40)"
                  style={{
                    transition: "stroke-width 0.3s ease, filter 0.3s ease",
                    filter: isHov ? `drop-shadow(0 0 6px ${seg.glow})` : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredSeg(seg.index)}
                />
              );
            })}
          </svg>

          {hoveredSeg !== null && (
            <div className="donut-tooltip" style={{ color: DONUT_SEGS[hoveredSeg].color }}>
              <span className="donut-tooltip-pct">{DONUT_SEGS[hoveredSeg].pct}%</span>
              <span className="donut-tooltip-lbl">{DONUT_SEGS[hoveredSeg].label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="donut-legend">
        {DONUT_SEGS.map((s, i) => (
          <span
            key={s.label}
            className={`donut-legend-item ${hoveredSeg === i ? "hov" : ""}`}
            style={{ "--seg-color": s.color } as React.CSSProperties}
            onMouseEnter={() => setHoveredSeg(i)}
            onMouseLeave={() => setHoveredSeg(null)}
          >
            <span className="donut-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Heatmap Grid with Color-Group Hover
───────────────────────────────────────── */

// Map each hex to a human-readable group name + glow color for box-shadow
const COLOR_GLOW: Record<string, string> = {
  '#4AAFDA': 'rgba(74,175,218,0.55)',
  '#7EC8E3': 'rgba(126,200,227,0.50)',
  '#C5E3F7': 'rgba(197,227,247,0.55)',
  '#E8F4FD': 'rgba(232,244,253,0.7)',
  '#FFD5BC': 'rgba(255,213,188,0.65)',
  '#FFF0E8': 'rgba(255,240,232,0.7)',
  '#E8F8F2': 'rgba(232,248,242,0.7)',
};

function HeatmapGrid() {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div
      className="heatmap-grid"
      onMouseLeave={() => setHoveredColor(null)}
    >
      {HEATMAP_COLORS.map((c, i) => {
        const isActive = hoveredColor === c;
        const isDim = hoveredColor !== null && hoveredColor !== c;
        const glow = COLOR_GLOW[c] ?? 'rgba(74,175,218,0.4)';
        return (
          <div
            key={i}
            className={`heatmap-cell${isActive ? ' heatmap-active' : ''}${isDim ? ' heatmap-dim' : ''}`}
            style={{
              background: c,
              boxShadow: isActive ? `0 0 0 2px white, 0 4px 18px ${glow}, 0 2px 8px ${glow}` : 'none',
            }}
            onMouseEnter={() => setHoveredColor(c)}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Dashboard Preview
───────────────────────────────────────── */
export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = useState(false);
  const [barsRevealed, setBarsRevealed] = useState(false);
  const [focusedCard, setFocusedCard] = useState<number | null>(null);
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const breathPhaseRef = useRef(0);

  /* ── Scroll-reveal: cinematic depth emerge ── */
  useEffect(() => {
    const dash = dashRef.current;
    if (!dash) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          setTimeout(() => setBarsRevealed(true), 400);
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(dash);
    return () => obs.disconnect();
  }, []);

  /* ── Mouse parallax (damped rAF loop) ── */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const w = window.innerWidth, h = window.innerHeight;
      const nx = (e.clientX / w - 0.5) * 2; // -1 to +1
      const ny = (e.clientY / h - 0.5) * 2;
      setMouseNorm({ x: nx, y: ny });

      // Cursor glow
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  /* ── Breathing + parallax animation loop ── */
  useEffect(() => {
    const dash = dashRef.current;
    if (!dash) return;

    const animate = (time: number) => {
      // Breathing
      breathPhaseRef.current = time;
      const breathY = Math.sin(time / 4000 * Math.PI * 2) * (-6);  // 8s period

      // Damped parallax
      const target = mouseNorm;
      parallaxRef.current.x += (target.x - parallaxRef.current.x) * 0.04;
      parallaxRef.current.y += (target.y - parallaxRef.current.y) * 0.04;
      const rotX = -parallaxRef.current.y * 4;   // max ±4deg
      const rotY = parallaxRef.current.x * 4;

      if (revealed && focusedCard === null) {
        dash.style.transform = `
          perspective(1400px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          translateY(${breathY}px)
        `;
      } else if (focusedCard !== null) {
        dash.style.transform = `perspective(1400px) translateY(${breathY}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealed, focusedCard, mouseNorm]);

  const handleFocus = (i: number) => setFocusedCard(i);
  const handleUnfocus = () => setFocusedCard(null);

  return (
    <>
      {/* Cursor glow */}
      <div ref={cursorGlowRef} className="cursor-glow" aria-hidden />

      {/* Vignette overlay when in focus mode */}
      <div className={`focus-vignette ${focusedCard !== null ? "active" : ""}`} aria-hidden />

      <section
        id="dashboard"
        ref={sectionRef}
        className="dash-section"
      >
        {/* Section header */}
        <div className="dash-header-text">
          <span className="section-tag section-tag-sky">Live Analytics</span>
          <h2 className="dash-title">Your Emotion Insights Dashboard</h2>
          <p className="dash-subtitle">
            Not just a mood log — a comprehensive emotional intelligence command center.
          </p>
        </div>

        {/* Ambient glow pulse */}
        <div className="ambient-glow" aria-hidden />

        {/* ── Main dashboard panel ── */}
        <div
          ref={dashRef}
          className={`dash-panel ${revealed ? "revealed" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glass reflection stripe */}
          <div className="glass-reflection" aria-hidden />

          {/* Panel header */}
          <div className="dash-panel-header">
            <div>
              <div className="dash-panel-title">UHUM Dashboard</div>
              <div className="dash-panel-sub">Last updated: Today, 9:42 AM</div>
            </div>
            <div className="dash-panel-week">Week 4 · Day 23</div>
          </div>

          {/* Stat cards */}
          <div className="stat-row">
            {STAT_CARDS.map((card, i) => (
              <StatCardItem
                key={card.lbl}
                card={card}
                index={i}
                focusedIndex={focusedCard}
                onFocus={handleFocus}
                onBlur={handleUnfocus}
              />
            ))}
          </div>

          {/* Charts row */}
          <div className="charts-row">
            <BarChart revealed={barsRevealed} />
            <DonutChart />
          </div>

          {/* Heatmap */}
          <div className="chart-panel heatmap-panel">
            <div className="chart-title">30-Day Emotion Heatmap</div>
            <HeatmapGrid />
          </div>
        </div>
      </section>

      {/* ── All inline styles ── */}
      <style>{`
        /* ── Section ── */
        .dash-section {
          position: relative;
          padding: 90px 5%;
          background: #f0f5f9;
          overflow: hidden;
        }

        /* ── Cursor glow ── */
        .cursor-glow {
          position: fixed;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(74,175,218,0.07) 0%, transparent 70%);
          transition: left 0.08s ease, top 0.08s ease;
          mix-blend-mode: screen;
        }

        /* ── Vignette ── */
        .focus-vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 40;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(8,15,30,0.55) 100%);
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .focus-vignette.active { opacity: 1; }

        /* ── Ambient glow ── */
        .ambient-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          width: 700px;
          height: 400px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(74,175,218,0.1) 0%, transparent 70%);
          animation: ambientPulse 10s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.12); }
        }

        /* ── Section header ── */
        .dash-header-text {
          position: relative;
          z-index: 1;
          margin-bottom: 3rem;
        }
        .dash-title {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          color: #1a2332;
          line-height: 1.2;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .dash-subtitle {
          font-size: 1rem;
          color: #5a7189;
          line-height: 1.8;
          max-width: 550px;
        }

        /* ── Dashboard panel ── */
        .dash-panel {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 28px;
          border: 1.5px solid rgba(255,255,255,0.6);
          box-shadow:
            0 4px 32px rgba(74,175,218,0.08),
            0 1px 4px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          will-change: transform, opacity, filter;

          /* Initial hidden state */
          opacity: 0;
          filter: blur(8px);
          transform: perspective(1400px) translateZ(-200px) translateY(30px);
          transition:
            opacity   0.9s cubic-bezier(0.22,1,0.36,1),
            filter    0.9s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.5s ease;
        }
        .dash-panel.revealed {
          opacity: 1;
          filter: blur(0px);
          /* translateZ reset is handled by rAF for continuous parallax */
          transform: perspective(1400px) translateZ(0) translateY(0);
          transition:
            opacity   0.9s cubic-bezier(0.22,1,0.36,1),
            filter    0.9s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.5s ease;
        }

        /* ── Glass reflection ── */
        .glass-reflection {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          border-radius: 24px 24px 0 0;
          pointer-events: none;
        }

        /* ── Panel header ── */
        .dash-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(74,175,218,0.12);
        }
        .dash-panel-title { font-weight: 700; color: #1a2332; font-size: 1.1rem; }
        .dash-panel-sub   { font-size: 0.78rem; color: #8fa0b0; margin-top: 2px; }
        .dash-panel-week  { font-size: 0.85rem; color: #4AAFDA; font-weight: 700; letter-spacing: 0.02em; }

        /* ── Stat row ── */
        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .stat-row { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Stat Card 3D ── */
        .stat-card-3d {
          position: relative;
          border-radius: 16px;
          background: rgba(255,255,255,0.92);
          border: 1.5px solid rgba(74,175,218,0.1);
          padding: 18px;
          cursor: pointer;
          overflow: hidden;
          will-change: transform, opacity, filter;
          transition:
            transform  0.55s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.55s cubic-bezier(0.22,1,0.36,1),
            opacity    0.55s cubic-bezier(0.22,1,0.36,1),
            filter     0.55s cubic-bezier(0.22,1,0.36,1),
            border-color 0.4s cubic-bezier(0.22,1,0.36,1);
          --mx: 50%;
          --my: 50%;
          transform-style: preserve-3d;
          z-index: 2;
        }

        /* Hover state */
        .stat-card-3d:hover:not([data-focused="true"]):not([data-recessed="true"]) {
          transform:
            translateZ(60px)
            scale(1.04)
            rotateX(2deg);
          box-shadow:
            0 24px 64px rgba(74,175,218,0.2),
            0 8px 24px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border-color: rgba(74,175,218,0.35);
        }
        .stat-card-3d:hover .stat-card-sweep {
          animation: lightSweep 0.6s ease forwards;
        }
        .stat-card-3d:hover .stat-card-glow {
          opacity: 1;
        }

        /* Focused state */
        .stat-card-3d[data-focused="true"] {
          transform:
            translateZ(180px)
            scale(1.18);
          box-shadow:
            0 40px 80px rgba(74,175,218,0.3),
            0 16px 48px rgba(0,0,0,0.12),
            0 0 0 2px rgba(74,175,218,0.5),
            inset 0 1px 0 rgba(255,255,255,0.95);
          border-color: rgba(74,175,218,0.6);
          z-index: 50;
        }
        .stat-card-3d[data-focused="true"] .stat-card-glow {
          opacity: 1;
          background: radial-gradient(circle at 50% 50%, rgba(74,175,218,0.2) 0%, transparent 70%);
        }
        .stat-card-3d[data-focused="true"] .stat-expanded {
          max-height: 120px;
          opacity: 1;
          transform: translateY(0);
          transition:
            max-height 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s,
            opacity    0.4s ease 0.2s,
            transform  0.4s cubic-bezier(0.22,1,0.36,1) 0.2s;
        }
        .stat-card-3d[data-focused="true"] .stat-value {
          color: #4AAFDA;
        }

        /* Recessed state */
        .stat-card-3d[data-recessed="true"] {
          transform: translateZ(-120px) scale(0.96);
          opacity: 0.4;
          filter: blur(3px);
          pointer-events: none;
        }

        /* Radial glow */
        .stat-card-glow {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          background: radial-gradient(circle at var(--mx) var(--my), rgba(74,175,218,0.15) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
        }

        /* Light sweep */
        .stat-card-sweep {
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
        }
        @keyframes lightSweep {
          0%   { left: -100%; opacity: 0; }
          5%   { opacity: 1; }
          100% { left: 160%; opacity: 0; }
        }

        /* Card inner */
        .stat-card-inner { position: relative; z-index: 2; }
        .stat-icon  { font-size: 1.5rem; margin-bottom: 8px; }
        .stat-value {
          font-size: 1.7rem;
          font-weight: 800;
          color: #1a2332;
          font-variant-numeric: tabular-nums;
          transition: color 0.4s ease;
          line-height: 1;
        }
        .stat-label  { font-size: 0.74rem; color: #7a90a0; font-weight: 600; margin-top: 4px; }
        .stat-change {
          font-size: 0.72rem;
          font-weight: 700;
          margin-top: 3px;
        }
        .stat-change.positive { color: #6ECBA8; }
        .stat-change.pending  { color: #F4A57A; }

        /* Expanded focus content */
        .stat-expanded {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          transition:
            max-height 0.4s ease,
            opacity    0.3s ease,
            transform  0.3s ease;
          margin-top: 0;
        }
        .stat-detail {
          font-size: 0.72rem;
          color: #5a7189;
          margin-top: 10px;
          font-weight: 500;
          border-top: 1px solid rgba(74,175,218,0.12);
          padding-top: 8px;
        }
        .stat-spark {
          width: 100%;
          height: 28px;
          margin-top: 8px;
          display: block;
        }

        /* ── Charts row ── */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 640px) {
          .charts-row { grid-template-columns: 1fr; }
        }

        /* ── Chart panel ── */
        .chart-panel {
          background: rgba(255,255,255,0.75);
          border-radius: 18px;
          padding: 20px;
          border: 1px solid rgba(74,175,218,0.1);
          backdrop-filter: blur(12px);
          transition: box-shadow 0.3s ease;
        }
        .chart-panel:hover {
          box-shadow: 0 8px 32px rgba(74,175,218,0.1);
        }
        .chart-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #2a3a4a;
          margin-bottom: 14px;
          letter-spacing: 0.01em;
        }

        /* ── Bar chart ── */
        .bar-chart-wrap {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 100px;
        }
        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          height: 100%;
        }
        .bar-3d {
          width: 100%;
          min-height: 12px;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #4AAFDA 0%, #7EC8E3 60%, #b8e0f0 100%);
          transform-origin: bottom center;
          will-change: transform, opacity;
          box-shadow: 0 -2px 8px rgba(74,175,218,0.25);
          transition: box-shadow 0.3s ease;
          /* animation-play-state controlled via inline React style */
          animation: barRise 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes barRise {
          0%   {
            transform: translateZ(-100px) rotateX(15deg) scaleY(0);
            opacity: 0;
          }
          100% {
            transform: translateZ(0)      rotateX(0deg)  scaleY(1);
            opacity: 1;
          }
        }
        .bar-3d:hover {
          box-shadow: 0 -4px 16px rgba(74,175,218,0.4);
          filter: brightness(1.08);
        }
        .bar-day {
          font-size: 0.62rem;
          color: #8fa0b0;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        /* ── Donut chart ── */
        .donut-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
        }
        .donut-3d-inner {
          position: relative;
          width: 90px;
          height: 90px;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
          transform-style: preserve-3d;
        }
        .donut-svg {
          width: 90px;
          height: 90px;
          display: block;
        }
        .donut-tooltip {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }
        .donut-tooltip-pct {
          display: block;
          font-size: 1.1rem;
          font-weight: 800;
          line-height: 1;
        }
        .donut-tooltip-lbl {
          display: block;
          font-size: 0.6rem;
          font-weight: 600;
          opacity: 0.8;
        }
        .donut-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .donut-legend-item {
          font-size: 0.7rem;
          font-weight: 600;
          color: #5a7189;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .donut-legend-item.hov {
          color: var(--seg-color);
          transform: translateY(-2px);
        }
        .donut-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }


        /* ── Heatmap ── */
        .heatmap-panel { }
        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 4px;
        }
        .heatmap-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          cursor: pointer;
          transition:
            transform     0.35s cubic-bezier(0.22,1,0.36,1),
            box-shadow    0.35s cubic-bezier(0.22,1,0.36,1),
            opacity       0.35s cubic-bezier(0.22,1,0.36,1),
            filter        0.35s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          z-index: 1;
        }
        .heatmap-cell.heatmap-active {
          transform: scale(1.22);
          z-index: 5;
        }
        .heatmap-cell.heatmap-dim {
          opacity: 0.28;
          filter: saturate(0.4);
        }

        /* ── Section tag helpers (ensure they exist) ── */
        .section-tag {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 18px;
        }
        .section-tag-sky {
          background: rgba(74,175,218,0.12);
          color: #4AAFDA;
        }
      `}</style>
    </>
  );
}
