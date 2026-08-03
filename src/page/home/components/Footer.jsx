import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

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
          <span className="text-white font-semibold text-sm">{t('footer.brand')}</span>
        </div>

        <p className="text-gray-600 text-xs text-center">
          {t('footer.copyright')}
        </p>

        <div className="flex items-center gap-5">
          {["privacy", "terms", "contact"].map((item) => (
            <button key={item} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              {t(`footer.${item}`)}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}