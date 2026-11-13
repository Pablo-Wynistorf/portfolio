import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { ChatWidget } from "@/components/chat/ChatWidget";
import Home from "@/pages/Home";
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));
const CertificationPage = lazy(() => import("@/pages/CertificationPage"));
const CvPage = lazy(() => import("@/pages/CvPage"));
import NotFound from "@/pages/NotFound";
const MdViewer = lazy(() => import("@/pages/MdViewer"));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // wait for the page transition to mount the target
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 650);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

/** Page change: an ink panel sweeps up over the old page, then off the new one. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[150] bg-ink"
        initial={{ y: "0%" }}
        animate={{ y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }}
        exit={{ y: ["100%", "0%"], transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.01 } }}
        exit={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        {children}
      </motion.main>
    </>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <ScrollManager />
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname.startsWith("/md") ? "/md" : location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/projects/:slug" element={<Page><Suspense fallback={<div className="min-h-screen" />}><ProjectPage /></Suspense></Page>} />
          <Route path="/certifications/:slug" element={<Page><Suspense fallback={<div className="min-h-screen" />}><CertificationPage /></Suspense></Page>} />
          <Route path="/p/cv" element={<Page><Suspense fallback={<div className="min-h-screen" />}><CvPage /></Suspense></Page>} />
          <Route path="/md/*" element={<Page><Suspense fallback={<div className="min-h-screen" />}><MdViewer /></Suspense></Page>} />
          {/* Legacy Hugo URLs */}
          <Route path="/p/about-me" element={<Navigate to="/#about" replace />} />
          <Route path="/projects" element={<Navigate to="/#work" replace />} />
          <Route path="/certifications" element={<Navigate to="/#certifications" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="/tags/*" element={<Navigate to="/#work" replace />} />
          <Route path="/categories/*" element={<Navigate to="/#work" replace />} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ChatWidget />
    </MotionConfig>
  );
}
