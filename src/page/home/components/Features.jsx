import { useTranslation } from 'react-i18next';

export default function Features({ useInView }) {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  // تم نقل المصفوفة إلى داخل المكون لتتمكن من استخدام دالة الترجمة t
  const FEATURES = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      title: t('features.list.projectManagement.title'),
      desc: t('features.list.projectManagement.desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('features.list.teamCollaboration.title'),
      desc: t('features.list.teamCollaboration.desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('features.list.aiTool.title'),
      desc: t('features.list.aiTool.desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t('features.list.clientReview.title'),
      desc: t('features.list.clientReview.desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: t('features.list.engineerProfile.title'),
      desc: t('features.list.engineerProfile.desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: t('features.list.smartDashboard.title'),
      desc: t('features.list.smartDashboard.desc'),
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            {t('features.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('features.description')}
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
              className={`group bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-xl p-6 transition-all duration-500 hover:bg-gray-900/80 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
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