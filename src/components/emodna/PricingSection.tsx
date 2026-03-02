import { PRICING_PLANS } from "./data";
import { use3DScroll, use3DChildrenReveal } from "@/hooks/use3DScroll";

interface PricingSectionProps {
  onOpenModal: () => void;
}

export default function PricingSection({ onOpenModal }: PricingSectionProps) {
  const headerRef = use3DScroll<HTMLDivElement>({ variant: "flip-up", threshold: 0.1 });
  const cardsRef = use3DChildrenReveal<HTMLDivElement>({ variant: "tilt-right", stagger: 130, threshold: 0.08 });

  return (
    <section id="pricing" className="py-[90px] px-[5%] bg-soft-white">
      <div ref={headerRef}>
        <span className="section-tag section-tag-mint">Pricing</span>
        <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] text-dark leading-[1.2] mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base text-soft leading-[1.8] max-w-[550px]">
          Start free. Upgrade when you're ready for the full emotional growth experience.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 mt-12">
        {PRICING_PLANS.map(p => (
          <div
            key={p.plan}
            className={`rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-1.5 ${p.featured
                ? 'gradient-primary text-primary-foreground border-transparent shadow-sky-lg scale-[1.03]'
                : 'bg-card text-foreground border-border'
              }`}
          >
            {p.badge && (
              <span className={`rounded-full py-1 px-3.5 text-[0.75rem] font-extrabold inline-block mb-4 ${p.featured ? 'bg-primary-foreground/25 text-primary-foreground' : 'bg-peach-mid text-peach-deep'
                }`}>
                {p.badge}
              </span>
            )}
            <div className={`text-base font-bold mb-2 ${p.featured ? '' : 'text-dark'}`}>{p.plan}</div>
            <div className={`font-display text-[2.8rem] font-bold mb-2 ${p.featured ? '' : 'text-dark'}`}>{p.price}</div>
            <div className={`text-sm ${p.featured ? 'opacity-80' : 'text-soft'}`}>{p.per}</div>
            <ul className="list-none my-6 flex flex-col gap-2.5">
              {p.features.map(f => (
                <li key={f} className={`text-[0.85rem] flex items-center gap-2.5 ${p.featured ? 'opacity-90' : 'text-mid'}`}>
                  <span className={`font-extrabold ${p.featured ? '' : 'text-mint-accent'}`}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onOpenModal}
              className={`w-full py-3 rounded-full font-body font-bold text-[0.95rem] cursor-pointer transition-all duration-300 border-2 ${p.featured
                  ? 'bg-card text-sky-accent border-card hover:bg-card/90'
                  : 'bg-card text-dark border-border hover:bg-sky'
                }`}
            >
              {p.featured ? 'Get Started →' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
