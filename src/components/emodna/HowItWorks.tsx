import { STEPS } from "./data";
import { use3DScroll } from "@/hooks/use3DScroll";
import { GiDna1 } from "react-icons/gi";
import { MdOutlineMap, MdOutlineTrendingUp } from "react-icons/md";

/* ─── Step Visual Cards ──────────────────────────────────────────── */
function AssessmentCard() {
  const questions = [
    { q: 'When stressed, I usually…', label: 'Withdraw quietly' },
    { q: 'My strongest emotion is…', label: 'Resilience' },
    { q: 'In conflict I tend to…', label: 'Seek understanding' },
  ];
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-gray-100 w-full max-w-[320px]">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl flex items-center"><GiDna1 size={22} color="#4AAFDA" /></span>
        <div>
          <div className="text-xs font-bold text-dark">UHUM Assessment</div>
          <div className="text-[0.7rem] text-soft">Step 2 of 5 · 4 mins left</div>
        </div>
      </div>
      <div className="space-y-3">
        {questions.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-3.5">
            <div className="text-[0.75rem] text-soft mb-2">{item.q}</div>
            <div className="bg-white border-[1.5px] border-sky-mid rounded-xl px-3 py-1.5 text-[0.78rem] font-semibold text-sky-accent inline-block">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-1.5 bg-sky rounded-full overflow-hidden">
        <div className="h-full w-2/5 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(197,63%,57%), hsl(195,67%,69%))' }} />
      </div>
      <div className="text-[0.72rem] text-soft mt-1.5 text-right">40% complete</div>
    </div>
  );
}

function ProfileCard() {
  const dims = [
    { name: 'Resilience', score: 82, color: '#4AAFDA' },
    { name: 'Triggers', score: 65, color: '#F4A57A' },
    { name: 'Strengths', score: 88, color: '#6ECBA8' },
    { name: 'Stability', score: 74, color: '#B8A4E0' },
    { name: 'Cognitive', score: 62, color: '#F4A57A' },
  ];
  return (
    <div className="bg-[hsl(216,36%,14%)] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-white font-bold text-sm">Your UHUM Profile</div>
          <div className="text-white/40 text-xs mt-0.5">The Reflective Processor</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[1.6rem] font-bold text-white">78</div>
          <div className="text-white/40 text-[0.65rem]">/ 100</div>
        </div>
      </div>
      <div className="space-y-2.5">
        {dims.map(d => (
          <div key={d.name} className="flex items-center gap-2.5">
            <span className="text-white/50 text-[0.72rem] w-[65px] shrink-0">{d.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, background: d.color }} />
            </div>
            <span className="text-[0.72rem] font-bold text-white/60 w-6 text-right">{d.score}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {['🦅 Flight', '💭 Deep Thinker', '🌟 Empath'].map(b => (
          <span key={b} className="rounded-full px-2.5 py-1 text-[0.65rem] font-bold text-white/80 bg-white/10">{b}</span>
        ))}
      </div>
    </div>
  );
}

function RoadmapCard() {
  const tasks = [
    { day: 'Day 1', task: 'Morning CBT Thought Record', done: true, color: '#4AAFDA' },
    { day: 'Day 2', task: 'Box Breathing × 5 mins', done: true, color: '#6ECBA8' },
    { day: 'Day 3', task: 'Trigger Journal Entry', done: true, color: '#F4A57A' },
    { day: 'Day 4', task: 'Emotion Heatmap Review', done: false, color: '#B8A4E0' },
    { day: 'Day 5', task: 'Check-in with Emo Coach', done: false, color: '#4AAFDA' },
  ];
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-gray-100 w-full max-w-[320px]">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl flex items-center"><MdOutlineMap size={22} color="#F4A57A" /></span>
        <div>
          <div className="text-xs font-bold text-dark">Growth Roadmap</div>
          <div className="text-[0.7rem] text-soft">Week 1 · 4-Week Plan</div>
        </div>
      </div>
      <div className="space-y-2.5">
        {tasks.map((t, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${t.done ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: t.done ? t.color : 'transparent', border: t.done ? 'none' : `2px solid ${t.color}44` }}>
              {t.done && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="2,5 4,7 8,3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.7rem] font-extrabold text-soft/70 uppercase tracking-wide">{t.day}</div>
              <div className={`text-[0.78rem] font-semibold truncate ${t.done ? 'text-soft line-through' : 'text-dark'}`}>{t.task}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionCard() {
  const weeks = [
    { label: 'Week 1', before: 62, after: 71 },
    { label: 'Week 2', before: 71, after: 76 },
    { label: 'Week 3', before: 76, after: 82 },
    { label: 'Week 4', before: 82, after: 91 },
  ];
  return (
    <div className="bg-[hsl(216,36%,14%)] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] w-full max-w-[320px]">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl flex items-center"><MdOutlineTrendingUp size={22} color="#6ECBA8" /></span>
        <div>
          <div className="text-white font-bold text-sm">UHUM Growth</div>
          <div className="text-white/40 text-xs">4-Week Evolution</div>
        </div>
      </div>
      <div className="space-y-3.5">
        {weeks.map((w, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1.5">
              <span className="text-white/50 text-[0.72rem] font-semibold">{w.label}</span>
              <span className="text-[0.72rem] font-bold" style={{ color: '#6ECBA8' }}>+{w.after - w.before} pts</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${w.before}%`, background: 'rgba(255,255,255,0.15)' }} />
              <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${w.after}%`, background: 'linear-gradient(90deg, hsl(197,63%,57%), hsl(155,50%,61%))' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/30 text-[0.65rem]">{w.before}</span>
              <span className="text-white/60 text-[0.65rem] font-bold">{w.after} / 100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bear-style Step Row ──────────────────────────────────────── */
interface StepRowProps {
  n: number;
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
}

function StepRow({ n, flip, blobCss, blobRadius, blobRotate, label, labelColor, title, desc, bullets, bulletColor, visual }: StepRowProps) {
  const textRef = use3DScroll<HTMLDivElement>({ variant: flip ? "tilt-right" : "tilt-left", threshold: 0.1 });
  const visualRef = use3DScroll<HTMLDivElement>({ variant: flip ? "tilt-left" : "tilt-right", delay: 140, threshold: 0.08 });

  const textBlock = (
    <div ref={textRef} className="flex flex-col justify-center">
      {/* Step number badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-base shrink-0"
          style={{ background: `linear-gradient(135deg, ${bulletColor}, ${bulletColor}99)` }}>
          {n}
        </div>
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em]" style={{ color: labelColor }}>{label}</span>
      </div>
      <h3 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] text-dark leading-[1.15] mb-4">{title}</h3>
      <p className="text-[0.95rem] text-soft leading-[1.75] mb-6 max-w-[420px]">{desc}</p>
      <ul className="space-y-3">
        {bullets.map(b => (
          <li key={b} className="flex items-start gap-2.5 text-[0.9rem] text-mid leading-snug">
            <span className="mt-[6px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: bulletColor }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );

  const visualBlock = (
    <div ref={visualRef} className="relative flex items-center justify-center min-h-[380px]">
      {/* Organic blob */}
      <div
        className="absolute z-0"
        style={{
          width: '115%', height: '110%',
          top: '-5%',
          left: flip ? '-15%' : '-5%',
          background: blobCss,
          borderRadius: blobRadius,
          transform: blobRotate,
        }}
      />
      {/* Floating card */}
      <div className="relative z-10">
        {visual}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-14">
      {flip ? <>{visualBlock}{textBlock}</> : <>{textBlock}{visualBlock}</>}
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────── */
export default function HowItWorks() {
  const headerRef = use3DScroll<HTMLDivElement>({ variant: "flip-up", threshold: 0.12 });

  const steps: StepRowProps[] = [
    {
      n: 1, flip: false,
      blobCss: 'hsl(262,45%,85%)',
      blobRadius: '60% 40% 52% 48% / 56% 48% 52% 44%',
      blobRotate: 'rotate(-6deg)',
      label: 'Step One',
      labelColor: 'hsl(262,45%,55%)',
      title: 'Take the UHUM Assessment',
      desc: 'Answer 25 carefully designed questions across 5 categories. No clinical jargon — just honest, reflective prompts.',
      bullets: [
        'Takes 8–10 minutes at your own pace',
        'Covers triggers, stress response, cognitive patterns and more',
        'Designed by psychologists and emotional wellness experts',
        'Completely private — your data stays yours',
      ],
      bulletColor: 'hsl(262,45%,60%)',
      visual: <AssessmentCard />,
    },
    {
      n: 2, flip: true,
      blobCss: 'hsl(197,63%,86%)',
      blobRadius: '44% 56% 38% 62% / 52% 44% 56% 48%',
      blobRotate: 'rotate(8deg)',
      label: 'Step Two',
      labelColor: 'hsl(197,63%,42%)',
      title: 'Get Your Emotional Profile',
      desc: 'Receive your full 7-dimension UHUM fingerprint, dominant personality type, score, and cognitive pattern analysis — instantly.',
      bullets: [
        'Spider chart across 7 psychological dimensions',
        'Assigned an UHUM type like "The Adaptive Warrior"',
        'Overall score from 0–100 with a detailed breakdown',
        'Cognitive pattern flags for blind spots to work on',
      ],
      bulletColor: 'hsl(197,63%,50%)',
      visual: <ProfileCard />,
    },
    {
      n: 3, flip: false,
      blobCss: 'hsl(20,85%,88%)',
      blobRadius: '48% 52% 64% 36% / 42% 58% 42% 58%',
      blobRotate: 'rotate(-10deg)',
      label: 'Step Three',
      labelColor: 'hsl(20,75%,52%)',
      title: 'Follow Your Growth Plan',
      desc: 'A personalized 4-week roadmap with daily emotional tasks, CBT exercises, and skill-building — matched exactly to your UHUM profile.',
      bullets: [
        'Daily tasks tailored to your specific profile and goals',
        'CBT thought records, somatic exercises and breathwork',
        'AI coach Emo available 24/7 for personalized support',
        'Streak tracking rewards consistent daily engagement',
      ],
      bulletColor: 'hsl(20,85%,60%)',
      visual: <RoadmapCard />,
    },
    {
      n: 4, flip: true,
      blobCss: 'hsl(155,44%,82%)',
      blobRadius: '56% 44% 40% 60% / 48% 60% 40% 52%',
      blobRotate: 'rotate(12deg)',
      label: 'Step Four',
      labelColor: 'hsl(155,45%,40%)',
      title: 'Track & Evolve',
      desc: 'Watch your UHUM score shift and grow. Daily check-ins, weekly insight reports, and monthly profile re-assessments track your journey.',
      bullets: [
        '7-day and 30-day emotional trend charts and heatmaps',
        'Predictive emotion engine warns you 48 hours ahead',
        'Monthly re-assessment shows exactly how you have grown',
        'Share progress certificates with your Trusted Circle',
      ],
      bulletColor: 'hsl(155,50%,48%)',
      visual: <EvolutionCard />,
    },
  ];

  return (
    <section id="how-it-works" className="py-[80px] px-[6%] bg-white relative overflow-hidden">
      {/* Section header */}
      <div ref={headerRef} className="text-center mb-4">
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-peach-deep">Simple Journey</span>
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] text-dark leading-[1.15] mt-2">
          How UHUM Works
        </h2>
        <p className="text-[1rem] text-soft leading-[1.8] max-w-[500px] mx-auto mt-3">
          From assessment to transformation in four clear steps.
        </p>
      </div>

      {/* Bear-style step rows */}
      {steps.map((step) => (
        <StepRow key={step.n} {...step} />
      ))}
    </section>
  );
}
