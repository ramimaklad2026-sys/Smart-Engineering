import { useState, useEffect, useRef } from "react";

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

// ─── Data ───
const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    title: "Project Management",
    desc: "Organize engineering projects from concept to delivery. Track milestones, deadlines, and team progress in real time.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Team Collaboration",
    desc: "Work seamlessly with your engineering team. Share files, leave comments, and stay aligned on every project.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI 2D to 3D Tool",
    desc: "Upload a 2D architectural or engineering drawing and let AI transform it into a detailed 3D model instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Client Review Page",
    desc: "Share project progress with clients through a clean review portal. Collect feedback and approvals without back-and-forth emails.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Engineer Profile",
    desc: "Showcase your skills, certifications, and completed projects. Build a professional portfolio that gets noticed.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Smart Dashboard",
    desc: "Get a bird's-eye view of all your projects, tasks, and team activity. Make informed decisions with live analytics.",
  },
];

const STEPS = [
  { number: "01", title: "Create Your Account", desc: "Sign up with your engineering specialty and set up your professional profile in minutes." },
  { number: "02", title: "Start or Join a Project", desc: "Create a new engineering project or get invited to an existing team by your organization." },
  { number: "03", title: "Collaborate & Build", desc: "Use the full suite of tools — AI drawing conversion, client reviews, and team collaboration." },
  { number: "04", title: "Deliver with Confidence", desc: "Track progress, meet deadlines, and share polished results with clients and stakeholders." },
];

const STATS = [
  { value: "500+", label: "Engineers" },
  { value: "1,200+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "40+", label: "Engineering Specialties" },
];

// ─── Sub-components ───

function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Features", "How It Works", "About"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">BuildSphere</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                const el = document.getElementById(link.toLowerCase().replace(" ", "-"));
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen((p) => !p)}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/98 border-t border-gray-800 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                setMenuOpen(false);
                const el = document.getElementById(link.toLowerCase().replace(" ", "-"));
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="block w-full text-left text-gray-400 hover:text-white text-sm py-2 transition-colors"
            >
              {link}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onNavigate("login")}
              className="w-full text-center text-gray-300 border border-gray-700 hover:border-gray-500 text-sm py-2.5 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-300 text-xs font-medium tracking-wide">Smart Engineering Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          Build Better.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Engineer Smarter.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          The all-in-one platform for engineers to manage projects, collaborate with teams,
          convert drawings with AI, and deliver professional results to clients.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("register")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Get Started Free
          </button>
          <button
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-lg text-base transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See Features
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

function Features() {
  const [ref, inView] = useInView();

  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">Platform Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            Everything engineers need
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From project kickoff to client delivery — BuildSphere has the tools your team needs to work efficiently.
          </p>
        </div>

        {/* Feature grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-500 hover:bg-gray-900/80 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" className="py-24 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            No complex setup. No steep learning curve. Get your team onboarded and working fast.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-full h-px bg-gradient-to-r from-blue-500/30 to-transparent z-10" />
              )}

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full">
                <div className="text-3xl font-bold text-blue-500/30 mb-4 font-mono">{step.number}</div>
                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onNavigate }) {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          ref={ref}
          className={`bg-gradient-to-br from-blue-600/20 via-gray-900 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-12 md:p-16 transition-all duration-700 ${
            inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform how<br />your team engineers?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join hundreds of engineers already using BuildSphere to deliver better projects, faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("register")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="w-full sm:w-auto text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-lg transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">BuildSphere</span>
        </div>

        <p className="text-gray-600 text-xs text-center">
          © 2026 BuildSphere. Smart Engineering Platform. All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <button key={item} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Main Component ───
export default function LandingPage({ onNavigate }) {

  const handleNavigate = (page) => {
    onNavigate(page); // استدعاء التنقل الحقيقي الممرر من App.jsx
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <Features />
      <HowItWorks />
      <CTA onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}