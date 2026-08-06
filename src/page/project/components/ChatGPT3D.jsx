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

  const promptLink = "https://chatgpt.com/?q=TASK%3A%20Convert%20the%20input%202D%20floor%20plan%20into%20a%20photorealistic%2C%20top%E2%80%91down%203D%20architectural%20render.%0A%0ASTRICT%20REQUIREMENTS%20%28do%20not%20violate%29%3A%0A1%29%20REMOVE%20ALL%20TEXT%3A%20Do%20not%20render%20any%20letters%2C%20numbers%2C%20labels%2C%20dimensions%2C%20or%20annotations.%20Floors%20must%20be%20continuous%20where%20text%20used%20to%20be.%0A2%29%20GEOMETRY%20MUST%20MATCH%3A%20Walls%2C%20rooms%2C%20doors%2C%20and%20windows%20must%20follow%20the%20exact%20lines%20and%20positions%20in%20the%20plan.%20Do%20not%20shift%20or%20resize.%0A3%29%20TOP%E2%80%91DOWN%20ONLY%3A%20Orthographic%20top%E2%80%91down%20view.%20No%20perspective%20tilt.%0A4%29%20CLEAN%2C%20REALISTIC%20OUTPUT%3A%20Crisp%20edges%2C%20balanced%20lighting%2C%20and%20realistic%20materials.%20No%20sketch%2Fhand%E2%80%91drawn%20look.%0A5%29%20NO%20EXTRA%20CONTENT%3A%20Do%20not%20add%20rooms%2C%20furniture%2C%20or%20objects%20that%20are%20not%20clearly%20indicated%20by%20the%20plan.%0A%0ASTRUCTURE%20%26%20DETAILS%3A%0A-%20Walls%3A%20Extrude%20precisely%20from%20the%20plan%20lines.%20Consistent%20wall%20height%20and%20thickness.%0A-%20Doors%3A%20Convert%20door%20swing%20arcs%20into%20open%20doors%2C%20aligned%20to%20the%20plan.%0A-%20Windows%3A%20Convert%20thin%20perimeter%20lines%20into%20realistic%20glass%20windows.%0A%0AFURNITURE%20%26%20ROOM%20MAPPING%20%28only%20where%20icons%2Ffixtures%20are%20clearly%20shown%29%3A%0A-%20Bed%20icon%20%E2%86%92%20realistic%20bed%20with%20duvet%20and%20pillows.%0A-%20Sofa%20icon%20%E2%86%92%20modern%20sectional%20or%20sofa.%0A-%20Dining%20table%20icon%20%E2%86%92%20table%20with%20chairs.%0A-%20Kitchen%20icon%20%E2%86%92%20counters%20with%20sink%20and%20stove.%0A-%20Bathroom%20icon%20%E2%86%92%20toilet%2C%20sink%2C%20and%20tub%2Fshower.%0A-%20Office%2Fstudy%20icon%20%E2%86%92%20desk%2C%20chair%2C%20and%20minimal%20shelving.%0A-%20Porch%2Fpatio%2Fbalcony%20icon%20%E2%86%92%20outdoor%20seating%20or%20simple%20furniture%20%28keep%20minimal%29.%0A-%20Utility%2Flaundry%20icon%20%E2%86%92%20washer%2Fdryer%20and%20minimal%20cabinetry.%0A%0ASTYLE%20%26%20LIGHTING%3A%0A-%20Lighting%3A%20bright%2C%20neutral%20daylight.%20High%20clarity%20and%20balanced%20contrast.%0A-%20Materials%3A%20realistic%20wood%2Ftile%20floors%2C%20clean%20walls%2C%20subtle%20shadows.%0A-%20Finish%3A%20professional%20architectural%20visualization%3B%20no%20text%2C%20no%20watermarks%2C%20no%20logos";
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
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-6">
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
            <a
              href={promptLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="group cursor-pointer inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                Open ChatGPT
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
            </a>
         

          <p className="mt-5 text-sm text-slate-500">
            سيتم تعبئة البرومبت تلقائياً بعد فتح ChatGPT.
          </p>
        </div>

      </div>
    </div>
  );
}0