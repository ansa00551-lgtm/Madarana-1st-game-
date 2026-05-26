export default async function handler(req, res) {
    // إعدادات الـ CORS صحيحة وتشير إلى Vercel كما طلبت الصورة السابقة
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://madarana-1st-game.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // التعامل مع طلبات الفحص المبدئية (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // منع أي نوع طلبات آخر غير POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, prompt, gameName } = req.body;

    // --------------------------------------------------------
    // الجزء الأول: البحث عن لعبة في RAWG (مع جلب 10 نتائج)
    // --------------------------------------------------------
    if (type === 'search_game') {
        const RAWG_KEY = process.env.RAWG_API_KEY;
        if (!RAWG_KEY) {
            return res.status(500).json({ error: 'مفتاح RAWG غير معرف في السيرفر' });
        }
        try {
            const rawgResponse = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(gameName)}&page_size=10`);
            const data = await rawgResponse.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات اللعبة من RAWG' });
        }
    }

    // --------------------------------------------------------
    // الجزء الثاني: الاتصال بـ Gemini (تم تحديث الموديل هنا)
    // --------------------------------------------------------
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'مفتاح Gemini غير معرف في السيرفر' });
    }

    try {
        // تم استبدال gemini-pro بالموديل الجديد المحدد في الصورة: gemini-2.5-flash-preview-05-20
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' });
    }
}
