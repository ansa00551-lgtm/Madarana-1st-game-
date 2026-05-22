// دالة جلب بيانات اللعبة من RAWG عبر سيرفر Vercel
export async function getGameData(nameOfGame: string) {
    const proxyUrl = 'https://game-analyzer-proxy.vercel.app/api/analyze';
    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'search_game',
                gameName: nameOfGame
            })
        });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0]; // إرجاع بيانات اللعبة كاملة
        }
        return null;
    } catch (error) {
        console.error("خطأ في جلب بيانات اللعبة:", error);
        return null;
    }
}

// دالة تحليل الأداء من Gemini عبر سيرفر Vercel
export async function checkGamePerformance(userSpecs: string, gameName: string) {
    const proxyUrl = 'https://game-analyzer-proxy.vercel.app/api/analyze';
    const textPrompt = `مواصفات جهازي هي: ${userSpecs}. هل يمكنني تشغيل لعبة ${gameName}؟ أعطني الـ FPS المتوقع وأفضل الإعدادات.`;
    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textPrompt })
        });
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text; // إرجاع نص الذكاء الاصطناعي
        }
        return "عذراً، لم أتمكن من تحليل البيانات في الوقت الحالي.";
    } catch (error) {
        console.error("خطأ في الاتصال بالذكاء الاصطناعي:", error);
        return "حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.";
    }
}
