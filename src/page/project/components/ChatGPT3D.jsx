import {
  Sparkles,
  MousePointerClick,
  Upload,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

export default function ChatGPT3D() {
  const handleOpenChatGPT = () => {
    // سيتم وضع الرابط لاحقاً
    console.log("Open ChatGPT");
  };

  const steps = [
    {
      icon: MousePointerClick,
      title: "Open ChatGPT",
      description:
        "اضغط على الزر في الأسفل وسيتم فتح ChatGPT مع تعبئة البرومبت بشكل تلقائي.",
    },
    {
      icon: Upload,
      title: "Upload Blueprint",
      description:
        "بعد فتح ChatGPT قم بإرفاق صورة المخطط (Blueprint) مع البرومبت.",
    },
    {
      icon: ImageIcon,
      title: "Generate 3D Result",
      description:
        "سيقوم الذكاء الاصطناعي بتحليل المخطط وإرجاع تصور ثلاثي الأبعاد وفق البرومبت.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400 text-sm">
            <Sparkles size={16} />
            AI Powered
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            ChatGPT 3D
          </h1>

          <p className="mt-5 text-slate-400 max-w-2xl mx-auto leading-8">
            قم بتحويل مخططاتك الهندسية إلى تصور ثلاثي الأبعاد باستخدام ChatGPT
            والذكاء الاصطناعي خلال دقائق.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-7 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                    <Icon className="text-emerald-400" size={28} />
                  </div>

                  <span className="text-5xl font-bold text-slate-800">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-semibold text-xl mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-400 leading-7 text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 mb-10">
          <div className="flex gap-4">
            <Sparkles className="text-amber-400 mt-1" size={24} />

            <div>
              <h4 className="font-semibold text-lg mb-2">
                قبل البدء
              </h4>

              <p className="text-slate-300 leading-7">
                بعد الضغط على الزر سيتم فتح ChatGPT مع برومبت جاهز.
                <br />
                كل ما عليك هو إرفاق صورة المخطط ثم إرسال الرسالة،
                وسيقوم الذكاء الاصطناعي بإنشاء تصور ثلاثي الأبعاد للمخطط
                وفق التعليمات الموجودة داخل البرومبت.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            onClick={handleOpenChatGPT}
            className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Open ChatGPT
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>

          <p className="mt-5 text-sm text-slate-500">
            سيتم تعبئة البرومبت تلقائياً بعد فتح ChatGPT.
          </p>
        </div>

      </div>
    </div>
  );
}0