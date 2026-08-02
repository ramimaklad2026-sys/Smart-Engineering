import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";

// ─── Hook: Intersection Observer for scroll animations ───
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}


// ─── Main Component ───
export default function LandingPage({ onNavigate }) {

  const handleNavigate = (page) => {
    onNavigate(page);
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <Features useInView={useInView} />
      <HowItWorks useInView={useInView} />
      <CTA onNavigate={handleNavigate} useInView={useInView} />
      <Footer />
    </div>
  );
}