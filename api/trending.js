export default async function handler(req, res) {
    // 1. إعدادات الأمان والسماح لموقعك فقط بالاتصال
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://madarana-1st-game.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); // نكتفي بـ GET لأننا نجلب بيانات فقط
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // التعامل مع طلبات الفحص المبدئية من المتصفح (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // لطلب التريند، المتصفح سيرسل طلب من نوع GET، نمنع أي نوع آخر
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const RAWG_KEY = process.env.RAWG_API_KEY;
    if (!RAWG_KEY) {
        return res.status(500).json({ error: 'مفتاح RAWG غير معرف في السيرفر' });
    }

    try {
        // جلب أكثر 10 ألعاب شعبية ورائجة تم إصدارها في الفترة الأخيرة تلقائياً
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&ordering=-added&page_size=10`);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'حدث خطأ أثناء جلب ألعاب التريند من RAWG' });
    }
}
