import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileBox, FileBoxIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const GeminiChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

      const result = await model.generateContent(userMessage.text);
      const text = result.response.text();

      setMessages((prev) => [...prev, { text: text, isUser: false }]);
    } catch (error) {
      console.error("حدث خطأ:", error);
      setMessages((prev) => [
        ...prev,
        { text: "عذراً، حدث خطأ أثناء جلب البيانات.", isUser: false, isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="h-[645px] bg-gray-50 dark:bg-gray-900 bp-16 text-gray-800 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300"
      dir="rtl"
    >
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            المساعد الذكي  🤖
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
              <p className="text-lg">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? 'justify-start' : 'justify-end'}`} // المستخدم على اليمين (بسبب rtl)، والرد على اليسار
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm ${msg.isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : msg.isError
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-tl-none'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none text-gray-800 dark:text-gray-200'
                  }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-end">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="flex bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 sticky bottom-0">
        <Link to="/chatgpt3d" className=" bg-gray-200 dark:bg-gray-700 py-2 px-4 mx-2 rounded-full hover:bg-gray-300 dark:hover:bg-blue-600 border border-blue-500 shadow-lg shadow-blue-500/90 transition-colors">
          <FileBoxIcon />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto relative flex items-end gap-2 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-1 focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!loading) handleSubmit(e);
              }
            }}
            placeholder="اسألني أي شيء..."
            rows="1"
            className="w-full bg-transparent resize-none outline-none p-2 max-h-30 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            style={{ minHeight: '50px' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mb-1 ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default GeminiChat;