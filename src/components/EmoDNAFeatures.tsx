import { useRef, useEffect, useState, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sky:        #E8F4FD;
    --sky-mid:    #C5E3F7;
    --sky-deep:   #7EC8E3;
    --sky-acc:    #4AAFDA;
    --peach:      #FFF0E8;
    --peach-mid:  #FFD5BC;
    --peach-acc:  #F4A57A;
    --peach-deep: #E8845A;
    --mint:       #E8F8F2;
    --mint-acc:   #6ECBA8;
    --lav:        #EEE8F8;
    --lav-acc:    #B8A4E0;
    --rose:       #FFF0F3;
    --rose-acc:   #F9A8C0;
    --gold:       #FFF8E8;
    --gold-acc:   #F0C060;
    --white:      #FDFEFF;
    --soft:       #F7FBFF;
    --td:         #2C3E5A;
    --tm:         #4A6080;
    --ts:         #7A92AA;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--white);
    color: var(--td);
    overflow-x: hidden;
  }

  /* ─── HERO LABEL ───────────────────────────── */
  .page-header {
    padding: 72px 5% 48px;
    text-align: center;
    background: linear-gradient(160deg, var(--white) 0%, var(--sky) 50%, var(--peach) 100%);
    position: relative;
    overflow: hidden;
  }

  .page-header::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 600px 400px at 80% 20%, rgba(126,200,227,.18), transparent),
      radial-gradient(ellipse 400px 300px at 10% 80%, rgba(244,165,122,.12), transparent);
    pointer-events: none;
  }

  .pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: white; border: 1px solid var(--sky-mid);
    border-radius: 50px; padding: 7px 18px;
    font-size: .78rem; font-weight: 800; color: var(--sky-acc);
    letter-spacing: .5px; text-transform: uppercase;
    box-shadow: 0 2px 12px rgba(74,175,218,.12);
    margin-bottom: 1.4rem;
  }
  .pill-dot { width:8px; height:8px; border-radius:50%; background:var(--sky-acc); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  .page-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem,5vw,4rem);
    line-height: 1.12; color: var(--td);
    margin-bottom: 1rem;
  }
  .page-header h1 em {
    font-style: italic;
    background: linear-gradient(135deg, var(--sky-acc), var(--peach-acc));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .page-header p {
    font-size: 1.05rem; color: var(--tm); max-width: 540px;
    margin: 0 auto 2.5rem; line-height: 1.8;
  }

  .hint {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .82rem; color: var(--ts); font-weight: 600;
    animation: fadeUp .8s 1s ease both;
  }
  .hint svg { width:18px; height:18px; fill:none; stroke:var(--ts); stroke-width:2; stroke-linecap:round; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* ─── MARQUEE WRAPPER ─────────────────────── */
  .marquee-section {
    padding: 16px 0 64px;
    background: var(--white);
    display: flex; flex-direction: column; gap: 24px;
  }

  .marquee-row {
    position: relative;
    overflow: hidden;
    cursor: grab;
    user-select: none;
    padding: 8px 0;
  }
  .marquee-row:active { cursor: grabbing; }

  /* fade edges */
  .marquee-row::before,
  .marquee-row::after {
    content: '';
    position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2;
    pointer-events: none;
  }
  .marquee-row::before { left:0;  background: linear-gradient(90deg, var(--white), transparent); }
  .marquee-row::after  { right:0; background: linear-gradient(-90deg, var(--white), transparent); }

  .marquee-track {
    display: flex; gap: 20px;
    width: max-content;
    will-change: transform;
  }

  /* ─── FEATURE CARD ────────────────────────── */
  .fc {
    flex-shrink: 0;
    width: 300px;
    border-radius: 22px;
    padding: 28px 26px 24px;
    border: 1.5px solid transparent;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,.05);
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
    position: relative; overflow: hidden;
  }

  .fc::after {
    content: '';
    position: absolute; inset: 0; border-radius: 22px;
    opacity: 0; transition: opacity .35s;
    pointer-events: none;
  }

  .fc:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 40px rgba(0,0,0,.10);
  }
  .fc:hover::after { opacity: 1; }

  /* colour variants */
  .fc.sky   { border-color: var(--sky-mid);   } .fc.sky::after   { background: linear-gradient(135deg,rgba(232,244,253,.6),rgba(197,227,247,.25)); }
  .fc.peach { border-color: var(--peach-mid); } .fc.peach::after { background: linear-gradient(135deg,rgba(255,240,232,.6),rgba(255,213,188,.25)); }
  .fc.mint  { border-color: #B8E8D4;          } .fc.mint::after  { background: linear-gradient(135deg,rgba(232,248,242,.6),rgba(110,203,168,.1)); }
  .fc.lav   { border-color: var(--lav-acc);   } .fc.lav::after   { background: linear-gradient(135deg,rgba(238,232,248,.6),rgba(184,164,224,.1)); }
  .fc.rose  { border-color: var(--rose-acc);  } .fc.rose::after  { background: linear-gradient(135deg,rgba(255,240,243,.6),rgba(249,168,192,.1)); }
  .fc.gold  { border-color: var(--gold-acc);  } .fc.gold::after  { background: linear-gradient(135deg,rgba(255,248,232,.6),rgba(240,192,96,.1)); }

  .fc:hover.sky   { border-color: var(--sky-acc);   box-shadow: 0 16px 40px rgba(74,175,218,.14); }
  .fc:hover.peach { border-color: var(--peach-acc); box-shadow: 0 16px 40px rgba(244,165,122,.14); }
  .fc:hover.mint  { border-color: var(--mint-acc);  box-shadow: 0 16px 40px rgba(110,203,168,.14); }
  .fc:hover.lav   { border-color: var(--lav-acc);   box-shadow: 0 16px 40px rgba(184,164,224,.18); }
  .fc:hover.rose  { border-color: var(--rose-acc);  box-shadow: 0 16px 40px rgba(249,168,192,.14); }
  .fc:hover.gold  { border-color: var(--gold-acc);  box-shadow: 0 16px 40px rgba(240,192,96,.14); }

  .fc-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 1.1rem; flex-shrink: 0;
  }
  .sky  .fc-icon-wrap { background: var(--sky);   }
  .peach .fc-icon-wrap{ background: var(--peach); }
  .mint  .fc-icon-wrap{ background: var(--mint);  }
  .lav   .fc-icon-wrap{ background: var(--lav);   }
  .rose  .fc-icon-wrap{ background: var(--rose);  }
  .gold  .fc-icon-wrap{ background: var(--gold);  }

  .fc-tag {
    font-size: .68rem; font-weight: 800; letter-spacing: .8px;
    text-transform: uppercase; border-radius: 50px;
    padding: 3px 11px; display: inline-block; margin-bottom: .85rem;
  }
  .sky  .fc-tag { background:var(--sky);   color:var(--sky-acc);   }
  .peach .fc-tag{ background:var(--peach); color:var(--peach-deep);}
  .mint  .fc-tag{ background:var(--mint);  color:var(--mint-acc);  }
  .lav   .fc-tag{ background:var(--lav);   color:var(--lav-acc);   }
  .rose  .fc-tag{ background:var(--rose);  color:#D4608A;          }
  .gold  .fc-tag{ background:var(--gold);  color:#B8860B;          }

  .fc h3 { font-size: .98rem; font-weight: 800; color: var(--td); margin-bottom: .55rem; line-height:1.35; }
  .fc p  { font-size: .82rem; color: var(--ts); line-height: 1.75; }

  .fc-dots {
    display: flex; gap: 6px; margin-top: 1.2rem;
  }
  .fc-dot {
    width: 6px; height: 6px; border-radius: 50%; opacity: .45;
  }
  .sky  .fc-dot { background:var(--sky-acc);   }
  .peach .fc-dot{ background:var(--peach-acc); }
  .mint  .fc-dot{ background:var(--mint-acc);  }
  .lav   .fc-dot{ background:var(--lav-acc);   }
  .rose  .fc-dot{ background:#D4608A;          }
  .gold  .fc-dot{ background:var(--gold-acc);  }
  .fc-dot:first-child { opacity:1; }

  /* ─── BOTTOM CTA ──────────────────────────── */
  .cta-bar {
    text-align: center;
    padding: 64px 5% 80px;
    background: linear-gradient(160deg, var(--sky) 0%, var(--peach) 100%);
  }
  .cta-bar h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem,3.5vw,2.8rem);
    color: var(--td); margin-bottom: 1rem;
  }
  .cta-bar p { font-size:.95rem; color:var(--tm); margin-bottom:2rem; }
  .btn-p {
    background: linear-gradient(135deg,var(--sky-acc),var(--sky-deep));
    color: white; border: none; padding: 14px 36px;
    border-radius: 50px; font-size: 1rem; font-weight: 800;
    cursor: pointer; font-family:'Nunito',sans-serif;
    box-shadow: 0 8px 24px rgba(74,175,218,.25);
    transition: all .3s;
  }
  .btn-p:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(74,175,218,.3); }

  /* row label */
  .row-label {
    padding: 0 5%;
    font-size: .75rem; font-weight: 800; color: var(--ts);
    letter-spacing: 1.2px; text-transform: uppercase;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 10px;
  }
  .row-label::after {
    content:''; flex:1; height:1px; background:var(--sky-mid);
  }
`;

/* ─── DATA ──────────────────────────────────────────────────── */
const ROWS = [
  {
    label: "UHUM Core",
    dir: -1,
    speed: 0.55,
    cards: [
      { color:"sky",   icon:"🧬", tag:"Assessment",  title:"UHUM Assessment",          desc:"5-step structured evaluation mapping triggers, resilience, stress response, cognitive patterns and mood stability into your unique fingerprint." },
      { color:"sky",   icon:"🕸️", tag:"Profile",     title:"7-Dimension Radar Chart",     desc:"Hexagonal spider chart visualising all emotional dimensions at once — your living emotional map, updated every week." },
      { color:"sky",   icon:"🏷️", tag:"Identity",    title:"Dominant Emotion Type Badge", desc:"Assigned a personality archetype like 'The Reflective Processor' or 'The Adaptive Warrior' based on your UHUM." },
      { color:"sky",   icon:"📊", tag:"Score",       title:"UHUM Score 0–100",          desc:"Overall emotional health score that evolves as you complete exercises, check-ins, and growth milestones." },
      { color:"sky",   icon:"🔄", tag:"Growth",      title:"Monthly Re-Assessment",       desc:"Retake assessments every month to see exactly how your emotional profile has shifted and grown." },
      { color:"sky",   icon:"📄", tag:"Certificate", title:"UHUM Certificate",          desc:"Downloadable, beautifully designed certificate showcasing your profile, top strengths, and growth milestones." },
      { color:"sky",   icon:"🔬", tag:"Deep Dive",   title:"Cognitive Pattern Mapping",   desc:"Detects your top 3 cognitive distortions — catastrophizing, perfectionism, people-pleasing — and matches reframes." },
      { color:"sky",   icon:"💡", tag:"Insight",     title:"Daily Insight Cards",         desc:"Morning emotional insight based on your last check-in, historical patterns, and today's emotional forecast." },
    ],
  },
  {
    label: "Analytics & Dashboard",
    dir: 1,
    speed: 0.45,
    cards: [
      { color:"peach", icon:"📈", tag:"Trends",      title:"7-Day Emotional Trend Chart", desc:"Three simultaneous lines — mood, stress, resilience — with hover tooltips revealing personalised insights per day." },
      { color:"peach", icon:"🗓️", tag:"Heatmap",     title:"30-Day Emotion Heatmap",      desc:"Full-month colour-coded calendar showing your emotional highs and lows — red to green at a glance." },
      { color:"peach", icon:"🎯", tag:"Triggers",    title:"Trigger Frequency Analysis",  desc:"Bar charts revealing which emotional triggers fire most often and what time of day, so you can prepare ahead." },
      { color:"peach", icon:"🔮", tag:"Predictive",  title:"Predictive Emotion Engine",   desc:"Forecasts emotionally challenging days 24–48 hrs in advance and generates a proactive coping plan for you." },
      { color:"peach", icon:"⚡", tag:"Response",    title:"Response Style Donut Chart",  desc:"Visual breakdown of your Fight / Flight / Freeze / Flow response patterns across the current week." },
      { color:"peach", icon:"📉", tag:"Progress",    title:"Weekly UHUM Shift Report",  desc:"Before-and-after comparison showing which of the 7 emotional dimensions improved or declined each week." },
      { color:"peach", icon:"🔗", tag:"Correlation", title:"Emotion-Sleep Correlation",   desc:"Automatically connects sleep quality and duration from wearables to your daily emotional performance scores." },
      { color:"peach", icon:"📋", tag:"Report",      title:"Monthly PDF Summary",         desc:"Auto-generated beautiful PDF report of your month's emotional journey — shareable with your therapist." },
    ],
  },
  {
    label: "Growth, Therapy & AI",
    dir: -1,
    speed: 0.60,
    cards: [
      { color:"mint",  icon:"🗺️", tag:"Roadmap",    title:"Personalised Growth Roadmap", desc:"4-week visual timeline with daily tasks, CBT exercises, and progress milestones matched exactly to your UHUM." },
      { color:"mint",  icon:"📝", tag:"CBT",         title:"Interactive Thought Record",  desc:"Digital CBT worksheet — log situation, thought, and emotion, and receive a personalised cognitive reframe instantly." },
      { color:"mint",  icon:"🌿", tag:"Somatic",     title:"Somatic Exercise Library",    desc:"Body-based exercises — tapping, progressive relaxation, grounding sequences — matched to your stress style." },
      { color:"mint",  icon:"🫁", tag:"Breathwork",  title:"Animated Breathwork Guide",   desc:"Visual breathing circle guiding Box, 4-7-8, Coherence, and Wim Hof techniques with countdown timers." },
      { color:"mint",  icon:"📔", tag:"Journal",     title:"Smart Emotion Journal",       desc:"Free-form journaling with NLP analysis auto-detecting emotional themes, distortions, and growth moments." },
      { color:"mint",  icon:"🤖", tag:"AI Coach",    title:"AI Coach 'Emo'",              desc:"24/7 personalised AI coach that knows your UHUM and delivers CBT prompts, exercises, and emotional support." },
      { color:"mint",  icon:"🎙️", tag:"Voice AI",    title:"Voice Emotion Detection",     desc:"Record a 30-second voice note; AI analyses tone and speech to detect stress, sadness, or calm accurately." },
      { color:"mint",  icon:"🧩", tag:"Programs",    title:"CBT & ACT Journey Programs",  desc:"Structured 4-week self-help programs using evidence-based CBT and ACT techniques, guided step by step." },
    ],
  },
  {
    label: "Mindfulness, Sleep & Community",
    dir: 1,
    speed: 0.50,
    cards: [
      { color:"lav",   icon:"🧘", tag:"Meditation",  title:"Adaptive Meditation Sessions",desc:"Meditations that adapt to your emotional state each day — a responsive library, not a fixed one." },
      { color:"lav",   icon:"😴", tag:"Sleep",       title:"Sleep Soundscapes & Casts",   desc:"Forest rain, ocean waves, white noise, and fireplace sounds with a 7-day sleep quality tracker." },
      { color:"lav",   icon:"🌙", tag:"Ritual",      title:"Bedtime Wind-Down Routine",   desc:"Guided 15-minute bedtime sequence personalised to your stress profile to improve sleep onset and quality." },
      { color:"lav",   icon:"🤝", tag:"Community",   title:"Trusted Circle Sharing",      desc:"Selectively share progress snapshots, emotional trends, and trigger insights with up to 5 trusted people." },
      { color:"lav",   icon:"👨‍⚕️", tag:"Therapy",  title:"Therapist Portal Access",     desc:"Invite your therapist to view your UHUM dashboard — giving professionals meaningful data for better sessions." },
      { color:"lav",   icon:"⌚", tag:"Wearables",   title:"Wearable Integration",        desc:"Connect Apple Watch, Fitbit, or Oura Ring to incorporate HRV and sleep data into your UHUM analytics." },
      { color:"lav",   icon:"📢", tag:"Challenges",  title:"Monthly Group Challenges",    desc:"Themed monthly emotional challenges like 'Trigger Awareness Week' with safe community progress tracking." },
      { color:"lav",   icon:"👨‍👩‍👧", tag:"Family",  title:"Family Emotional Literacy",  desc:"Parents track children's (ages 8–16) emotional patterns with age-appropriate assessments and insights." },
    ],
  },
  {
    label: "Badges, Education & Rewards",
    dir: -1,
    speed: 0.55,
    cards: [
      { color:"rose",  icon:"🏅", tag:"Badge",       title:"Cognitive Flexibility Badge", desc:"Earned by successfully reframing 10 negative thought patterns using the CBT tools in the app." },
      { color:"rose",  icon:"💪", tag:"Badge",       title:"Stress Recovery Pro Badge",   desc:"Awarded after demonstrating fast recovery from 5 high-stress events tracked in your personal dashboard." },
      { color:"rose",  icon:"⚖️", tag:"Badge",       title:"Emotional Balance Badge",     desc:"Earned by maintaining mood stability scores above 70 for 7 consecutive days without a break." },
      { color:"rose",  icon:"🌟", tag:"Badge",       title:"UHUM Elite Badge",          desc:"Reach an overall UHUM score of 90+ — the ultimate recognition of your emotional growth journey." },
      { color:"gold",  icon:"📚", tag:"Education",   title:"Psychoeducation Library",     desc:"50+ CBT / ACT-based short modules on emotions, resilience, relationships, and stress — matched to your profile." },
      { color:"gold",  icon:"🎓", tag:"Learning",    title:"Video Lesson Series",         desc:"5-minute video lessons from licensed therapists and psychologists on key emotional wellness topics." },
      { color:"gold",  icon:"🛋️", tag:"Marketplace", title:"Therapist Marketplace",       desc:"Browse and book sessions with licensed therapists matched to your UHUM profile and specific issues." },
      { color:"gold",  icon:"🆘", tag:"Safety",      title:"Crisis Support Detection",    desc:"Sensitive language monitoring with immediate display of helpline resources and safety guidance when needed." },
    ],
  },
];

/* ─── DRAGGABLE MARQUEE ROW ─────────────────────────────────── */
function MarqueeRow({ row }) {
  const trackRef = useRef(null);
  const animRef  = useRef(null);
  const posRef   = useRef(0);
  const dragRef  = useRef({ active: false, startX: 0, startPos: 0 });
  const pauseRef = useRef(false);

  // Build duplicated cards (3× for seamless loop)
  const cards = [...row.cards, ...row.cards, ...row.cards];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const CARD_W   = 300 + 20; // card width + gap
    const SET_W    = row.cards.length * CARD_W;
    const SPEED    = row.speed;
    const DIR      = row.dir; // -1 = left, 1 = right

    // Start from middle set so loop works both ways
    posRef.current = DIR === -1 ? 0 : -SET_W;

    let lastTime = null;

    const tick = (time) => {
      if (!pauseRef.current) {
        const dt = lastTime ? Math.min(time - lastTime, 50) : 16;
        posRef.current += DIR * SPEED * (dt / 16);

        // Seamless loop
        if (DIR === -1 && posRef.current < -SET_W) posRef.current += SET_W;
        if (DIR ===  1 && posRef.current > 0)       posRef.current -= SET_W;
      }
      lastTime = time;
      track.style.transform = `translateX(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* Mouse drag */
  const onMouseDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current };
    pauseRef.current = true;
  };

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    posRef.current = dragRef.current.startPos + dx;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current.active = false;
    // Resume auto-scroll after 1.2s pause so user can "release"
    setTimeout(() => { pauseRef.current = false; }, 1200);
  }, []);

  /* Touch drag */
  const onTouchStart = (e) => {
    dragRef.current = { active: true, startX: e.touches[0].clientX, startPos: posRef.current };
    pauseRef.current = true;
  };

  const onTouchMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const dx = e.touches[0].clientX - dragRef.current.startX;
    posRef.current = dragRef.current.startPos + dx;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  }, []);

  const onTouchEnd = useCallback(() => {
    dragRef.current.active = false;
    setTimeout(() => { pauseRef.current = false; }, 1200);
  }, []);

  /* Hover pause */
  const onEnter = () => { pauseRef.current = true; };
  const onLeave = () => { if (!dragRef.current.active) pauseRef.current = false; };

  return (
    <div
      className="marquee-row"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={onEnter}
    >
      <div className="marquee-track" ref={trackRef}>
        {cards.map((c, i) => (
          <div key={i} className={`fc ${c.color}`}>
            <div className="fc-icon-wrap">{c.icon}</div>
            <div className="fc-tag">{c.tag}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <div className="fc-dots">
              <div className="fc-dot" />
              <div className="fc-dot" />
              <div className="fc-dot" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function UHUMFeatures() {
  return (
    <>
      <style>{css}</style>

      {/* Header */}
      <header className="page-header">
        <div className="pill"><div className="pill-dot" />48+ Features Inside</div>
        <h1>Everything You Need to<br /><em>Understand Your Emotions</em></h1>
        <p>
          UHUM is a complete emotional intelligence ecosystem — from deep assessments
          and AI coaching to sleep tools, therapy bridges, and meaningful achievements.
        </p>
        <div className="hint">
          <svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7"/></svg>
          Drag any row left or right &nbsp;·&nbsp; Hover to pause
        </div>
      </header>

      {/* Marquee rows */}
      <section className="marquee-section">
        {ROWS.map((row, ri) => (
          <div key={ri}>
            <div className="row-label">{row.label}</div>
            <MarqueeRow row={row} />
          </div>
        ))}
      </section>

      {/* CTA */}
      <div className="cta-bar">
        <h2>Ready to Map Your<br />Emotional DNA?</h2>
        <p>Join 50,000+ people who've discovered their emotional fingerprint and started growing.</p>
        <button className="btn-p">Discover Your UHUM — Free →</button>
      </div>
    </>
  );
}
