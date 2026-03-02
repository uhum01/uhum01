import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --sky: #E8F4FD;
    --sky-mid: #C5E3F7;
    --sky-deep: #7EC8E3;
    --sky-accent: #4AAFDA;
    --peach: #FFF0E8;
    --peach-mid: #FFD5BC;
    --peach-accent: #F4A57A;
    --peach-deep: #E8845A;
    --white: #FDFEFF;
    --soft-white: #F7FBFF;
    --lavender: #EEE8F8;
    --lavender-accent: #B8A4E0;
    --mint: #E8F8F2;
    --mint-accent: #6ECBA8;
    --text-dark: #2C3E5A;
    --text-mid: #4A6080;
    --text-soft: #7A92AA;
    --shadow-sky: rgba(78, 175, 218, 0.15);
    --shadow-peach: rgba(244, 165, 122, 0.15);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--white);
    color: var(--text-dark);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--sky); }
  ::-webkit-scrollbar-thumb { background: var(--sky-accent); border-radius: 3px; }

  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(253, 254, 255, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--sky-mid);
    padding: 0 5%;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
    box-shadow: 0 2px 20px var(--shadow-sky);
  }

  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 700;
    background: linear-gradient(135deg, var(--sky-accent), var(--peach-accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex; gap: 2rem; list-style: none;
  }

  .nav-links a {
    text-decoration: none; color: var(--text-mid);
    font-size: 0.9rem; font-weight: 600;
    transition: color 0.3s;
    cursor: pointer;
  }

  .nav-links a:hover { color: var(--sky-accent); }

  .nav-cta {
    background: linear-gradient(135deg, var(--sky-accent), var(--sky-deep));
    color: white; border: none; padding: 10px 24px;
    border-radius: 50px; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: all 0.3s; box-shadow: 0 4px 15px var(--shadow-sky);
  }

  .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px var(--shadow-sky); }

  /* HERO */
  .hero {
    min-height: 100vh;
    background: linear-gradient(160deg, var(--white) 0%, var(--sky) 40%, var(--peach) 100%);
    display: flex; align-items: center;
    padding: 100px 5% 60px;
    position: relative; overflow: hidden;
  }

  .hero-bg-circle {
    position: absolute; border-radius: 50%;
    pointer-events: none;
  }

  .hero-bg-circle-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(126,200,227,0.2), transparent 70%);
    top: -100px; right: -100px;
    animation: float1 8s ease-in-out infinite;
  }

  .hero-bg-circle-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(244,165,122,0.15), transparent 70%);
    bottom: -50px; left: 10%;
    animation: float2 10s ease-in-out infinite;
  }

  @keyframes float1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-30px, 30px) scale(1.05); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(20px, -20px); }
  }

  .hero-content {
    max-width: 600px; position: relative; z-index: 1;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: white; border: 1px solid var(--sky-mid);
    border-radius: 50px; padding: 8px 18px;
    font-size: 0.8rem; font-weight: 700; color: var(--sky-accent);
    margin-bottom: 2rem;
    box-shadow: 0 2px 12px var(--shadow-sky);
    animation: fadeDown 0.8s ease both;
  }

  .hero-badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--sky-accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
  }

  .hero h1 {
    font-size: clamp(2.8rem, 5vw, 4.5rem);
    line-height: 1.1; color: var(--text-dark);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.8s 0.2s ease both;
  }

  .hero h1 span {
    background: linear-gradient(135deg, var(--sky-accent), var(--peach-accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .hero-sub {
    font-size: 1.1rem; color: var(--text-mid);
    line-height: 1.8; margin-bottom: 2.5rem;
    font-weight: 400;
    animation: fadeUp 0.8s 0.4s ease both;
  }

  .hero-btns {
    display: flex; gap: 1rem; flex-wrap: wrap;
    animation: fadeUp 0.8s 0.6s ease both;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--sky-accent), var(--sky-deep));
    color: white; border: none; padding: 14px 32px;
    border-radius: 50px; font-size: 1rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: all 0.3s; box-shadow: 0 6px 20px var(--shadow-sky);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 30px var(--shadow-sky); }

  .btn-secondary {
    background: white; color: var(--text-dark);
    border: 1.5px solid var(--sky-mid); padding: 14px 32px;
    border-radius: 50px; font-size: 1rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: all 0.3s;
  }
  .btn-secondary:hover { border-color: var(--sky-accent); color: var(--sky-accent); transform: translateY(-2px); }

  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 3.5rem; flex-wrap: wrap;
    animation: fadeUp 0.8s 0.8s ease both;
  }

  .hero-stat-item { text-align: center; }
  .hero-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 700; color: var(--text-dark);
    display: block;
  }
  .hero-stat-label { font-size: 0.78rem; color: var(--text-soft); font-weight: 600; }

  .hero-visual {
    position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
    width: 420px;
  }

  .hero-card-float {
    background: white; border-radius: 20px;
    padding: 24px; box-shadow: 0 20px 60px rgba(78,175,218,0.12);
    border: 1px solid var(--sky-mid);
    animation: floatCard 6s ease-in-out infinite;
  }

  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  .dna-profile-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
  }

  .dna-avatar {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sky-mid), var(--peach-mid));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
  }

  .dna-score-ring {
    width: 100px; height: 100px; margin: 0 auto 16px;
    position: relative; display: flex; align-items: center; justify-content: center;
  }

  .dna-score-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 700; color: var(--text-dark);
    text-align: center;
  }

  .dna-bars { display: flex; flex-direction: column; gap: 10px; }
  .dna-bar-row { display: flex; align-items: center; gap: 10px; }
  .dna-bar-label { font-size: 0.75rem; font-weight: 600; color: var(--text-mid); width: 85px; }
  .dna-bar-track {
    flex: 1; height: 8px; border-radius: 4px; background: var(--sky);
    overflow: hidden;
  }
  .dna-bar-fill {
    height: 100%; border-radius: 4px;
    transition: width 1.5s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SECTIONS */
  section { padding: 90px 5%; }

  .section-tag {
    display: inline-block;
    background: var(--sky); color: var(--sky-accent);
    border-radius: 50px; padding: 6px 16px;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; margin-bottom: 1rem;
  }

  .section-tag.peach { background: var(--peach); color: var(--peach-deep); }
  .section-tag.mint { background: var(--mint); color: var(--mint-accent); }
  .section-tag.lavender { background: var(--lavender); color: var(--lavender-accent); }

  .section-title {
    font-size: clamp(2rem, 3.5vw, 3rem);
    color: var(--text-dark); line-height: 1.2;
    margin-bottom: 1rem;
  }

  .section-sub {
    font-size: 1rem; color: var(--text-soft);
    line-height: 1.8; max-width: 550px;
  }

  /* FEATURES OVERVIEW */
  .features-overview {
    background: var(--soft-white);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem; margin-top: 3rem;
  }

  .feature-card {
    background: white; border-radius: 20px;
    padding: 30px; border: 1.5px solid transparent;
    transition: all 0.4s; cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    position: relative; overflow: hidden;
  }

  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 20px; opacity: 0; transition: opacity 0.4s;
    pointer-events: none;
  }

  .feature-card.sky::before { background: linear-gradient(135deg, rgba(232,244,253,0.5), rgba(197,227,247,0.3)); }
  .feature-card.peach::before { background: linear-gradient(135deg, rgba(255,240,232,0.5), rgba(255,213,188,0.3)); }
  .feature-card.mint::before { background: linear-gradient(135deg, rgba(232,248,242,0.5), rgba(110,203,168,0.1)); }
  .feature-card.lavender::before { background: linear-gradient(135deg, rgba(238,232,248,0.5), rgba(184,164,224,0.1)); }

  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .feature-card:hover::before { opacity: 1; }
  .feature-card.sky:hover { border-color: var(--sky-mid); }
  .feature-card.peach:hover { border-color: var(--peach-mid); }
  .feature-card.mint:hover { border-color: #B8E8D4; }
  .feature-card.lavender:hover { border-color: var(--lavender-accent); }

  .feature-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 1.2rem;
  }

  .feature-icon.sky { background: var(--sky); }
  .feature-icon.peach { background: var(--peach); }
  .feature-icon.mint { background: var(--mint); }
  .feature-icon.lavender { background: var(--lavender); }

  .feature-card h3 { font-size: 1.15rem; color: var(--text-dark); margin-bottom: 0.6rem; font-family: 'Nunito', sans-serif; font-weight: 700; }
  .feature-card p { font-size: 0.88rem; color: var(--text-soft); line-height: 1.7; }

  .feature-list {
    list-style: none; margin-top: 1rem; display: flex; flex-direction: column; gap: 6px;
  }

  .feature-list li {
    font-size: 0.82rem; color: var(--text-mid); font-weight: 600;
    display: flex; align-items: center; gap: 8px;
  }

  .feature-list li::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--sky-accent); flex-shrink: 0;
  }

  .feature-list.peach li::before { background: var(--peach-accent); }
  .feature-list.mint li::before { background: var(--mint-accent); }
  .feature-list.lavender li::before { background: var(--lavender-accent); }

  /* EMODNA SPOTLIGHT */
  .emodna-spotlight {
    background: linear-gradient(160deg, var(--sky) 0%, var(--white) 60%, var(--peach) 100%);
  }

  .spotlight-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center; margin-top: 3rem;
  }

  .dimensions-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem; margin-top: 2rem;
  }

  .dimension-card {
    background: white; border-radius: 16px; padding: 18px;
    border: 1.5px solid var(--sky-mid);
    transition: all 0.3s;
  }

  .dimension-card:hover { transform: translateY(-3px); border-color: var(--sky-accent); box-shadow: 0 8px 24px var(--shadow-sky); }

  .dimension-name { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; }
  .dimension-bar { height: 6px; background: var(--sky); border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
  .dimension-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--sky-accent), var(--sky-deep)); }
  .dimension-score { font-size: 0.78rem; font-weight: 700; color: var(--sky-accent); }

  .emodna-visual-card {
    background: white; border-radius: 24px; padding: 32px;
    box-shadow: 0 20px 60px rgba(78,175,218,0.12);
    border: 1px solid var(--sky-mid);
  }

  .radar-svg { width: 100%; max-width: 280px; display: block; margin: 0 auto; }

  /* HOW IT WORKS */
  .how-it-works { background: var(--white); }

  .steps-row {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem; margin-top: 3.5rem; position: relative;
  }

  .step-card {
    text-align: center; padding: 32px 24px;
    background: white; border-radius: 20px;
    border: 1.5px solid var(--sky-mid);
    transition: all 0.3s;
    position: relative;
  }

  .step-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px var(--shadow-sky); border-color: var(--sky-accent); }

  .step-num {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sky-accent), var(--sky-deep));
    color: white; font-weight: 800; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }

  .step-icon { font-size: 2rem; margin-bottom: 1rem; }
  .step-card h3 { font-size: 1rem; color: var(--text-dark); margin-bottom: 0.6rem; font-family: 'Nunito', sans-serif; font-weight: 700; }
  .step-card p { font-size: 0.85rem; color: var(--text-soft); line-height: 1.7; }

  /* DASHBOARD PREVIEW */
  .dashboard-preview { background: var(--soft-white); }

  .dashboard-mockup {
    background: white; border-radius: 24px;
    padding: 28px; margin-top: 3rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.07);
    border: 1.5px solid var(--sky-mid);
  }

  .db-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; padding-bottom: 20px;
    border-bottom: 1px solid var(--sky);
  }

  .db-stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 24px;
  }

  .db-stat {
    background: var(--soft-white); border-radius: 14px; padding: 18px;
    border: 1px solid var(--sky-mid);
    transition: all 0.3s;
  }
  .db-stat:hover { border-color: var(--sky-accent); box-shadow: 0 4px 16px var(--shadow-sky); }

  .db-stat-icon { font-size: 1.4rem; margin-bottom: 8px; }
  .db-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--text-dark); }
  .db-stat-lbl { font-size: 0.75rem; color: var(--text-soft); font-weight: 600; }
  .db-stat-change { font-size: 0.72rem; color: var(--mint-accent); font-weight: 700; margin-top: 2px; }

  .db-charts-row {
    display: grid; grid-template-columns: 2fr 1fr;
    gap: 1.5rem; margin-bottom: 20px;
  }

  .db-chart-card {
    background: var(--soft-white); border-radius: 16px; padding: 20px;
    border: 1px solid var(--sky-mid);
  }

  .db-chart-title { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 14px; }

  .mini-chart {
    height: 80px; display: flex; align-items: flex-end; gap: 6px;
  }

  .mini-bar {
    flex: 1; border-radius: 4px 4px 0 0;
    background: linear-gradient(180deg, var(--sky-accent), var(--sky-mid));
    transition: height 0.3s;
  }

  .mini-line {
    width: 100%; height: 80px; position: relative;
  }

  .donut-chart { width: 80px; height: 80px; margin: 0 auto; }

  .heatmap-grid {
    display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
  }

  .heatmap-cell {
    aspect-ratio: 1; border-radius: 4px;
  }

  /* FEATURES ALL LIST */
  .all-features { background: var(--white); }

  .features-tabs {
    display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 2rem 0;
  }

  .feature-tab {
    padding: 8px 20px; border-radius: 50px;
    border: 1.5px solid var(--sky-mid);
    background: white; color: var(--text-mid);
    font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: all 0.3s;
    font-family: 'Nunito', sans-serif;
  }

  .feature-tab.active, .feature-tab:hover {
    background: var(--sky-accent); color: white; border-color: var(--sky-accent);
    transform: translateY(-2px);
  }

  .feature-detail-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .feature-detail-card {
    background: white; border-radius: 16px; padding: 22px;
    border: 1.5px solid var(--sky-mid);
    transition: all 0.3s;
    animation: fadeUp 0.5s ease both;
  }

  .feature-detail-card:hover { border-color: var(--sky-accent); box-shadow: 0 8px 24px var(--shadow-sky); transform: translateY(-3px); }

  .fdc-icon { font-size: 1.8rem; margin-bottom: 10px; }
  .fdc-title { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }
  .fdc-desc { font-size: 0.82rem; color: var(--text-soft); line-height: 1.7; }

  /* TESTIMONIALS */
  .testimonials { background: linear-gradient(160deg, var(--peach) 0%, var(--white) 100%); }

  .testimonials-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem; margin-top: 3rem;
  }

  .testimonial-card {
    background: white; border-radius: 20px; padding: 28px;
    box-shadow: 0 8px 30px var(--shadow-peach);
    border: 1.5px solid var(--peach-mid);
    transition: all 0.3s;
  }

  .testimonial-card:hover { transform: translateY(-5px); }

  .t-stars { color: #F4A57A; font-size: 0.9rem; margin-bottom: 12px; }
  .t-text { font-size: 0.9rem; color: var(--text-mid); line-height: 1.8; margin-bottom: 16px; font-style: italic; }
  .t-author { display: flex; align-items: center; gap: 10px; }
  .t-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--peach-mid), var(--sky-mid)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .t-name { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); }
  .t-role { font-size: 0.75rem; color: var(--text-soft); }

  /* PRICING */
  .pricing { background: var(--soft-white); }

  .pricing-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem; margin-top: 3rem;
  }

  .pricing-card {
    background: white; border-radius: 24px; padding: 32px;
    border: 2px solid var(--sky-mid); transition: all 0.3s;
  }

  .pricing-card:hover { transform: translateY(-5px); }

  .pricing-card.featured {
    background: linear-gradient(160deg, var(--sky-accent), var(--sky-deep));
    border-color: var(--sky-accent); color: white;
    box-shadow: 0 20px 50px var(--shadow-sky);
    transform: scale(1.03);
  }

  .pricing-card.featured:hover { transform: scale(1.03) translateY(-5px); }

  .pricing-badge {
    background: var(--peach-mid); color: var(--peach-deep);
    border-radius: 50px; padding: 4px 14px; font-size: 0.75rem; font-weight: 800;
    display: inline-block; margin-bottom: 1rem;
  }

  .pricing-card.featured .pricing-badge { background: rgba(255,255,255,0.25); color: white; }

  .pricing-plan { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 0.5rem; }
  .pricing-card.featured .pricing-plan { color: white; }

  .pricing-price { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: 0.5rem; }
  .pricing-card.featured .pricing-price { color: white; }

  .pricing-per { font-size: 0.8rem; color: var(--text-soft); }
  .pricing-card.featured .pricing-per { color: rgba(255,255,255,0.8); }

  .pricing-features { list-style: none; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 10px; }
  .pricing-features li { font-size: 0.85rem; color: var(--text-mid); display: flex; align-items: center; gap: 10px; }
  .pricing-card.featured .pricing-features li { color: rgba(255,255,255,0.9); }
  .pricing-features li::before { content: '✓'; font-weight: 800; color: var(--mint-accent); }
  .pricing-card.featured .pricing-features li::before { color: white; }

  .pricing-btn {
    width: 100%; padding: 12px; border-radius: 50px;
    font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.95rem;
    cursor: pointer; transition: all 0.3s; border: 2px solid var(--sky-mid);
    background: white; color: var(--text-dark);
  }

  .pricing-card.featured .pricing-btn {
    background: white; color: var(--sky-accent); border-color: white;
  }

  .pricing-btn:hover { background: var(--sky); }
  .pricing-card.featured .pricing-btn:hover { background: rgba(255,255,255,0.9); }

  /* CTA SECTION */
  .cta-section {
    background: linear-gradient(160deg, var(--sky) 0%, var(--peach) 100%);
    text-align: center; padding: 100px 5%;
  }

  .cta-section h2 { font-size: clamp(2rem, 4vw, 3.2rem); color: var(--text-dark); margin-bottom: 1rem; }
  .cta-section p { font-size: 1rem; color: var(--text-mid); margin-bottom: 2.5rem; max-width: 500px; margin-left: auto; margin-right: auto; }

  /* FOOTER */
  footer {
    background: var(--text-dark); color: rgba(255,255,255,0.6);
    padding: 60px 5% 30px;
  }

  .footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem; margin-bottom: 3rem;
  }

  .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: white; margin-bottom: 1rem; }
  .footer-desc { font-size: 0.85rem; line-height: 1.8; }
  .footer-col h4 { font-size: 0.9rem; font-weight: 700; color: white; margin-bottom: 1rem; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .footer-col ul li { font-size: 0.83rem; cursor: pointer; transition: color 0.3s; }
  .footer-col ul li:hover { color: var(--sky-mid); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; }

  /* MODAL / OVERLAY */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(44,62,90,0.5);
    backdrop-filter: blur(8px); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: white; border-radius: 24px; padding: 40px;
    max-width: 520px; width: 100%;
    box-shadow: 0 30px 80px rgba(0,0,0,0.15);
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .modal-close { float: right; background: var(--sky); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem; color: var(--text-mid); }
  .modal h3 { font-size: 1.5rem; color: var(--text-dark); margin-bottom: 0.5rem; }
  .modal p { font-size: 0.9rem; color: var(--text-soft); margin-bottom: 1.5rem; line-height: 1.7; }

  .input-group { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
  .input-field {
    padding: 12px 16px; border: 1.5px solid var(--sky-mid); border-radius: 12px;
    font-family: 'Nunito', sans-serif; font-size: 0.9rem; color: var(--text-dark);
    outline: none; transition: border-color 0.3s;
    background: var(--soft-white);
  }
  .input-field:focus { border-color: var(--sky-accent); background: white; }

  /* NOTIFICATION */
  .notif {
    position: fixed; bottom: 30px; right: 30px; z-index: 300;
    background: white; border-radius: 16px; padding: 16px 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    border-left: 4px solid var(--sky-accent);
    display: flex; align-items: center; gap: 12px;
    animation: slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1);
    max-width: 320px;
  }

  @keyframes slideInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }

  .notif-icon { font-size: 1.3rem; }
  .notif-text { font-size: 0.85rem; font-weight: 600; color: var(--text-dark); }

  @media (max-width: 900px) {
    .hero-visual { display: none; }
    .spotlight-grid { grid-template-columns: 1fr; }
    .db-stats-row { grid-template-columns: repeat(2, 1fr); }
    .db-charts-row { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .nav-links { display: none; }
  }

  @media (max-width: 600px) {
    .db-stats-row { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .pricing-card.featured { transform: none; }
  }
`;

const ALL_FEATURES = {
  "Core UHUM": [
    { icon: "🧬", title: "UHUM Assessment", desc: "5-step structured evaluation mapping your emotional triggers, strengths, stress response, cognitive patterns, and mood stability into a unique fingerprint." },
    { icon: "🕸️", title: "Radar Profile Visualization", desc: "7-axis spider chart showing all emotional dimensions at a glance — your personal emotional map, beautifully rendered." },
    { icon: "🏷️", title: "Dominant Emotion Type Badge", desc: "Assigned a personality-style type like 'The Reflective Processor' or 'The Adaptive Warrior' based on your unique profile." },
    { icon: "📊", title: "UHUM Score (0–100)", desc: "Overall emotional awareness and health score that tracks your growth over time as you complete exercises and check-ins." },
    { icon: "🔄", title: "UHUM Re-Assessment", desc: "Retake assessments monthly to see how your profile shifts and evolves — track your emotional growth over time." },
    { icon: "📄", title: "UHUM Certificate", desc: "Downloadable, beautifully designed certificate showcasing your emotional profile, top strengths, and growth milestones." },
  ],
  "Dashboard & Analytics": [
    { icon: "📈", title: "Emotional Trends Chart", desc: "7-day and 30-day line charts tracking mood, stress, and resilience simultaneously with hover tooltips." },
    { icon: "🗓️", title: "Emotion Heatmap Calendar", desc: "30-day color-coded calendar showing your best and worst emotional days at a glance." },
    { icon: "🎯", title: "Trigger Frequency Analysis", desc: "Bar charts showing which emotional triggers fire most often and when, so you can anticipate and prepare." },
    { icon: "🔮", title: "Predictive Emotion Engine", desc: "Based on your patterns, predicts emotionally challenging days 24–48 hours ahead with a proactive action plan." },
    { icon: "⚡", title: "Response Style Donut", desc: "Visual breakdown of your Fight/Flight/Freeze/Flow response patterns across the week." },
    { icon: "📉", title: "Weekly UHUM Shift", desc: "Before/after comparison showing which of the 7 emotional dimensions improved or declined each week." },
  ],
  "Growth & Therapy Tools": [
    { icon: "🗺️", title: "Personalized Growth Roadmap", desc: "4-week visual timeline with daily emotional tasks, exercises, and milestones matched to your UHUM profile." },
    { icon: "📝", title: "CBT Thought Record", desc: "Interactive digital CBT worksheet — log situation, thought, emotion, and receive a personalized cognitive reframe." },
    { icon: "🌿", title: "Somatic Exercise Library", desc: "Body-based grounding exercises matched to your stress response style: tapping, progressive relaxation, grounding sequences." },
    { icon: "🫁", title: "Animated Breathwork Guide", desc: "Visual breathing circle guiding Box Breathing, 4-7-8, Coherence Breathing, and Wim Hof techniques with timers." },
    { icon: "📔", title: "Smart Emotion Journal", desc: "Free-form journaling with NLP analysis that auto-detects emotional themes, cognitive distortions, and growth moments." },
    { icon: "💭", title: "Dream Journal", desc: "Log and track dream patterns alongside your emotional data to identify deeper subconscious patterns." },
  ],
  "AI & Coaching": [
    { icon: "🤖", title: "AI Emotional Coach 'Emo'", desc: "24/7 personalized AI coach that knows your UHUM profile and delivers CBT prompts, exercises, and emotional support." },
    { icon: "🎙️", title: "Voice Emotion Detection", desc: "Record a 30-second voice note; AI analyzes tone and speech patterns to detect stress, sadness, or calm." },
    { icon: "🔔", title: "Micro-Intervention Notifications", desc: "When your mood dips, receive a 2-minute personalized intervention — not a generic tip, but one matched to your profile." },
    { icon: "🧠", title: "Cognitive Pattern Alerts", desc: "Real-time detection of cognitive distortion language in journals and chat, with instant reframe suggestions." },
    { icon: "🌐", title: "Multilingual Support", desc: "Available in English, Hindi, Tamil, and 7 other languages — making emotional wellness accessible across India." },
    { icon: "💡", title: "Daily Insight Cards", desc: "Morning emotional insight based on your last check-in, pattern analysis, and today's emotional forecast." },
  ],
  "Mindfulness & Sleep": [
    { icon: "🧘", title: "Adaptive Meditation Sessions", desc: "Meditations that adapt based on your emotional state each day — not a fixed library but a responsive system." },
    { icon: "😴", title: "Sleep Soundscapes", desc: "Forest rain, ocean waves, white noise, and fireplace sounds with a sleep quality tracker and bedtime ritual checklist." },
    { icon: "🌙", title: "Bedtime Wind-Down Routine", desc: "Guided 15-minute bedtime sequence personalized to your stress profile to improve sleep onset and quality." },
    { icon: "🎵", title: "Micro-Meditation Sessions", desc: "2–10 minute sessions for stress, anxiety, focus, and emotional reset — designed for busy schedules." },
    { icon: "📻", title: "Mood-Matched Playlists", desc: "Curated ambient audio playlists matched to your current emotional state and UHUM stress response style." },
    { icon: "⌚", title: "Wearable Integration", desc: "Connect Apple Watch, Fitbit, or Oura Ring to incorporate HRV and sleep data into your UHUM analytics." },
  ],
  "Community & Sharing": [
    { icon: "🤝", title: "Trusted Circle Sharing", desc: "Selectively share progress snapshots, emotional trends, and trigger insights with 2–5 trusted people only." },
    { icon: "👨‍⚕️", title: "Therapist Portal", desc: "Invite your therapist to view your UHUM dashboard — giving professionals meaningful data for better sessions." },
    { icon: "🤲", title: "Accountability Partner", desc: "Pair with a friend who has a complementary emotional profile; share weekly snapshots and cheer each other on." },
    { icon: "👨‍👩‍👧", title: "Family Emotional Literacy", desc: "Parents track their child's (ages 8–16) emotional patterns with age-appropriate assessments and insights." },
    { icon: "🏫", title: "Peer Mentor Matching", desc: "Get matched anonymously with users further ahead in their UHUM journey as informal growth mentors." },
    { icon: "📢", title: "Monthly Group Challenges", desc: "Safe, themed monthly emotional challenges — like 'Trigger Awareness Week' — with community progress tracking." },
  ],
  "Badges & Progress": [
    { icon: "🏅", title: "Cognitive Flexibility Badge", desc: "Earned by successfully reframing 10 negative thought patterns using CBT tools in the app." },
    { icon: "💪", title: "Stress Recovery Pro Badge", desc: "Awarded after demonstrating fast recovery from 5 high-stress events tracked in your dashboard." },
    { icon: "⚖️", title: "Emotional Balance Badge", desc: "Earned by maintaining mood stability scores above 70 for 7 consecutive days." },
    { icon: "🎯", title: "Thought Accuracy Badge", desc: "Complete 5 CBT thought records with scored accuracy; track how your thinking patterns improve." },
    { icon: "🔥", title: "Resilience Streak Badge", desc: "30-day consistent daily check-in and growth task completion — your longest emotional growth streak." },
    { icon: "🌟", title: "UHUM Elite Badge", desc: "Reach an overall UHUM score of 90+ — the ultimate recognition of your emotional growth journey." },
  ],
  "Education & Therapy": [
    { icon: "📚", title: "Psychoeducation Library", desc: "50+ short modules on emotions, CBT, ACT, resilience, relationships, and stress — all matched to your UHUM." },
    { icon: "🎓", title: "Video Lesson Series", desc: "5-minute video lessons from licensed therapists and psychologists on key emotional wellness topics." },
    { icon: "🛋️", title: "Therapist Marketplace", desc: "Browse and book sessions with licensed therapists matched to your UHUM profile and issues." },
    { icon: "💬", title: "Therapy Session Prep Tool", desc: "Before each therapy session, generate an UHUM summary report to share with your therapist." },
    { icon: "🧩", title: "CBT & ACT Journeys", desc: "Structured 4-week self-help programs using evidence-based CBT and ACT techniques — guided step by step." },
    { icon: "🆘", title: "Crisis Support Detection", desc: "Sensitive language monitoring with immediate display of helpline resources and safety guidance when needed." },
  ],
};

const TESTIMONIALS = [
  { emoji: "👩", name: "Priya R.", role: "Software Engineer, Bangalore", text: "UHUM actually helped me understand why I freeze in conflicts. The CBT tools matched to my profile made such a difference in just 3 weeks.", stars: 5 },
  { emoji: "👨", name: "Arjun M.", role: "College Student, Chennai", text: "The predictive alerts are wild — it told me Tuesday would be hard and it was right. Having that heads-up helped me prepare my coping plan.", stars: 5 },
  { emoji: "👩", name: "Sneha K.", role: "Teacher, Mumbai", text: "I shared my UHUM report with my therapist and she said it was the most useful thing a client had ever brought her. Game changer.", stars: 5 },
  { emoji: "👨", name: "Rahul T.", role: "Entrepreneur, Delhi", text: "The Trusted Circle feature means my wife can see my emotional trends without me having to explain everything. It's brought us closer.", stars: 5 },
  { emoji: "👩", name: "Meera D.", role: "HR Manager, Hyderabad", text: "I've tried Headspace and Calm. UHUM is the first app that feels like it actually knows me. The UHUM score going from 61 to 79 in 6 weeks was amazing.", stars: 5 },
  { emoji: "👨", name: "Vikram S.", role: "Doctor, Pune", text: "The psychoeducation library is excellent — proper CBT content, not vague affirmations. And the crisis detection feature is well implemented.", stars: 5 },
];

export default function UHUMWebsite() {
  const [activeTab, setActiveTab] = useState("Core UHUM");
  const [showModal, setShowModal] = useState(false);
  const [notif, setNotif] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const tabCategories = Object.keys(ALL_FEATURES);

  const triggerNotif = (msg, icon = "✅") => {
    setNotif({ msg, icon });
    setTimeout(() => setNotif(null), 3500);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const heatmapColors = [
    '#E8F4FD','#C5E3F7','#7EC8E3','#4AAFDA','#E8F4FD','#FFD5BC','#E8F8F2',
    '#C5E3F7','#4AAFDA','#7EC8E3','#E8F4FD','#FFD5BC','#7EC8E3','#C5E3F7',
    '#FFF0E8','#4AAFDA','#7EC8E3','#C5E3F7','#FFD5BC','#4AAFDA','#E8F8F2',
    '#7EC8E3','#FFF0E8','#C5E3F7','#4AAFDA','#E8F4FD','#FFD5BC','#7EC8E3',
    '#C5E3F7','#4AAFDA',
  ];

  const bars = [55, 70, 62, 85, 73, 68, 78];
  const donutSegments = [
    { color: '#4AAFDA', pct: 35, label: 'Flow' },
    { color: '#F4A57A', pct: 28, label: 'Flight' },
    { color: '#6ECBA8', pct: 22, label: 'Freeze' },
    { color: '#B8A4E0', pct: 15, label: 'Fight' },
  ];

  const dimensions = [
    { name: "Resilience", score: 82, color: "#4AAFDA" },
    { name: "Triggers", score: 65, color: "#F4A57A" },
    { name: "Strengths", score: 88, color: "#6ECBA8" },
    { name: "Mood Stability", score: 74, color: "#B8A4E0" },
    { name: "Reactivity", score: 58, color: "#F4A57A" },
    { name: "Stress Style", score: 70, color: "#4AAFDA" },
    { name: "Cog. Patterns", score: 62, color: "#6ECBA8" },
  ];

  // SVG Radar chart
  const radarPoints = () => {
    const cx = 130, cy = 130, r = 90;
    const scores = [0.82, 0.65, 0.88, 0.74, 0.58, 0.70, 0.62];
    const n = scores.length;
    return scores.map((s, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return { x: cx + s * r * Math.cos(angle), y: cy + s * r * Math.sin(angle) };
    });
  };

  const radarAxis = () => {
    const cx = 130, cy = 130, r = 90;
    const n = 7;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
  };

  const pts = radarPoints();
  const axes = radarAxis();
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <>
      <style>{style}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">UHUM✦</div>
        <ul className="nav-links">
          {['Features', 'How It Works', 'Dashboard', 'Pricing'].map(l => (
            <li key={l}><a onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}>{l}</a></li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => setShowModal(true)}>Start Free →</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg-circle hero-bg-circle-1" />
        <div className="hero-bg-circle hero-bg-circle-2" />
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            Now with AI Emotional Coach
          </div>
          <h1>Your Emotions Have a <span>Fingerprint.</span><br />Discover It.</h1>
          <p className="hero-sub">
            UHUM maps 7 emotional dimensions — triggers, resilience, cognitive patterns, stress response and more — into a personalized profile that evolves as you grow.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setShowModal(true)}>Discover Your UHUM →</button>
            <button className="btn-secondary" onClick={() => scrollTo('how-it-works')}>See How It Works</button>
          </div>
          <div className="hero-stats">
            {[['50K+', 'Emotional Profiles'], ['94%', 'Feel More Self-Aware'], ['7', 'Dimensions Mapped'], ['4.9★', 'App Store Rating']].map(([n, l]) => (
              <div className="hero-stat-item" key={l}>
                <span className="hero-stat-num">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float">
            <div className="dna-profile-header">
              <div className="dna-avatar">🧬</div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>Your UHUM Profile</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--sky-accent)', fontWeight: 700 }}>The Reflective Processor</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-dark)' }}>78<span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>/100</span></div>
            </div>
            <div className="dna-bars">
              {dimensions.slice(0, 5).map(d => (
                <div className="dna-bar-row" key={d.name}>
                  <div className="dna-bar-label">{d.name}</div>
                  <div className="dna-bar-track">
                    <div className="dna-bar-fill" style={{ width: `${d.score}%`, background: `linear-gradient(90deg, ${d.color}88, ${d.color})` }} />
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: d.color, minWidth: 28 }}>{d.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES OVERVIEW */}
      <section className="features-overview" id="features">
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <span className="section-tag">Everything You Need</span>
        </div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>A Complete Emotional Wellness Ecosystem</h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 0' }}>
          Not just another mood tracker. UHUM is an end-to-end emotional intelligence platform with 8 powerful modules.
        </p>
        <div className="features-grid">
          {[
            { icon: '🧬', color: 'sky', title: 'UHUM Profiling', desc: 'Deep 5-step assessment that maps your unique emotional fingerprint across 7 psychological dimensions.', items: ['Trigger Mapping', 'Stress Response Style', 'Cognitive Pattern Detection', 'Resilience Scoring'] },
            { icon: '📊', color: 'peach', title: 'Insights Dashboard', desc: 'Comprehensive emotional analytics with trends, heatmaps, and predictive alerts — far beyond a mood log.', items: ['7-Day Trend Charts', 'Emotion Heatmap', 'Predictive Alerts', 'Response Style Analysis'] },
            { icon: '🗺️', color: 'mint', title: 'Growth Roadmap', desc: 'Personalized 4-week plan with daily tasks, CBT exercises, and milestones matched to your UHUM.', items: ['Daily Emotional Tasks', 'CBT Thought Records', 'Somatic Exercises', 'Progress Checkpoints'] },
            { icon: '🤖', color: 'lavender', title: 'AI Emotional Coach', desc: "24/7 AI coach named 'Emo' who knows your profile and delivers personalized support, exercises, and CBT prompts.", items: ['Profile-Aware Responses', 'CBT Prompting', 'Voice Emotion Detection', 'Crisis Detection'] },
            { icon: '🧘', color: 'sky', title: 'Mindfulness & Sleep Hub', desc: 'Adaptive meditations, guided breathwork, sleep soundscapes, and bedtime wind-down routines.', items: ['Adaptive Meditation', 'Box Breathing & 4-7-8', 'Sleep Soundscapes', 'Bedtime Rituals'] },
            { icon: '🤝', color: 'peach', title: 'Trusted Circle', desc: 'Safe, private sharing with up to 5 trusted people — friends, family, or your therapist.', items: ['Progress Snapshots', 'Therapist Portal', 'Accountability Pairing', 'Privacy Controls'] },
            { icon: '🏅', color: 'mint', title: 'Achievement Badges', desc: 'Meaningful psychological achievement badges that track real emotional growth milestones.', items: ['Cognitive Flexibility', 'Stress Recovery Pro', 'Emotional Balance', 'UHUM Elite'] },
            { icon: '📚', color: 'lavender', title: 'Psychoeducation Library', desc: '50+ CBT/ACT-based modules, video lessons, and structured therapy journeys — all matched to your UHUM.', items: ['CBT & ACT Techniques', 'Video Lessons', 'Therapist Marketplace', 'Structured Programs'] },
          ].map(f => (
            <div key={f.title} className={`feature-card ${f.color}`}>
              <div className={`feature-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul className={`feature-list ${f.color}`}>
                {f.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* EMODNA SPOTLIGHT */}
      <section className="emodna-spotlight" id="emodna">
        <div className="spotlight-grid">
          <div>
            <span className="section-tag">The Core Innovation</span>
            <h2 className="section-title">What is Your UHUM?</h2>
            <p className="section-sub">
              Most apps track how you feel. UHUM maps <strong>why</strong> you feel that way — and builds a living emotional blueprint that gets smarter every week.
            </p>
            <div className="dimensions-grid">
              {dimensions.map(d => (
                <div className="dimension-card" key={d.name}>
                  <div className="dimension-name">{d.name}</div>
                  <div className="dimension-bar">
                    <div className="dimension-fill" style={{ width: `${d.score}%`, background: `linear-gradient(90deg, ${d.color}88, ${d.color})` }} />
                  </div>
                  <div className="dimension-score" style={{ color: d.color }}>{d.score}/100</div>
                </div>
              ))}
            </div>
          </div>
          <div className="emodna-visual-card">
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1rem', fontFamily: 'Nunito' }}>Priya's UHUM Fingerprint</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>The Reflective Processor · Score 78/100</div>
            </div>
            <svg className="radar-svg" viewBox="0 0 260 260">
              {[0.25, 0.5, 0.75, 1].map(r => (
                <polygon key={r}
                  points={axes.map(a => {
                    const cx = 130, cy = 130;
                    const dx = (a.x - cx) * r, dy = (a.y - cy) * r;
                    return `${cx + dx},${cy + dy}`;
                  }).join(' ')}
                  fill="none" stroke="var(--sky-mid)" strokeWidth="1" opacity="0.7"
                />
              ))}
              {axes.map((a, i) => (
                <line key={i} x1="130" y1="130" x2={a.x} y2={a.y} stroke="var(--sky-mid)" strokeWidth="1" />
              ))}
              <polygon points={polyPts} fill="rgba(78,175,218,0.15)" stroke="#4AAFDA" strokeWidth="2" />
              {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4AAFDA" />)}
              {axes.map((a, i) => {
                const labels = ['Resilience', 'Triggers', 'Strengths', 'Stability', 'Reactivity', 'Stress', 'Patterns'];
                const cx = 130, cy = 130;
                const tx = cx + (a.x - cx) * 1.2, ty = cy + (a.y - cy) * 1.2;
                return <text key={i} x={tx} y={ty} textAnchor="middle" fontSize="9" fill="var(--text-soft)" fontFamily="Nunito" fontWeight="700">{labels[i]}</text>;
              })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: 16 }}>
              {['🦅 Flight Responder', '💭 Catastrophizer', '🌟 Empathy Strength'].map(b => (
                <span key={b} style={{ background: 'var(--sky)', color: 'var(--sky-accent)', borderRadius: 50, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">Simple Journey</span>
          <h2 className="section-title">How UHUM Works</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>From assessment to transformation in four clear steps.</p>
        </div>
        <div className="steps-row">
          {[
            { n: 1, icon: '🧬', title: 'Take the UHUM Assessment', desc: 'Answer 25 carefully designed questions across 5 categories. Takes 8–10 minutes. No clinical jargon.' },
            { n: 2, icon: '🔬', title: 'Get Your Emotional Profile', desc: 'Receive your 7-dimension UHUM fingerprint, dominant type, score, and cognitive pattern analysis instantly.' },
            { n: 3, icon: '🗺️', title: 'Follow Your Growth Plan', desc: 'Your personalized roadmap with daily tasks, exercises, and skill-building matched exactly to your UHUM.' },
            { n: 4, icon: '📈', title: 'Track & Evolve', desc: 'Watch your UHUM shift and grow. Daily check-ins, weekly reports, and monthly profile re-assessments.' },
          ].map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="dashboard-preview" id="dashboard">
        <span className="section-tag">Live Analytics</span>
        <h2 className="section-title">Your Emotion Insights Dashboard</h2>
        <p className="section-sub">Not just a mood log — a comprehensive emotional intelligence command center.</p>
        <div className="dashboard-mockup">
          <div className="db-header">
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1rem' }}>Good morning, Priya ☀️</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>Today's UHUM Score: <strong style={{ color: 'var(--sky-accent)' }}>74 / 100</strong> · Tuesday, Feb 2026</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ background: 'var(--sky)', borderRadius: 8, padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--sky-accent)' }}>🔮 Predictive Alert Active</div>
            </div>
          </div>
          <div className="db-stats-row">
            {[
              { icon: '💙', val: '74', lbl: "Today's Score", change: '+6 from yesterday' },
              { icon: '😤', val: 'Moderate', lbl: 'Stress Level', change: '↓ Lower than avg' },
              { icon: '💪', val: '82%', lbl: 'Resilience Index', change: '↑ Up 4% this week' },
              { icon: '🔥', val: '12 Days', lbl: 'Growth Streak', change: 'Personal best!' },
            ].map(s => (
              <div className="db-stat" key={s.lbl}>
                <div className="db-stat-icon">{s.icon}</div>
                <div className="db-stat-val">{s.val}</div>
                <div className="db-stat-lbl">{s.lbl}</div>
                <div className="db-stat-change">{s.change}</div>
              </div>
            ))}
          </div>
          <div className="db-charts-row">
            <div className="db-chart-card">
              <div className="db-chart-title">📈 7-Day Emotional Trends</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: `${h}%`, borderRadius: '4px 4px 0 0', background: `linear-gradient(180deg, #4AAFDA, #7EC8E3)`, minHeight: 8 }} />
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-soft)' }}>{'MTWTFSS'[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="db-chart-card">
              <div className="db-chart-title">🎯 Response Styles</div>
              <svg width="100%" viewBox="0 0 120 120" style={{ maxHeight: 100 }}>
                {(() => {
                  let offset = 0;
                  const c = 60, r = 45;
                  return donutSegments.map(seg => {
                    const pct = seg.pct / 100;
                    const start = offset * 2 * Math.PI - Math.PI / 2;
                    offset += pct;
                    const end = offset * 2 * Math.PI - Math.PI / 2;
                    const x1 = c + r * Math.cos(start), y1 = c + r * Math.sin(start);
                    const x2 = c + r * Math.cos(end), y2 = c + r * Math.sin(end);
                    const large = pct > 0.5 ? 1 : 0;
                    return <path key={seg.label} d={`M${c},${c} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={seg.color} opacity="0.85" />;
                  });
                })()}
                <circle cx="60" cy="60" r="25" fill="white" />
                <text x="60" y="57" textAnchor="middle" fontSize="8" fill="var(--text-dark)" fontFamily="Nunito" fontWeight="700">35%</text>
                <text x="60" y="67" textAnchor="middle" fontSize="7" fill="var(--text-soft)" fontFamily="Nunito">Flow</text>
              </svg>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {donutSegments.map(s => <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: 'var(--text-soft)', fontWeight: 600 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.label} {s.pct}%</div>)}
              </div>
            </div>
          </div>
          <div className="db-chart-card" style={{ marginBottom: 0 }}>
            <div className="db-chart-title">🗓️ 30-Day Emotion Heatmap</div>
            <div className="heatmap-grid">
              {heatmapColors.map((c, i) => (
                <div key={i} className="heatmap-cell" style={{ background: c, border: '1px solid rgba(255,255,255,0.5)' }} title={`Day ${i + 1}`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: '0.72rem', color: 'var(--text-soft)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#4AAFDA' }} />High Mood</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#FFD5BC' }} />Medium</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#E8F4FD' }} />Low</span>
            </div>
          </div>
        </div>
      </section>

      {/* ALL FEATURES */}
      <section className="all-features" id="all-features">
        <span className="section-tag">Full Feature Breakdown</span>
        <h2 className="section-title">Every Feature, Explained</h2>
        <p className="section-sub">Explore all {Object.values(ALL_FEATURES).flat().length}+ features across 8 categories.</p>
        <div className="features-tabs">
          {tabCategories.map(t => (
            <button key={t} className={`feature-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
        <div className="feature-detail-grid">
          {ALL_FEATURES[activeTab].map((f, i) => (
            <div key={f.title} className="feature-detail-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="fdc-icon">{f.icon}</div>
              <div className="fdc-title">{f.title}</div>
              <div className="fdc-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag peach">Real People, Real Growth</span>
          <h2 className="section-title">What Our Users Say</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div className="testimonial-card" key={t.name}>
              <div className="t-stars">{'★'.repeat(t.stars)}</div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-author">
                <div className="t-avatar">{t.emoji}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag mint">Simple Pricing</span>
          <h2 className="section-title">Start Your Emotional Journey</h2>
          <p className="section-sub" style={{ margin: '0 auto 0' }}>Begin for free. Upgrade when you're ready to go deeper.</p>
        </div>
        <div className="pricing-grid">
          {[
            {
              plan: 'Free', price: '₹0', per: 'forever', badge: 'Get Started',
              features: ['UHUM Assessment (once)', 'Basic Profile Dashboard', '3 Growth Tasks / week', 'Emotion Journal (7 days)', 'Community Access', '5 Psychoeducation Modules'],
              btn: 'Start Free'
            },
            {
              plan: 'Growth', price: '₹499', per: 'per month', badge: 'Most Popular', featured: true,
              features: ['Full UHUM Profile + Monthly Retake', 'Complete Insights Dashboard', 'Personalized 4-Week Roadmap', 'AI Coach "Emo" (unlimited)', 'All Meditation & Breathwork', 'Trusted Circle (3 people)', 'All Badges & Certificate', 'Full Psychoeducation Library'],
              btn: 'Start Growth Plan'
            },
            {
              plan: 'Pro', price: '₹999', per: 'per month', badge: 'For Professionals',
              features: ['Everything in Growth', 'Therapist Portal Access', 'Wearable Integration', 'Family Mode (2 members)', 'Voice Emotion Detection', 'Predictive Emotion Engine', 'Priority AI Coach', 'Downloadable PDF Reports'],
              btn: 'Go Pro'
            },
          ].map(p => (
            <div key={p.plan} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
              <div className="pricing-badge">{p.badge}</div>
              <div className="pricing-plan">{p.plan}</div>
              <div className="pricing-price">{p.price}</div>
              <div className="pricing-per">{p.per}</div>
              <ul className="pricing-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button className="pricing-btn" onClick={() => { setShowModal(true); triggerNotif(`${p.plan} plan selected! 🎉`); }}>{p.btn}</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <span className="section-tag">Ready to Begin?</span>
        <h2>Discover Your Emotional<br />Fingerprint Today</h2>
        <p>Join 50,000+ people who've mapped their UHUM and started growing. Free to start. No credit card needed.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Discover Your UHUM — Free →</button>
          <button className="btn-secondary" onClick={() => scrollTo('all-features')}>Explore All Features</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">UHUM✦</div>
            <p className="footer-desc">Your complete emotional wellness platform. Map, understand, and grow your emotional intelligence with science-backed tools.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['🐦 Twitter', '📸 Instagram', '💼 LinkedIn'].map(s => (
                <span key={s} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', transition: 'background 0.3s' }}>{s}</span>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              {['UHUM Assessment', 'Insights Dashboard', 'Growth Roadmap', 'AI Coach', 'Mindfulness Hub', 'Psychoeducation'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              {['About Us', 'Our Science', 'Clinical Advisory', 'Press', 'Careers', 'Blog'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'DPDPA Compliance', 'Crisis Resources', 'Contact Us'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 UHUM. All rights reserved. Made with ❤️ in India.</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>DPDPA Compliant · HIPAA Aligned · ISO 27001</span>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🧬</div>
            <h3>Discover Your UHUM</h3>
            <p>Create your free account to begin the 8-minute assessment and receive your personalized emotional fingerprint.</p>
            <div className="input-group">
              <input className="input-field" placeholder="Your full name" />
              <input className="input-field" placeholder="Email address" type="email" />
              <input className="input-field" placeholder="Create a password" type="password" />
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => { setShowModal(false); triggerNotif('Welcome to UHUM! 🎉 Check your email to get started.', '🧬'); }}>
              Start My UHUM Journey →
            </button>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.8rem', color: 'var(--text-soft)' }}>Free forever · No credit card needed · DPDPA compliant</p>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notif && (
        <div className="notif">
          <span className="notif-icon">{notif.icon}</span>
          <span className="notif-text">{notif.msg}</span>
        </div>
      )}
    </>
  );
}
