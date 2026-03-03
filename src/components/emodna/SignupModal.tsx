import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ── Google Apps Script Web App — writes directly to Google Sheets ──
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyoWzgeAalat6VVgdO6pFa8Q507sVhAqbSTWEeDb6VKGDFRI7HaCx9wQDbTe-5U_GSs6g/exec";

export default function SignupModal({ open, onClose, onSuccess }: SignupModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", org: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [webhookError, setWebhookError] = useState("");

  const set =
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.org.trim()) errs.org = "Organization is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setWebhookError("");
    setLoading(true);

    try {
      // Build query string and send via fetch with no-cors mode.
      // no-cors lets us fire the GET request to Google Apps Script
      // without needing CORS headers in the response — works on Vercel/HTTPS.
      const params = new URLSearchParams({
        name: form.name,
        phone: form.phone,
        email: form.email,
        organization: form.org,
        timestamp: new Date().toISOString(),
        source: "UHUM Website",
      });

      await fetch(`${SHEET_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      // Show success (no-cors means we can't read the response body, but the
      // request always reaches the Apps Script if the URL is correct)
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setForm({ name: "", phone: "", email: "", org: "" });
        setSubmitted(false);
      }, 1800);
    } catch {
      setLoading(false);
      setWebhookError("Something went wrong. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    color: "#1a202c",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
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
            key="card"
            initial={{ opacity: 0, y: 44, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "28px",
              padding: "40px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(74,175,218,0.15)",
              position: "relative",
              overflow: "hidden",
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

            {/* Header */}
            <div style={{ marginBottom: 28, position: "relative", zIndex: 1 }}>
              <span style={{
                display: "inline-block",
                background: "linear-gradient(135deg,#c8eaf7,#d4f1e8)",
                color: "#2d8cb5", fontSize: "0.68rem", fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "4px 12px", borderRadius: 999, marginBottom: 12,
              }}>
                Get Early Access
              </span>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.6rem", color: "#1a202c",
                lineHeight: 1.25, margin: "0 0 8px",
              }}>
                Join the UHUM Journey ✦
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                Unlock your free emotional assessment. No credit card required.
              </p>
            </div>

            {/* Form / Success */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "32px 0", position: "relative", zIndex: 1 }}
                >
                  <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🎉</div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", color: "#1a202c", marginBottom: 8 }}>
                    You're on the list!
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    We'll be in touch at <strong style={{ color: "#4aafda" }}>{form.email}</strong>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>

                    {/* Name */}
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input
                        type="text" placeholder="e.g. Arjun Mehta"
                        value={form.name} onChange={set("name")} style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = "#4aafda"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,175,218,0.18)"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                      />
                      {errors.name && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 4 }}>{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input
                        type="tel" placeholder="e.g. +91 98765 43210"
                        value={form.phone} onChange={set("phone")} style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = "#4aafda"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,175,218,0.18)"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                      />
                      {errors.phone && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 4 }}>{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input
                        type="email" placeholder="you@example.com"
                        value={form.email} onChange={set("email")} style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = "#4aafda"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,175,218,0.18)"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                      />
                      {errors.email && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 4 }}>{errors.email}</p>}
                    </div>

                    {/* Org */}
                    <div>
                      <label style={labelStyle}>College / Company</label>
                      <input
                        type="text" placeholder="e.g. IIT Madras, Infosys, Self-employed…"
                        value={form.org} onChange={set("org")} style={inputStyle}
                        onFocus={e => { e.currentTarget.style.borderColor = "#4aafda"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,175,218,0.18)"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                      />
                      {errors.org && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 4 }}>{errors.org}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", padding: "14px",
                      background: loading
                        ? "linear-gradient(135deg,#a8d8ea,#7ec8e3)"
                        : "linear-gradient(135deg,#7ec8e3,#4aafda)",
                      color: "#fff", border: "none", borderRadius: "50px",
                      fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 6px 24px rgba(74,175,218,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(74,175,218,0.5)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(74,175,218,0.4)"; }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Saving…
                      </>
                    ) : "Begin My UHUM Journey →"}
                  </button>
                  {webhookError && (
                    <p style={{ fontSize: "0.75rem", color: "#f87171", textAlign: "center", marginTop: 10 }}>
                      ⚠️ {webhookError}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            <p style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "center", marginTop: 20, position: "relative", zIndex: 1 }}>
              🔒 Your data is encrypted and never shared.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal: renders DIRECTLY into document.body, outside the transformed page-root div
  return createPortal(modal, document.body);
}
