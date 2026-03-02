import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/emodna/Navbar";
import HeroSection from "@/components/emodna/HeroSection";
import FeaturesOverview from "@/components/emodna/FeaturesOverview";
import UHUMSpotlight from "@/components/emodna/EmoDNASpotlight";
import HowItWorks from "@/components/emodna/HowItWorks";
import DashboardPreview from "@/components/emodna/DashboardPreview";
import AllFeatures from "@/components/emodna/AllFeatures";
import Testimonials from "@/components/emodna/Testimonials";
import PricingSection from "@/components/emodna/PricingSection";
import CTASection from "@/components/emodna/CTASection";
import Footer from "@/components/emodna/Footer";
import SignupModal from "@/components/emodna/SignupModal";
import Notification from "@/components/emodna/Notification";
import UhumIntro from "@/components/UhumIntro";
// UniverseExpansion bridge removed — website appears immediately after intro

/*
  2-Stage loading flow:
  ┌──────────┐    intro done     ┌──────┐
  │  intro   │ ───────────────►  │ live │
  └──────────┘                   └──────┘
  UhumIntro overlay          Website fully revealed instantly
  (z 9999)
*/
type Stage = "intro" | "live";

function AppContent() {
  const [showModal, setShowModal] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; icon: string } | null>(null);
  const { calmMode } = useTheme();

  /* ── Determine initial stage (skip intro if already seen) ── */
  const [stage, setStage] = useState<Stage>(() => {
    if (typeof window === "undefined") return "live";
    const seen = sessionStorage.getItem("uhum_intro_seen");
    return seen ? "live" : "intro";
  });

  /* Track if intro overlay should remain mounted */
  const [introMounted, setIntroMounted] = useState(stage === "intro");

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem("uhum_intro_seen", "1");
    setStage("live");         // jump straight to live — no bridge delay
    setIntroMounted(false);  // unmount intro overlay instantly
  }, []);

  /* Apply data-calm to <body> */
  useEffect(() => {
    document.body.setAttribute("data-calm", String(calmMode));
  }, [calmMode]);

  const triggerNotif = (msg: string, icon = "✅") => {
    setNotif({ msg, icon });
    setTimeout(() => setNotif(null), 3500);
  };

  const isLive = stage === "live";

  return (
    <>
      {/* ── Phase 1: UHUM cinematic intro ───────────────────────── */}
      <AnimatePresence>
        {introMounted && (
          <UhumIntro key="uhum-intro" onComplete={handleIntroDone} />
        )}
      </AnimatePresence>

      {/* ── Phase 2: Main website (appears immediately after intro) ── */}
      <motion.div
        id="page-root"
        style={{ transformStyle: "preserve-3d", willChange: "transform, filter" }}
        initial={{ opacity: stage !== "live" ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0,   // instant — no fade-in delay
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Navbar onOpenModal={() => setShowModal(true)} />

        {/* HeroSection receives `revealed` for its staggered entrance */}
        <HeroSection
          onOpenModal={() => setShowModal(true)}
          revealed={isLive}
        />

        <FeaturesOverview />
        <UHUMSpotlight />
        <HowItWorks />
        <DashboardPreview />
        <AllFeatures />
        <Testimonials />
        <PricingSection onOpenModal={() => setShowModal(true)} />
        <CTASection onOpenModal={() => setShowModal(true)} />
        <Footer />

        <SignupModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() =>
            triggerNotif("Welcome to UHUM! Your journey begins now.", "🧬")
          }
        />

        {notif && <Notification message={notif.msg} icon={notif.icon} />}
      </motion.div>
    </>
  );
}

const Index = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default Index;
