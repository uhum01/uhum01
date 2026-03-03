import { motion } from "framer-motion";
import { DIMENSIONS } from "./data";
import { use3DScroll, use3DChildrenReveal } from "@/hooks/use3DScroll";

/* ─── Stagger variants for the cinematic post-intro reveal ──────── */
const CALM = [0.16, 1, 0.3, 1] as const;
const SILK = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  onOpenModal: () => void;
  /** When true, animates content in with a cinematic stagger.
   *  Passed as `true` once the UniverseExpansion bridge completes. */
  revealed?: boolean;
}

export default function HeroSection({ onOpenModal, revealed = false }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // scroll-reveal refs (still used for re-entering viewport on scroll)
  const badgeRef = use3DScroll<HTMLDivElement>({ variant: "rise", delay: 0 });
  const headingRef = use3DScroll<HTMLHeadingElement>({ variant: "rise", delay: 100 });
  const subRef = use3DScroll<HTMLParagraphElement>({ variant: "rise", delay: 200 });
  const btnsRef = use3DScroll<HTMLDivElement>({ variant: "rise", delay: 300 });
  const cardRef = use3DScroll<HTMLDivElement>({ variant: "tilt-left", delay: 400 });

  /* ── Stagger helpers ─────────────────────────────────────────── */
  // Each hero element animates in once `revealed` flips to true.
  const heroVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(7px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const transition = (delay: number, duration = 0.9) => ({
    opacity: { duration, delay, ease: SILK },
    y: { duration: duration + 0.1, delay, ease: SILK },
    filter: { duration: duration + 0.15, delay, ease: CALM },
  });

  return (
    <section
      className="min-h-screen gradient-hero flex items-center px-[5%] pt-[100px] pb-[60px] relative overflow-hidden"
      style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
    >
      {/* ── Background ambient circles ───────────────────────── */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full -top-[100px] -right-[100px] pointer-events-none animate-float1"
        style={{ background: "radial-gradient(circle, rgba(126,200,227,0.2), transparent 70%)" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full -bottom-[50px] left-[10%] pointer-events-none animate-float2"
        style={{ background: "radial-gradient(circle, rgba(244,165,122,0.15), transparent 70%)" }}
      />

      {/* ── Left content ─────────────────────────────────────── */}
      <div className="max-w-[600px] relative z-10">

        {/* Badge */}
        <motion.div
          ref={badgeRef}
          className="inline-flex items-center gap-2 bg-card border border-border rounded-full py-2 px-[18px] text-xs font-bold text-sky-accent mb-8 shadow-sky"
          variants={heroVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          transition={transition(0.0)}
        >
          <span className="w-2 h-2 rounded-full bg-sky-accent animate-pulse-dot" />
          Now with AI Emotional Coach
        </motion.div>

        {/* Headline */}
        <motion.h1
          ref={headingRef}
          className="text-[clamp(2.8rem,5vw,4.5rem)] leading-[1.1] text-dark mb-6"
          variants={heroVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          transition={transition(0.12, 1.0)}
        >
          A gentle space to{" "}
          <span className="gradient-text">understand</span>
          <br />your emotions.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          ref={subRef}
          className="text-[1.1rem] text-mid leading-[1.8] mb-10 font-normal"
          variants={heroVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          transition={transition(0.26, 0.9)}
        >
          Uhum is a private reflection app that helps you check in daily,
          speak your thoughts, and notice emotional patterns over time.
          <br /><br />
          No pressure. No performance tracking. Just awareness.
        </motion.p>

        {/* CTA buttons (staggered individually) */}
        <motion.div
          ref={btnsRef}
          className="flex gap-4 flex-wrap"
          variants={{ hidden: {}, show: {} }}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
        >
          <motion.button
            onClick={onOpenModal}
            className="btn-emo-primary"
            variants={heroVariants}
            transition={transition(0.40, 0.85)}
          >
            Discover Your UHUM →
          </motion.button>
          <motion.button
            onClick={() => scrollTo("how-it-works")}
            className="btn-emo-secondary"
            variants={heroVariants}
            transition={transition(0.52, 0.85)}
          >
            See How It Works
          </motion.button>
        </motion.div>


      </div>

      {/* ── Right: floating profile card ─────────────────────── */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[420px] hidden lg:block">
        <motion.div
          ref={cardRef}
          className="bg-card rounded-[20px] p-6 shadow-elevated border border-border animate-float-card"
          variants={heroVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          transition={transition(0.55, 1.0)}
        >
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-[50px] h-[50px] rounded-full gradient-primary flex items-center justify-center text-[1.4rem]">
              🧬
            </div>
            <div>
              <div className="text-sm font-bold text-dark">Your UHUM Profile</div>
              <div className="text-xs text-soft">The Reflective Processor</div>
            </div>
          </div>
          <div className="font-display text-[1.8rem] font-bold text-dark text-center mb-4">78/100</div>
          <div className="flex flex-col gap-2.5">
            {DIMENSIONS.slice(0, 5).map(d => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="text-[0.75rem] font-semibold text-mid w-[85px]">{d.name}</span>
                <div className="flex-1 h-2 rounded bg-sky overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${d.score}%`,
                      background: d.color,
                      transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                </div>
                <span className="text-[0.78rem] font-bold text-sky-accent">{d.score}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
