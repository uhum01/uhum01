import CalmModeToggle from "@/components/emodna/CalmModeToggle";

interface NavbarProps {
  onOpenModal: () => void;
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar({ onOpenModal }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/92 backdrop-blur-xl border-b border-border px-[5%] flex items-center justify-between h-[70px] shadow-sky">
      <div className="font-display text-[1.8rem] font-bold gradient-logo tracking-tight">
        UHUM<span className="text-sm ml-0.5">✦</span>
      </div>

      <ul className="hidden md:flex gap-8 list-none">
        {['Features', 'How It Works', 'Dashboard', 'Pricing'].map(l => (
          <li key={l}>
            <button
              onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
              className="text-mid text-sm font-semibold hover:text-sky-accent transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              {l}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {/* ── Deep Calm Mode Toggle ── */}
        <CalmModeToggle />

        <button
          onClick={onOpenModal}
          className="gradient-primary text-primary-foreground border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer font-body transition-all duration-300 shadow-sky hover:-translate-y-0.5 hover:shadow-sky-lg"
        >
          Start Free →
        </button>
      </div>
    </nav>
  );
}
