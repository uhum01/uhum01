import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { use3DScroll, use3DChildrenReveal } from "@/hooks/use3DScroll";

interface CTASectionProps {
  onOpenModal: () => void;
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const modal = (
    <AnimatePresence>
      <motion.div
        key="contact-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "rgba(15,23,42,0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          key="contact-card"
          initial={{ opacity: 0, y: 44, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            padding: "48px 40px 40px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(74,175,218,0.15)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,200,227,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 18, right: 18,
              width: 32, height: 32, borderRadius: "50%",
              background: "#e8f4fd", border: "none",
              fontSize: "1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748b", fontWeight: 700, lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Label pill */}
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#c8eaf7,#d4f1e8)",
            color: "#2d8cb5", fontSize: "0.68rem", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "4px 14px", borderRadius: 999, marginBottom: 20,
            position: "relative", zIndex: 1,
          }}>
            Contact
          </span>

          {/* Heading */}
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.5rem", color: "#1a202c",
            lineHeight: 1.3, margin: "0 0 16px",
            position: "relative", zIndex: 1,
          }}>
            Have questions or partnership inquiries?
          </h3>

          {/* Gradient divider */}
          <div style={{
            width: 40, height: 2, borderRadius: 999, margin: "0 auto 20px",
            background: "linear-gradient(90deg, hsl(197,63%,57%), hsl(20,85%,72%))",
            position: "relative", zIndex: 1,
          }} />

          {/* Email label */}
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 8, position: "relative", zIndex: 1 }}>
            Email us at
          </p>

          {/* Email link */}
          <a
            href="mailto:uhum.official@gmail.com"
            style={{
              fontSize: "1.05rem", fontWeight: 700,
              color: "#4aafda", textDecoration: "none",
              position: "relative", zIndex: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            uhum.official@gmail.com
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

export default function CTASection({ onOpenModal }: CTASectionProps) {
  const [showContact, setShowContact] = useState(false);

  const headingRef = use3DScroll<HTMLHeadingElement>({ variant: "flip-up", threshold: 0.15 });
  const subRef = use3DScroll<HTMLParagraphElement>({ variant: "rise", delay: 120, threshold: 0.1 });
  const btnsRef = use3DChildrenReveal<HTMLDivElement>({ variant: "zoom-depth", stagger: 100, threshold: 0.1 });

  return (
    <>
      <section className="gradient-cta text-center py-[100px] px-[5%]">
        <h2 ref={headingRef} className="font-display text-[clamp(2rem,4vw,3.2rem)] text-dark mb-4">
          Ready to Discover Your UHUM?
        </h2>

        <div ref={btnsRef} className="flex gap-4 justify-center flex-wrap">
          <button onClick={onOpenModal} className="btn-emo-primary">
            Start Your Free Assessment →
          </button>
          <button className="btn-emo-secondary" onClick={() => setShowContact(true)}>
            Talk to Our Team
          </button>
        </div>
      </section>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
