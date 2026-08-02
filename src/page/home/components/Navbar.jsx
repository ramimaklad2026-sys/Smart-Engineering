import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLanguage);

    document.documentElement.dir =
      newLanguage === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = newLanguage;
  };

  const navLinks = [t("Features"), t("How It Works"), t("About")];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 py-3" : "bg-transparent py-5"
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
          <Link to="/login">
            <button
              className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
            >
              {t('SignIn')}
            </button>
          </Link>
          <Link to="/register">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {t('GetStarted')}
            </button>
          </Link>
          <button
            onClick={changeLanguage}
            className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
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
            <Link to="/login">
              <button
                className="w-full text-center text-gray-300 border border-gray-700 hover:border-gray-500 text-sm py-2.5 rounded-lg transition-colors"
              >
                {t('SignIn')}
              </button>
            </Link>
            <Link to="/register">
              <button
                className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {t('GetStarted')}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}