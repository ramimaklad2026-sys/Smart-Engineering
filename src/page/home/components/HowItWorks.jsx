import { useTranslation } from 'react-i18next';

export default function HowItWorks({ useInView }) {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const STEPS = [
    { number: "01", title: t('howItWorks.steps.step1.title'), desc: t('howItWorks.steps.step1.desc') },
    { number: "02", title: t('howItWorks.steps.step2.title'), desc: t('howItWorks.steps.step2.desc') },
    { number: "03", title: t('howItWorks.steps.step3.title'), desc: t('howItWorks.steps.step3.desc') },
    { number: "04", title: t('howItWorks.steps.step4.title'), desc: t('howItWorks.steps.step4.desc') },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            {t('howItWorks.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('howItWorks.description')}
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
              className={`relative transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
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