export default function FloatingElements({ variant = 'sky' }: { variant?: 'sky' | 'peach' | 'mixed' }) {
  const colors = {
    sky: {
      circle1: 'hsl(197 63% 57% / 0.12)',
      circle2: 'hsl(204 73% 95% / 0.6)',
      circle3: 'hsl(195 67% 69% / 0.15)',
      hex: 'hsl(205 76% 87% / 0.3)',
      dot: 'hsl(197 63% 57% / 0.2)',
    },
    peach: {
      circle1: 'hsl(20 85% 72% / 0.12)',
      circle2: 'hsl(24 100% 95% / 0.6)',
      circle3: 'hsl(24 100% 87% / 0.15)',
      hex: 'hsl(20 85% 72% / 0.2)',
      dot: 'hsl(20 75% 63% / 0.2)',
    },
    mixed: {
      circle1: 'hsl(197 63% 57% / 0.1)',
      circle2: 'hsl(24 100% 93% / 0.5)',
      circle3: 'hsl(155 44% 78% / 0.15)',
      hex: 'hsl(262 45% 76% / 0.2)',
      dot: 'hsl(20 85% 72% / 0.18)',
    },
  };

  const c = colors[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating circles */}
      <div
        className="absolute w-[180px] h-[180px] rounded-full animate-float-el-1"
        style={{ background: `radial-gradient(circle, ${c.circle1}, transparent 70%)`, top: '10%', left: '5%' }}
      />
      <div
        className="absolute w-[120px] h-[120px] rounded-full animate-float-el-2"
        style={{ background: `radial-gradient(circle, ${c.circle2}, transparent 70%)`, top: '20%', right: '8%' }}
      />
      <div
        className="absolute w-[220px] h-[220px] rounded-full animate-float-el-3"
        style={{ background: `radial-gradient(circle, ${c.circle3}, transparent 70%)`, bottom: '5%', right: '15%' }}
      />

      {/* Hexagon shapes */}
      <svg className="absolute animate-float-el-2 w-12 h-12" style={{ top: '15%', right: '20%' }} viewBox="0 0 50 50">
        <polygon points="25,2 47,14 47,36 25,48 3,36 3,14" fill="none" stroke={c.hex} strokeWidth="1.5" />
      </svg>
      <svg className="absolute animate-float-el-1 w-8 h-8" style={{ bottom: '25%', right: '10%' }} viewBox="0 0 50 50">
        <polygon points="25,2 47,14 47,36 25,48 3,36 3,14" fill="none" stroke={c.hex} strokeWidth="1.5" />
      </svg>

      {/* Small floating dots */}
      <div className="absolute w-3 h-3 rounded-full animate-float-el-3" style={{ background: c.dot, top: '30%', left: '15%' }} />
      <div className="absolute w-2 h-2 rounded-full animate-float-el-1" style={{ background: c.dot, top: '60%', left: '25%' }} />
      <div className="absolute w-4 h-4 rounded-full animate-float-el-2" style={{ background: c.dot, bottom: '20%', left: '40%' }} />
      <div className="absolute w-2.5 h-2.5 rounded-full animate-float-el-3" style={{ background: c.dot, top: '45%', right: '30%' }} />

      {/* Diamond shapes */}
      <div
        className="absolute w-4 h-4 rotate-45 animate-float-el-1"
        style={{ border: `1.5px solid ${c.hex}`, top: '50%', left: '8%' }}
      />
      <div
        className="absolute w-3 h-3 rotate-45 animate-float-el-2"
        style={{ border: `1.5px solid ${c.hex}`, top: '70%', right: '25%' }}
      />

      {/* Pentagon / star accent */}
      <svg className="absolute animate-float-el-3 w-5 h-5" style={{ top: '40%', right: '5%' }} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="4" fill="none" stroke={c.dot} strokeWidth="1" />
      </svg>
    </div>
  );
}
