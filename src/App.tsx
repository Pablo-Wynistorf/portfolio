import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";
import { Intro } from "@/components/Intro";
import Home from "@/pages/Home";
import ProjectPage from "@/pages/ProjectPage";
import CertificationPage from "@/pages/CertificationPage";
import CvPage from "@/pages/CvPage";
import NotFound from "@/pages/NotFound";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // wait for the page transition to mount the target
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 350);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -24, filter: "blur(12px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <CursorGlow />
      <ScrollManager />
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/projects/:slug" element={<Page><ProjectPage /></Page>} />
          <Route path="/certifications/:slug" element={<Page><CertificationPage /></Page>} />
          <Route path="/p/cv" element={<Page><CvPage /></Page>} />
          {/* Legacy Hugo URLs */}
          <Route path="/p/about-me" element={<Navigate to="/#about" replace />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
          <Route path="/certifications" element={<Navigate to="/#certifications" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  );
}
