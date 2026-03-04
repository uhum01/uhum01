import { useState } from "react";
import { DIMENSIONS } from "./data";
import { use3DScroll } from "@/hooks/use3DScroll";
import { GiDna1, GiFireBowl } from "react-icons/gi";
import { RiBubbleChartLine, RiSparkling2Line } from "react-icons/ri";

/* ─── Radar Visual ──────────────────────────────────────────────── */
function RadarCard() {
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [hov, setHov] = useState(false);
  const cx = 110, cy = 110, r = 75;
  const scores = [0.82, 0.65, 0.88, 0.74, 0.58, 0.70, 0.62];
  const n = scores.length;
  const pts = scores.map((s, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + s * r * Math.cos(a), y: cy + s * r * Math.sin(a) };
  });
  const axes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ');
  const labels = ['Resilience', 'Triggers', 'Strengths', 'Stability', 'Reactivity', 'Stress', 'Patterns'];

  return (
    <div
      className="relative"
      style={{ perspective: 1000 }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        setRx(-(((e.clientY - r.top) / r.height) - 0.5) * 18);
        setRy(((e.clientX - r.left) / r.width - 0.5) * 18);
        setHov(true);
      }}
      onMouseLeave={() => { setRx(0); setRy(0); setHov(false); }}
    >
      <div
        className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-white/80"
        style={{
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${hov ? 1.03 : 1})`,
          transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="text-sm font-bold text-dark mb-1">Priya's UHUM Fingerprint</div>
        <div className="text-xs text-soft mb-4">The Reflective Processor · Score 78/100</div>
        <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto block">
          {[0.25, 0.5, 0.75, 1].map(ratio => (
            <polygon key={ratio}
              points={axes.map(a => `${cx + (a.x - cx) * ratio},${cy + (a.y - cy) * ratio}`).join(' ')}
              fill="none" stroke="hsl(205,76%,87%)" strokeWidth="1" opacity="0.7" />
          ))}
          {axes.map((a, i) => <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="hsl(205,76%,87%)" strokeWidth="1" opacity="0.5" />)}
          <polygon points={poly} fill="hsla(197,63%,57%,0.18)" stroke="hsl(197,63%,57%)" strokeWidth="2" />
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="hsl(197,63%,57%)" />)}
          {axes.map((a, i) => {
            const tx = cx + (a.x - cx) * 1.22, ty = cy + (a.y - cy) * 1.22;
            return <text key={i} x={tx} y={ty} textAnchor="middle" fill="hsl(210,22%,56%)" fontSize="8" fontWeight="600">{labels[i]}</text>;
          })}
        </svg>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {['🦅 Flight Responder', '💭 Catastrophizer', '🌟 Empathy Strength'].map(b => (
            <span key={b} className="bg-sky rounded-full py-1 px-2.5 text-[0.7rem] font-bold text-sky-accent">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Dimension Score Card ─────────────────────────────────────── */
function DimensionCard() {
  return (
    <div className="bg-[hsl(216,36%,17%)] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="text-white font-bold text-sm mb-1">UHUM Dashboard</div>
      <div className="text-white/40 text-xs mb-5">7 Dimensions · Score 78/100</div>
      <div className="flex flex-col gap-3">
        {DIMENSIONS.map(d => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="text-white/60 text-[0.75rem] font-semibold w-[80px] shrink-0">{d.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.color, boxShadow: `0 0 8px ${d.color}88` }} />
            </div>
            <span className="text-[0.75rem] font-bold text-white/70 w-8 text-right">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Blueprint / Badge Card ───────────────────────────────────── */
function BlueprintCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(197,63%,57%), hsl(20,85%,72%))' }}>
          <GiDna1 size={22} color="white" />
        </div>
        <div>
          <div className="font-bold text-dark text-sm">UHUM Certificate</div>
          <div className="text-xs text-soft">Issued after 30-day journey</div>
        </div>
      </div>
      <div className="space-y-2.5">
        {[
          { label: 'UHUM Score', val: '78 → 91', color: '#4AAFDA' },
          { label: 'Growth Streak', val: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>30 days <GiFireBowl size={14} color="#F4A57A" /></span>, color: '#F4A57A' },
          { label: 'Badges Earned', val: '6 milestones', color: '#6ECBA8' },
          { label: 'Profile Type', val: 'Reflective Processor', color: '#B8A4E0' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5">
            <span className="text-[0.78rem] font-semibold text-mid">{r.label}</span>
            <span className="text-[0.78rem] font-bold" style={{ color: r.color }}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Individual Bear-style Row ──────────────────────────────────── */
interface RowProps {
  flip: boolean;
  blobCss: string;
  blobRadius: string;
  blobRotate: string;
  label: string;
  labelColor: string;
  title: string;
  desc: string;
  bullets: string[];
  bulletColor: string;
  visual: React.ReactNode;
  variant?: "rise" | "tilt-left" | "tilt-right" | "zoom-depth" | "flip-up" | "slide-depth" | "cascade";
}

function BearRow({ flip, blobCss, blobRadius, blobRotate, label, labelColor, title, desc, bullets, bulletColor, visual }: RowProps) {
  const textRef = use3DScroll<HTMLDivElement>({ variant: flip ? "tilt-right" : "tilt-left", threshold: 0.1 });
  const visualRef = use3DScroll<HTMLDivElement>({ variant: flip ? "tilt-left" : "tilt-right", delay: 120, threshold: 0.08 });

  const textBlock = (
    <div ref={textRef} className="flex flex-col justify-center">
      <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] mb-3" style={{ color: labelColor }}>{label}</span>
      <h3 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-dark leading-[1.15] mb-4">{title}</h3>
      <p className="text-[0.95rem] text-soft leading-[1.75] mb-6 max-w-[420px]">{desc}</p>
      <ul className="space-y-3">
        {bullets.map(b => (
          <li key={b} className="flex items-start gap-2.5 text-[0.9rem] text-mid leading-snug">
            <span className="mt-[5px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: bulletColor }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );

  const visualBlock = (
    <div ref={visualRef} className="relative flex items-center justify-center min-h-[380px]">
      {/* Organic Blob */}
      <div
        className="absolute inset-0 z-0"
        style={{
          width: '105%', height: '105%',
          left: flip ? '-10%' : '-5%',
          background: blobCss,
          borderRadius: blobRadius,
          transform: blobRotate,
        }}
      />
      {/* Card floating on blob */}
      <div className="relative z-10 w-full max-w-[340px]">
        {visual}
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 ${flip ? '' : ''}`}>
      {flip ? <>{visualBlock}{textBlock}</> : <>{textBlock}{visualBlock}</>}
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────── */
export default function UHUMSpotlight() {
  const headerRef = use3DScroll<HTMLDivElement>({ variant: "flip-up", threshold: 0.1 });

  const rows: RowProps[] = [
    {
      flip: false,
      blobCss: 'hsl(197,63%,88%)',
      blobRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
      blobRotate: 'rotate(-8deg)',
      label: 'The Core Innovation',
      labelColor: 'hsl(197,63%,46%)',
      title: 'Map Your Emotional Fingerprint',
      desc: 'Most apps track how you feel. UHUM maps why you feel that way — and builds a living emotional blueprint that grows smarter every week.',
      bullets: [
        '5-step structured assessment across 7 psychological dimensions',
        'Unique spider-chart reveals your emotional strengths and blindspots',
        'Assigned a personality-style type like "The Reflective Processor"',
        'Monthly re-assessment tracks how your profile evolves over time',
      ],
      bulletColor: 'hsl(197,63%,57%)',
      visual: <RadarCard />,
    },
    {
      flip: true,
      blobCss: 'hsl(20,85%,88%)',
      blobRadius: '38% 62% 54% 46% / 44% 56% 44% 56%',
      blobRotate: 'rotate(10deg)',
      label: 'Deep Self-Awareness',
      labelColor: 'hsl(20,75%,55%)',
      title: 'Understand All 7 Dimensions',
      desc: 'See your emotional makeup in full — from trigger sensitivity to cognitive patterns — all tracked, scored, and visualized just for you.',
      bullets: [
        'Resilience, Triggers, Strengths and Mood Stability scores',
        'Reactivity, Stress Style and Cognitive Pattern tracking',
        'Real-time score updates as you check in and complete exercises',
        'Color-coded heatmap calendar shows your best and worst days',
      ],
      bulletColor: 'hsl(20,85%,60%)',
      visual: <DimensionCard />,
    },
    {
      flip: false,
      blobCss: 'hsl(155,44%,82%)',
      blobRadius: '54% 46% 38% 62% / 50% 40% 60% 50%',
      blobRotate: 'rotate(-12deg)',
      label: 'Personalized Identity',
      labelColor: 'hsl(155,45%,42%)',
      title: 'Your Living Emotional Blueprint',
      desc: 'A profile that never stops growing — certificates, badges and shareable snapshots that reflect real psychological milestones.',
      bullets: [
        'AI analyses your patterns weekly to refine your profile',
        'Downloadable UHUM Certificate with your top strengths',
        'Achievement badges tied to real psychological growth moments',
        'Share progress snapshots with your Trusted Circle of 5 people',
      ],
      bulletColor: 'hsl(155,50%,48%)',
      visual: <BlueprintCard />,
    },
  ];

  return (
    <section className="py-[80px] px-[6%] bg-white relative overflow-hidden">
      {/* Section header */}
      <div ref={headerRef} className="text-center mb-4">
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-sky-accent">The Core Innovation</span>
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] text-dark leading-[1.15] mt-2">
          What is Your UHUM?
        </h2>
      </div>

      {/* Bear-style alternating rows */}
      {rows.map((row, i) => (
        <BearRow key={i} {...row} />
      ))}
    </section>
  );
}
