import React, { useState } from 'react';
import { getGameData, checkGamePerformance } from './api';

// تعريف واجهة البيانات المستلمة من RAWG لتجنب مشاكل الـ Types
interface GameData {
  name: string;
  background_image: string;
  rating?: number;
  released?: string;
}

export default function App() {
  // حالات الإدخال (Inputs)
  const [gameName, setGameName] = useState<string>('');
  const [userSpecs, setUserSpecs] = useState<string>('');

  // حالات العرض والتحميل (UI States)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // حالات تخزين البيانات المستلمة (Results)
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<string | null>(null);

  // دالة معالجة الطلب عند الضغط على زر التحليل
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من إدخال البيانات المطلوبة
    if (!gameName.trim() || !userSpecs.trim()) {
      setError('يرجى كتابة اسم اللعبة ومواصفات جهازك أولاً لبدء التحليل.');
      return;
    }

    // تهيئة الواجهة لبدء التحميل وتصفير الحالات السابقة
    setIsLoading(true);
    setError(null);
    setGameData(null);
    setPerformanceAnalysis(null);

    try {
      // استدعاء دالتي RAWG و Gemini معاً بالتوازي لتسريع العملية (Parallel Fetching)
      const [fetchedGame, fetchedAnalysis] = await Promise.all([
        getGameData(gameName),
        checkGamePerformance(userSpecs, gameName)
      ]);

      // تحديث الحالات بالبيانات المستلمة
      if (fetchedGame) {
        setGameData(fetchedGame);
      } else {
        // في حال لم يعثر محرك RAWG على اللعبة ولكن التحليل نجح
        setGameData({
          name: gameName,
          background_image: '', // ستظهر واجهة بديلة في حال غياب الصورة
        });
      }

      if (fetchedAnalysis) {
        setPerformanceAnalysis(fetchedAnalysis);
      } else {
        throw new Error('لم نتمكن من الحصول على تحليل الأداء من الذكاء الاصطناعي.');
      }

    } catch (err: any) {
      console.error('حدث خطأ أثناء الاتصال:', err);
      setError('عذراً، فشل الاتصال بالسيرفر الوسيط. يرجى التحقق من اتصالك بالشبكة أو المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-violet-500 selection:text-white">
      
      {/* الجزء العلوي (Header) */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Game Analyzer
              </h1>
              <p className="text-[10px] text-slate-500 font-mono">POWERED BY AI</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Client-Side Connected
          </span>
        </div>
      </header>

      {/* المحتوى الرئيسي للموقع */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* العمود الأيسر: نموذج الإدخال (Form) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-violet-400">
                <span>⚡</span> فحص الأداء المتوقع
              </h2>
              
              <form onSubmit={handleAnalyze} className="space-y-5">
                {/* اسم اللعبة */}
                <div>
                  <label htmlFor="gameName" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    اسم اللعبة المستهدفة
                  </label>
                  <input
                    type="text"
                    id="gameName"
                    placeholder="مثال: Cyberpunk 2077, GTA V..."
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200"
                  />
                </div>

                {/* مواصفات الجهاز */}
                <div>
                  <label htmlFor="userSpecs" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    مواصفات جهازك الحالية
                  </label>
                  <textarea
                    id="userSpecs"
                    rows={4}
                    placeholder="مثال: CPU: Intel i5-12400F, GPU: RTX 3060 12GB, RAM: 16GB"
                    value={userSpecs}
                    onChange={(e) => setUserSpecs(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200 resize-none leading-relaxed"
                  />
                </div>

                {/* زر الفحص والتحليل */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-indigo-500/10 active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>جاري فحص وتجميع البيانات...</span>
                    </>
                  ) : (
                    <>
                      <span>▶ تشغيل اختبار الأداء</span>
                    </>
                  )}
                </button>
              </form>

              {/* صندوق عرض رسائل الخطأ */}
              {error && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-sm flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-base">⚠️</span>
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* العمود الأيمن: عرض النتائج (Results Display) */}
          <div className="lg:col-span-7">
            
            {/* حالة الاستعداد الافتراضية قبل إجراء أي فحص */}
            {!isLoading && !gameData && !performanceAnalysis && (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl mb-4 border border-slate-800 text-slate-500">
                  🔍
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-300">في انتظار مدخلاتك</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                  أدخل اسم اللعبة ومواصفات حاسوبك في الجهة الجانبية، ثم اضغط على زر التحليل لبدء استعراض الأداء المتوقع من خادم الذكاء الاصطناعي.
                </p>
              </div>
            )}

            {/* هيكل التحميل الشبح (Skeleton Loading Loader) */}
            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="bg-slate-900/50 rounded-2xl h-48 border border-slate-800" />
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="h-6 bg-slate-800 rounded-full w-1/3" />
                  <div className="h-4 bg-slate-800 rounded-full w-full" />
                  <div className="h-4 bg-slate-800 rounded-full w-5/6" />
                  <div className="h-4 bg-slate-800 rounded-full w-4/5" />
                </div>
              </div>
            )}

            {/* عرض النتائج الحقيقية */}
            {!isLoading && (gameData || performanceAnalysis) && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 1. بطاقة معلومات اللعبة (RAWG) */}
                {gameData && (
                  <div className="relative rounded-2xl overflow-hidden h-48 border border-slate-900 shadow-xl group">
                    {gameData.background_image ? (
                      <img
                        src={gameData.background_image}
                        alt={gameData.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                        لا تتوفر صورة لهذه اللعبة في قاعدة البيانات
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase bg-violet-950/60 border border-violet-800 px-2 py-0.5 rounded">
                          RAWG DATABASE
                        </span>
                        <h2 className="text-2xl font-black mt-1 text-white leading-tight drop-shadow-md">
                          {gameData.name}
                        </h2>
                      </div>
                      {gameData.rating && (
                        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-1 shadow-lg">
                          ⭐ {gameData.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. بطاقة تحليل أداء جمني (Gemini Analysis) */}
                {performanceAnalysis && (
                  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-900">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
                        🧠 تحليل الأداء المعتمد من Gemini AI
                      </h3>
                    </div>

                    {/* نص التحليل المفصل مع الحفاظ على التسطير التلقائي */}
                    <div className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                      {performanceAnalysis}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </main>

      {/* التذييل (Footer) */}
      <footer className="border-t border-slate-900 py-6 bg-slate-950 text-center">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Game Analyzer Proxy. جميع الحقوق محفوظة لـ PWA App.
        </p>
      </footer>

    </div>
  );
}
