import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Legal modal content ──────────────────────────────────────────── */
const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    badge: "Pre-Launch Version",
    icon: "🔒",
    sections: [
      {
        heading: "Effective Date",
        body: "February 2026",
      },
      {
        heading: "What We Collect",
        body: "UHUM currently collects email addresses for early access registration.",
      },
      {
        heading: "How We Use Your Email",
        body: "If you join the early access list, your email will be used only to provide updates about UHUM's development, beta testing, and launch information.",
      },
      {
        heading: "We Never Sell Your Data",
        body: "We do not sell, rent, or share email addresses with third parties. Your information stays with us — always.",
      },
      {
        heading: "Unsubscribe Anytime",
        body: "You may unsubscribe from updates at any time by clicking the unsubscribe link in any email we send.",
      },
      {
        heading: "Future Updates",
        body: "When the full app launches, this policy will be updated to reflect in-app data practices.",
      },
      {
        heading: "Contact",
        body: "For questions, contact us at support@ahumapp.com",
        isEmail: true,
        email: "support@ahumapp.com",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    badge: "Pre-Launch Version",
    icon: "📋",
    sections: [
      {
        heading: "Effective Date",
        body: "February 2026",
      },
      {
        heading: "Agreement",
        body: "By joining the UHUM early access list, you agree to receive occasional updates about the product's development and launch.",
      },
      {
        heading: "Product in Development",
        body: "UHUM is currently in development and features described on this website may evolve before release. We are committed to building something meaningful and will keep you informed.",
      },
      {
        heading: "No Warranties",
        body: "This early access programme is provided 'as is'. UHUM makes no warranties, express or implied, regarding the availability, accuracy, or completeness of any product or feature.",
      },
      {
        heading: "Changes to Terms",
        body: "These terms apply only to the pre-launch period. Full Terms of Service will be published when the product launches.",
      },
      {
        heading: "Contact",
        body: "For questions, contact us at support@ahumapp.com",
        isEmail: true,
        email: "support@ahumapp.com",
      },
    ],
  },
};

type LegalKey = keyof typeof LEGAL;

function LegalModal({ type, onClose }: { type: LegalKey; onClose: () => void }) {
  const data = LEGAL[type];
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="legal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 999999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
          background: "rgba(8,20,40,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <motion.div
          key="legal-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            maxWidth: "560px",
            width: "100%",
            maxHeight: "88vh",
            overflowY: "auto",
            boxShadow: "0 40px 100px rgba(0,0,0,0.3), 0 8px 32px rgba(74,175,218,0.18)",
            position: "relative",
          }}
        >
          {/* Decorative top bar */}
          <div style={{
            height: 5,
            borderRadius: "28px 28px 0 0",
            background: "linear-gradient(90deg, #7EC8E3, #4AAFDA, #4FA3A5)",
          }} />

          <div style={{ padding: "36px 40px 40px" }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "linear-gradient(135deg, #c8eaf7, #d4f1e8)",
                  color: "#2d8cb5", fontSize: "0.65rem", fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  padding: "4px 12px", borderRadius: 999,
                }}>
                  {data.icon} {data.badge}
                </span>
                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "#f1f5f9", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#64748b", fontSize: "1.1rem", fontWeight: 700,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e2eaf4")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#f1f5f9")}
                >
                  ✕
                </button>
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: "2rem", fontWeight: 600, color: "#0f1f35",
                margin: 0, lineHeight: 1.2,
              }}>
                {data.title}
              </h2>
            </div>

            {/* Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {data.sections.map((s, i) => (
                <div key={i} style={{
                  paddingBottom: 24,
                  borderBottom: i < data.sections.length - 1 ? "1px solid #f0f4f8" : "none",
                }}>
                  <h4 style={{
                    fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "#4AAFDA", margin: "0 0 8px",
                  }}>
                    {s.heading}
                  </h4>
                  <p style={{
                    fontSize: "0.92rem", color: "#334155", lineHeight: 1.75, margin: 0,
                  }}>
                    {s.isEmail ? (
                      <>
                        For questions, contact us at{" "}
                        <a
                          href={`mailto:${s.email}`}
                          style={{ color: "#4AAFDA", textDecoration: "none", fontWeight: 600 }}
                        >
                          {s.email}
                        </a>
                      </>
                    ) : s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p style={{
              marginTop: 28, fontSize: "0.73rem", color: "#94a3b8",
              textAlign: "center", lineHeight: 1.6,
            }}>
              🔒 This is a pre-launch version. Full policies will be published at launch.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */
export default function Footer() {
  const [legalModal, setLegalModal] = useState<LegalKey | null>(null);

  const handleItemClick = (item: string) => {
    if (item === "Privacy") setLegalModal("privacy");
    if (item === "Terms") setLegalModal("terms");
  };

  return (
    <>
      <footer className="bg-foreground text-primary-foreground/60 px-[5%] pt-[60px] pb-[30px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="font-display text-[1.6rem] font-bold text-primary-foreground mb-4">UHUM✦</div>
            <p className="text-[0.85rem] leading-[1.8]">
              The world's first emotional fingerprint platform. Map, track, and grow your emotional intelligence with science-backed tools.
            </p>
          </div>
          {[
            { title: 'Product', items: ['UHUM Assessment', 'Dashboard', 'AI Coach', 'Growth Roadmap', 'Pricing'] },
            { title: 'Resources', items: ['Help Center', 'Blog', 'Research', 'API Docs', 'Community'] },
            { title: 'Company', items: ['About', 'Careers', 'Press', 'Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-primary-foreground mb-4">{col.title}</h4>
              <ul className="list-none flex flex-col gap-2">
                {col.items.map(i => (
                  <li
                    key={i}
                    onClick={() => handleItemClick(i)}
                    className="text-[0.83rem] cursor-pointer transition-colors duration-300 hover:text-primary-foreground/90"
                    style={
                      i === "Privacy" || i === "Terms"
                        ? { color: "rgba(126,200,227,0.75)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(126,200,227,0.35)" }
                        : {}
                    }
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 text-[0.8rem] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2025 UHUM. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalModal("privacy")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(126,200,227,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              Privacy Policy
            </button>
            <span style={{ opacity: 0.2 }}>·</span>
            <button
              onClick={() => setLegalModal("terms")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(126,200,227,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              Terms of Service
            </button>
            <span style={{ opacity: 0.2 }}>·</span>
            <span>Made with 🧬 for emotional wellness</span>
          </div>
        </div>
      </footer>

      {/* Legal modals */}
      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </>
  );
}
