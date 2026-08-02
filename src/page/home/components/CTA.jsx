export default function CTA({ onNavigate, useInView }) {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          ref={ref}
          className={`bg-gradient-to-br from-blue-600/20 via-gray-900 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-12 md:p-16 transition-all duration-700 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
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