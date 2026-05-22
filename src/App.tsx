import { getGameData, checkGamePerformance } from './api';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  Search, 
  Laptop, 
  Smartphone, 
  Tv, 
  Smartphone as HandheldIcon,
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Activity, 
  Languages, 
  Sliders, 
  HardDrive,
  Clock,
  Layers,
  ChevronRight,
  Gauge,
  Flame,
  Download,
  History,
  Check,
  RotateCcw,
  ExternalLink
} from "lucide-react";

import { Game, SystemSpecs, AnalysisResult } from "./types";
import { 
  CONSOLE_BRANDS, 
  CONSOLE_MODELS, 
  HANDHELD_BRANDS, 
  HANDHELD_MODELS, 
  APPLE_DEVICES_TREE, 
  POPULAR_FALLBACK_GAMES,
  ConsolePreset
} from "./data";

const LOCAL_STORAGE_SPECS_KEY = "gaming_spec_analyzer_specs_v2";
const LOCAL_STORAGE_HISTORY_KEY = "gaming_spec_analyzer_history_v2";

const translations = {
  ar: {
    appTitle: "محلل توافق العتاد وتشغيل الألعاب الذكي",
    appSub: "تأكد من توافق عتاد حاسوبك، الجوال أو جهاز الألعاب المخصص والمنصات المحمولة مع أحدث الألعاب العالمية بدعم الذكاء الاصطناعي وجوجل جيميناي وقاعدة RAWG.",
    searchPlaceholder: "ابحث عن اللعبة التي تود فحصها (مثال: GTA V, Cyberpunk, Witcher)...",
    searchTitle: "1. اختر اللعبة المراد فحصها",
    popularGames: "ألعاب شائعة في قاعدة البيانات:",
    specTitle: "2. أدخل مواصفات جهازك الحالية",
    deviceType: "نوع منصة اللعب",
    brandLabel: "الشركة المصنعة",
    modelLabel: "الموديل / الجيل",
    desktopMode: "كمبيوتر مكتبي / محمول",
    consoleMode: "جهاز كونسول منزلي",
    handheldMode: "جهاز ألعاب محمول (Handheld)",
    mobileMode: "هاتف ذكي / لوحي",
    cpu: "المعالج (CPU)",
    gpu: "كرت الشاشة (GPU)",
    ram: "الذاكرة العشوائية (RAM)",
    vram: "ذاكرة الشاشة (VRAM)",
    ramSpeed: "سرعة الرام MHZ",
    overclock: "وضعية كسر السرعة (Overclock Mode)",
    overclockOn: "نشط (+7% أداء)",
    overclockOff: "إيقاف",
    storage: "المساحة المتاحة للعبة",
    storageType: "بنية التخزين المثبتة",
    os: "نظام التشغيل",
    fastAnalysisTitle: "3. نتائج فحص الأداء الفوري (Local Hardware Check)",
    noGameSelected: "الرجاء اختيار لعبة للبدء في حساب التوافق الفوري.",
    passed: "✔ متوافق تماماً",
    warning: "⚠ تشغيل متدني / متعب",
    failed: "✘ غير متوافق",
    gpuShaders: "دعم ميزات الرندرة وتظليل الكرت (Shaders)",
    renderOk: "✔ يدعم تظليل الرسوم الحديثة",
    aged: "⚠ بنية كرت قديمة نسبياً",
    outdated: "✘ كرت شاشة قديم جداً لا يدعم متطلبات اللعبة",
    estFps: "معدل الإطارات المتوقع بالثانية",
    resolution: "الدقة المقترحة وجودة العرض",
    bottleneck: "موقع عنق الزجاجة (Bottleneck)",
    verdict: "تقرير ملاءمة التشغيل العام",
    aiBtn: "🧠 تشغيل تحليل الذكاء الاصطناعي السحابي العميق (Gemini Cloud Scan)",
    aiAnalyzing: "جاري ربط العتاد واستقصاء خوادم جيميناي...",
    aiFullAnalysis: "توليد فحص متطور بواسطة Gemini AI",
    offlineWarning: "يعمل التطبيق في وضعه السحابي المشترك بشكل آمن.",
    compatibilitySummary: "📝 ملخص أداء النظام العام",
    optimalSettings: "🔧 إعدادات الرسوم المثالية للتجربة",
    detailedMetrics: "📊 تفاصيل معالجة العتاد وعنق الزجاجة",
    overallScore: "معدل تشغيل اللعبة المتوقع",
    specsOfSelected: "المتطلبات الرسمية للعبة المختارة:",
    genre: "التصنيف",
    released: "تاريخ الإصدار",
    reqMin: "مواصفات التشغيل الصغرى للعبة (Minimum)",
    reqRec: "المواصفات الموصى بها للعبة (Recommended)",
    notSpecified: "غير محدد",
    historyTitle: "الألعاب المفحوصة مؤخراً (Offline History)",
    hasNoHistory: "لا توجد ألعاب مفحوصة مؤخراً بالذاكرة المحلية.",
    clearHistoryBtn: "مسح السجل",
    installBtnText: "تثبيت كتحميل تطبيق مستقل (PWA)",
    pwaAlreadyInstalled: "التطبيق مثبت بالفعل أو شاشتك لا تدعم التثبيت التلقائي.",
    pwaSuccess: "تم تهيئة بيئة التثبيت بنجاح!",
    autoScanBtn: "مسح تلقائي ذكي للعتاد ⚡ (Smart Auto-Scan)",
    autoScanRunning: "جاري فحص خيوط المعالج ومنافذ الرسوميات وWebGL 2.0...",
    autoScanSuccess: "اكتمل المسح التلقائي وتعبئة القطع بنجاح!",
    pcCategoryLabel: "بيئة تشغيل الكمبيوتر",
    customPcOpt: "نظام كمبيوتر مستقل (Windows / Linux)",
    appleMacOpt: "أنظمة آبل ماكنتوش مسبقة الإعداد (macOS)",
    pcSubTypeLabel: "نوع تصميم الحاسوب",
    desktopSubType: "كمبيوتر مكتبي قياسي (Desktop)",
    laptopSubType: "كمبيوتر محمول (Laptop/Notebook)",
    motherboardLabel: "اسم لوحة أم التجميعة (Motherboard Model)",
    laptopModelLabel: "الموديل التجاري للابتوب (Laptop Model Name)",
    mobilePlatformLabel: "بيئة تشغيل الجوال",
    appleIosOpt: "أجهزة أبل المحمولة (iOS iPhone)",
    androidOpt: "أندرويد والمنصات الأخرى (Android / Other)",
    appleFamilyLabel: "فئة الجهاز",
    appleGenLabel: "الجيل وسلسلة السيليكون (Generation)",
    appleTierLabel: "الموديل ومستوى المعالجة (Tier)",
    validationError: "فشل فحص العتاد! يرجى إدخال أسماء حقيقية للقطع (مثال: Intel i5, Core i7, Ryzen 5 للمعالج، أو GTX 1060, RTX 3060, Radeon RX لكرت الشاشة). لتفادي الغش والعشوائية.",
    
    // NEW ADDED DICTIONARY ENTRIES FOR COMPLETE ACCURACY (ARABIC):
    motherboardError: "برجاء إدخال اسم لوحة أم صحيح (مثال: ASUS, Gigabyte, MSI)",
    laptopError: "برجاء إدخال موديل لابتوب صحيح (مثال: Lenovo Legion, HP Omen, ASUS ROG...)",
    cpuValErrorShort: "اسم المعالج قصير للغاية!",
    cpuValErrorBrand: "الرجاء إدخال معالج حقيقي (Intel, AMD, Ryzen...)",
    gpuValErrorShort: "اسم كرت الشاشة قصير للغاية!",
    gpuValErrorBrand: "الرجاء إدخال كرت شاشة حقيقي معروف (NVIDIA GeForce, RTX, GTX, RX Radeon, Intel Arc...)",
    ramInsufficient: "ذاكرة رام النظام (RAM) غير كافية",
    gpuBound: "كرت الشاشة الرسومي يعيق الأداء (GPU Bound)",
    cpuBound: "المعالج المركزي يعيق سرعة الإطارات (CPU Bound)",
    slowStorage: "القرص الصلب البطيء تسبب ببطء التحميل",
    verdictSuper: "✔ مهارة فائقة! تشغيل رائع ومعدل رندرة فائق التفاصيل",
    verdictSmooth: "✔ تشغيل سلس ومستقر بمستوى إطارات مقنع للغاية",
    verdictMedium: "⚠ تجربة متوسطة أو منخفضة، يرجى خفض جودة الظلال والإكساء",
    verdictLow: "✘ دون متطلبات التشغيل الدُنيا. خلل وتجميد وتوقف مفاجئ متوقع",
    laptopModelPlaceholder: "مثال: Lenovo Legion 5 / ASUS ROG Zephyrus G14",
    motherboardPlaceholder: "مثال: ASUS ROG STRIX B650 / MSI Tomahawk",
    cpuPlaceholder: "مثال: Intel Core i7-12700K / Ryzen 5 7600X",
    gpuPlaceholder: "مثال: NVIDIA GeForce RTX 3060 / RX 6700 XT",
    appleHardwareProfile: "تفاصيل القطع لنظام آبل المحدد",
    appleCpu: "المعالج والشريحة المدمجة (SoC):",
    appleRam: "الذاكرة العشوائية الموحدة (RAM):",
    appleVram: "ذاكرة كرت الشاشة (VRAM):",
    appleScore: "سرعة الاستجابة المقدرة:",
    appleScoreValue: "ممتازة // خالية من عنق الزجاجة",
    activeIphoneSpecs: "تفاصيل هاتف آيفون النشط",
    processorChip: "المعالج والشريحة:",
    systemMemory: "ذاكرة الرام (Unified RAM):",
    virtualGraphics: "ذاكرة كرت الشاشة (VRAM):",
    defaultEcosystem: "نظام التشغيل الافتراضي:",
    appleIosEco: "Apple iOS Ecosystem توازن وحوسبة مثلى",
    smartphoneTabletName: "اسم الهاتف الذكي / التابلت",
    coreProcessor: "المعالج الأساسي (SoC)",
    integratedGraphics: "كرت الشاشة المدمج (GPU)",
    systemMemoryLabel: "الذاكرة العشوائية (RAM)",
    internalAllocatedStorage: "سعة التخزين المتوفرة",
    centralCpu: "معالج مركزي:",
    graphicsGpu: "معالج رسومي:",
    unifiedMemory: "ذاكرة موحدة:",
    integratedStorage: "التخزين المدمج:",
    playabilityRating: "كفاءة الطاقة والتشغيل:",
    configurationReport: "تقرير تكوين مواصفات المنصة",
    handheldApu: "معالج مخصص (APU):",
    handheldGpuCores: "كرت شاشة/أنوية:",
    handheldSharedMem: "ذاكرة مشتركة:",
    handheldStorageSpeed: "التخزين والسرعة:",
    handheldFactSheet: "ورقة حقائق الجهاز المحمول",
    activeIphoneProfile: "تفاصيل هاتف آيفون النشط",
    activeIphoneSystem: "نظام آيفون متكامل",
    androidSmartphoneTablet: "هاتف ذكي Android أو تابلت",
    smartphoneNamePlaceholder: "مثال: Galaxy S24 Ultra, Xiaomi 14 Ultra",
    smartphoneCpuPlaceholder: "Snapdragon 8 Gen 3 أو Tensor G4",
    smartphoneGpuPlaceholder: "Adreno 750 أو AMD Xclipse 940",
    activeIosSpecsTitle: "مواصفات تليفون آيفون النشط"
  },
  en: {
    appTitle: "Smart Hardware & Game Compatibility Analyzer",
    appSub: "Instantly analyze compatibility of your PC components, gaming consoles, handheld structures, or mobile specifications with any world-wide game release.",
    searchPlaceholder: "Search any game (e.g. GTA V, Cyberpunk, Witcher)...",
    searchTitle: "1. Select Game to Analyze",
    popularGames: "Popular Games in Database:",
    specTitle: "2. Input Your System Specifications",
    deviceType: "Device Category",
    brandLabel: "Platform / Brand",
    modelLabel: "Model / Generation",
    desktopMode: "Desktop / Laptop",
    consoleMode: "Dedicated Console",
    handheldMode: "Handheld Console",
    mobileMode: "Smartphone / Tablet",
    cpu: "Processor (CPU)",
    gpu: "Graphics Card (GPU)",
    ram: "Memory (RAM)",
    vram: "Video RAM (VRAM)",
    ramSpeed: "RAM Speed MHZ",
    overclock: "Overclock Toggle Modes",
    overclockOn: "Active (+7% speed)",
    overclockOff: "Standard Mode",
    storage: "Free Space Available",
    storageType: "Storage Architecture",
    os: "Operating System",
    fastAnalysisTitle: "3. Direct Hardware Diagnostic (Local Analysis)",
    noGameSelected: "Please choose a game to run local calculation algorithms.",
    passed: "✔ FULLY COMPATIBLE",
    warning: "⚠ MARGINAL / LOW PERF",
    failed: "✘ INCOMPATIBLE",
    gpuShaders: "Architecture Shader Support",
    renderOk: "✔ Modern Rendering Support Active",
    aged: "⚠ Aged shader architecture",
    outdated: "✘ Outdated Shader architecture - Launch failures likely",
    estFps: "Predicted Average Framerate",
    resolution: "Recommended Target Settings",
    bottleneck: "Expected Bottleneck Element",
    verdict: "General Performance Verdict",
    aiBtn: "🧠 RUN CLOUD AI COMPATIBILITY SCAN (Gemini AI)",
    aiAnalyzing: "Connecting to secure Gemini cloud nodes...",
    aiFullAnalysis: "Generate Deep Gemini AI Review",
    offlineWarning: "Sandbox server-less offline fallback active.",
    compatibilitySummary: "📝 General System Performance Summary",
    optimalSettings: "🔧 Ideal Graphic Settings Suggestions",
    detailedMetrics: "📊 Deep Hardware Processing Analysis",
    overallScore: "System Playability Score",
    specsOfSelected: "Official Specifications Needed:",
    genre: "Genre",
    released: "Released",
    reqMin: "Minimum System Req",
    reqRec: "Recommended System Req",
    notSpecified: "Not specified",
    historyTitle: "Recently Scanned Games (Offline Cache)",
    hasNoHistory: "No recently analyzed games stored in offline cache.",
    clearHistoryBtn: "Clear History",
    installBtnText: "Install as Sandboxed Web App (PWA)",
    pwaAlreadyInstalled: "Application already saved or environment does not support manual install popup.",
    pwaSuccess: "PWA application ready for installation!",
    autoScanBtn: "Smart Hardware Auto-Scan ⚡",
    autoScanRunning: "Querying hardware logical cores & WebGL shaders...",
    autoScanSuccess: "Auto-scan successful! Specifications updated.",
    pcCategoryLabel: "PC OS Ecosystem",
    customPcOpt: "Independent Custom System (Windows / Linux)",
    appleMacOpt: "Apple Silicon Presets (macOS)",
    pcSubTypeLabel: "PC Device Sub-Type",
    desktopSubType: "Desktop Build (Custom System)",
    laptopSubType: "Laptop System (OEM Build)",
    motherboardLabel: "Motherboard Model Name",
    laptopModelLabel: "Laptop Manufacturer Model Name",
    mobilePlatformLabel: "Mobile Platform Environment",
    appleIosOpt: "Apple iOS Ecosystem (iPhone)",
    androidOpt: "Android & Independent Ecosystems",
    appleFamilyLabel: "Sub-Family Classification",
    appleGenLabel: "Processor Silicon Generation (Generation)",
    appleTierLabel: "Hardware Tier/Edition Selection (Tier)",
    validationError: "Hardware validation error! Please input real device/component names (e.g., Intel i5, Core i7, Ryzen 5 for CPU; NVIDIA GTX, RTX 3060, Radeon RX for GPU). Random gibberish/letters are strictly blocked.",
    
    // NEW ADDED DICTIONARY ENTRIES FOR COMPLETE ACCURACY (ENGLISH):
    motherboardError: "Please type a valid motherboard model (e.g., ASUS, Gigabyte, MSI)",
    laptopError: "Please enter a valid laptop model name (e.g., Lenovo Legion, HP Omen, ROG...)",
    cpuValErrorShort: "Too short CPU name!",
    cpuValErrorBrand: "Please type a valid brand (Intel, AMD, Ryzen...)",
    gpuValErrorShort: "Too short GPU name!",
    gpuValErrorBrand: "Please type a real graphics adapter brand (NVIDIA, Radeon, Arc...)",
    ramInsufficient: "Insufficient system Memory (RAM)",
    gpuBound: "Graphics processor bound (GPU Bottleneck)",
    cpuBound: "Compute processor latency (CPU Bottleneck)",
    slowStorage: "Slow rotational magnetic storage disk latency",
    verdictSuper: "✔ Exceptional! Outstanding rendering and high refresh capabilities",
    verdictSmooth: "✔ Perfectly playable at very stable rates",
    verdictMedium: "⚠ Playable margins. Requires low graphics presets for fluid feel",
    verdictLow: "✘ Out of specifications. Frequent freezes and app crashes expected",
    laptopModelPlaceholder: "e.g., Lenovo Legion 5 / ASUS ROG Zephyrus G14",
    motherboardPlaceholder: "e.g., ASUS ROG STRIX B650 / MSI Tomahawk",
    cpuPlaceholder: "e.g., Intel Core i7-12700K / Ryzen 5 7600X",
    gpuPlaceholder: "e.g., NVIDIA GeForce RTX 3060 / RX 6700 XT",
    appleHardwareProfile: "Apple System Computed hardware profile",
    appleCpu: "SoC Processor Chip:",
    appleRam: "Unified Memory (RAM):",
    appleVram: "Dedicated VRAM allocation:",
    appleScore: "System Responsiveness score:",
    appleScoreValue: "Excellent // Zero Bottlenecks",
    activeIphoneSpecs: "Active iPhone Specifications",
    processorChip: "Processor Chip:",
    systemMemory: "System Memory (RAM):",
    virtualGraphics: "Virtual Graphics Buffer:",
    defaultEcosystem: "Ecosystem OS:",
    appleIosEco: "Apple iOS Ecosystem Mode",
    smartphoneTabletName: "Smartphone / Tablet Name",
    coreProcessor: "Core Processor (SoC)",
    integratedGraphics: "Integrated Graphics (GPU)",
    systemMemoryLabel: "System Memory (RAM)",
    internalAllocatedStorage: "Internal Allocated Storage",
    centralCpu: "Central CPU:",
    graphicsGpu: "Graphics GPU:",
    unifiedMemory: "Unified Memory:",
    integratedStorage: "Integrated Storage:",
    playabilityRating: "Playability Index Rating:",
    configurationReport: "Platform Specifications Configuration Report",
    handheldApu: "Custom APU:",
    handheldGpuCores: "GPU / Cores:",
    handheldSharedMem: "Shared Memory:",
    handheldStorageSpeed: "Storage & Speed:",
    handheldFactSheet: "Handheld Specifications Fact Sheet",
    activeIphoneProfile: "Active iPhone Specifications Preview",
    activeIphoneSystem: "Apple iOS Mobile System",
    androidSmartphoneTablet: "Android Smartphone or Tablet Model",
    smartphoneNamePlaceholder: "e.g., Galaxy S24 Ultra, Xiaomi 14 Ultra",
    smartphoneCpuPlaceholder: "e.g., Snapdragon 8 Gen 3 or Tensor G4",
    smartphoneGpuPlaceholder: "e.g., Adreno 750 or AMD Xclipse 940",
    activeIosSpecsTitle: "Active iPhone Specifications Detail"
  }
};

interface CachedAnalysisItem {
  id: string;
  game: Game;
  specs: SystemSpecs & {
    deviceType: "desktop" | "console" | "handheld" | "mobile";
    ramSpeedMHz: number;
    isOverclocked: boolean;
    storageType: string;
    consoleModelName?: string;
  };
  result: AnalysisResult;
  timestamp: string;
  aiReport?: string;
}

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const t = translations[lang];

  const getBrandName = (brandId: string) => {
    const arabBrandNames: Record<string, string> = {
      sony: "سوني بلاي ستيشن (Sony PlayStation)",
      microsoft: "مايكروسوفت إكس بوكس (Microsoft Xbox)",
      nintendo: "نينتندو (Nintendo)",
      sega: "سيجا كلاسيك (Sega)",
      apple: "آبل للألعاب (Apple Gaming)",
      sony_handheld: "أجهزة سوني المحمولة (Sony PSP/Vita)",
      nintendo_handheld: "أجهزة نينتندو المحمولة (Nintendo Handhelds)",
      sega_handheld: "جهاز سيجا المحمول (Sega Game Gear)",
      valve: "فالف ستيم ديك (Valve Steam Deck)",
      asus: "أسوس روج آلي (ASUS ROG Ally)",
      lenovo: "لينوفو فيجن (Lenovo Legion Go)",
      msi: "إم إس آي كلاو (MSI Claw)"
    };
    const engBrandNames: Record<string, string> = {
      sony: "Sony PlayStation",
      microsoft: "Microsoft Xbox",
      nintendo: "Nintendo",
      sega: "Sega Retro",
      apple: "Apple Gaming",
      sony_handheld: "Sony Handhelds",
      nintendo_handheld: "Nintendo Handhelds",
      sega_handheld: "Sega Retro Handheld",
      valve: "Valve Steam Deck",
      asus: "ASUS ROG Ally",
      lenovo: "Lenovo Legion Go",
      msi: "MSI Claw"
    };
    return lang === "ar" ? arabBrandNames[brandId] || brandId : engBrandNames[brandId] || brandId;
  };

  const getConsoleExplanation = (id: string, original: string, currentLang: "ar" | "en") => {
    if (currentLang === "ar") return original;
    const engMap: Record<string, string> = {
      "ps5-pro": "The most powerful home console available. Supports advanced ray tracing and PSSR AI upscaling for high-framerate 4K gaming.",
      "ps5": "Current-gen flagship console for gaming at 4K/60FPS or 120FPS in competitive titles with a huge library of exclusive games.",
      "ps4-pro": "Excellent console capable of running enhanced last-gen games at dynamic 4K at a stable 30-60 FPS.",
      "ps4": "The best-selling console of the last generation. Plays thousands of titles at 1080p with a locked 30 FPS target.",
      "ps3": "Highly complex Cell Broadband Engine architecture. Delivers classic titles at a stable 720p.",
      "ps2": "The best-selling gaming console in history! Play golden era games via DVD with legendary load performance.",
      "ps1": "Where true 3D gaming history began. Iconic titles running on revolutionary retro 3D engines.",
      "ps-tv": "Portable PlayStation designed to let you play PS Vita and PSP games directly on your TV via HDMI.",
      "xbox-series-x": "The flagship and most powerful Xbox console. Designed for native 4K gaming with Quick Resume.",
      "xbox-series-s": "Digital-only next-gen console. Excellent value offering 1080p/1440p gaming with quick resumes and SSD loading speeds.",
      "xbox-one-x": "Enormously powerful mid-generation upgrade with 6 TFLOPS GPU bandwidth for true native 4K last-gen gaming.",
      "xbox-one-s": "Classic slim last-gen console with HDR rendering and 4K Blu-ray playback. Ideal for casual game pass gaming.",
      "xbox-360": "Legendary generation defining console. Introduced Xbox Live and stable 720p HD multiplayer titles.",
      "xbox-original": "Microsoft's bold entry into home gaming, featuring an integrated HDD and heavy-hitting Halo titles.",
      "switch": "Innovative hybrid console. Instantly swap from TV dock mode to cozy handheld play anywhere in the world.",
      "wii-u": "Unique dual-screen console with a dedicated gamepad controller. Home to fantastic first-party titles.",
      "wii": "Revolutionary motion-control family console that sold over 100 million systems globally.",
      "gamecube": "Compact powerhouse featuring custom optical discs and the legendary ergonomic controller.",
      "n64": "Pioneering 64-bit console that revolutionized 3D gaming with analogue controls and 4-player multiplayer.",
      "snes": "The 16-bit powerhouse of 2D art. Home to some of the most iconic RPGs and platformers of all time.",
      "nes": "The legendary 8-bit home console that revived the global gaming industry in the mid-1980s.",
      "dreamcast": "Sega's final and hyper-advanced console. Featured built-in internet modem and iconic arcade ports.",
      "sega-saturn": "Complex dual-CPU classic known for pristine 2D arcade ports and early 3D innovations.",
      "genesis": "Legendary 16-bit console with fast paced 'blast processing' that challenged Nintendo in the 90s.",
      "master-system": "Sega's classic 8-bit home retro system offering robust arcade quality gaming at home.",
      "apple-tv": "Modern microconsole for Apple Arcade and App Store gaming, bringing mobile games to the television.",
      "pippin": "Rare multimedia console developed by Apple in collaboration with Bandai in the mid-90s.",
      "ps-vita": "Sony's portable engineering masterpiece featuring a superb OLED/LCD screen, dual analog sticks, and back touchpads.",
      "psp": "Sony's highly screen-advanced handheld. Plays stunning movies, music, and high-fidelity titles on Universal Media Discs (UMD).",
      "switch-oled": "The ultimate Nintendo Switch revision featuring a gorgeous 7-inch OLED screen and enhanced audio.",
      "3ds": "Immersive glass-free 3D handheld with a dual screen configuration and highly innovative social capabilities.",
      "ds": "Pioneering dual-screen setup with touch inputs. The best-selling handheld device of all time.",
      "gba": "Legendary 32-bit pocket power, playing gorgeous pixel art classics with backwards GameBoy compatibility.",
      "gb": "The timeless monochrome handheld that started the portable gaming revolution worldwide.",
      "game-gear": "Sega's colored backlit portable system. Offered full console-quality console portable gameplay.",
      "steam-deck-oled": "The premier handheld gaming PC, featuring a gorgeous 90Hz HDR OLED screen and efficient AMD computing.",
      "steam-deck-lcd": "Innovative handheld PC opening Steam libraries globally for seamless on-the-go play.",
      "rog-ally-x": "Upgraded ROG Ally sporting a massive 80Wh battery, 24GB LPDDR5X RAM, and improved ergonomics.",
      "rog-ally-extreme": "Extremely powerful Ryzen Z1 Extreme handheld running full Windows 11 with a high-end 120Hz VRR screen.",
      "legion-go": "Huge 8.8-inch QHD screen handheld with detachable controllers and integrated kickstand.",
      "msi-claw": "MSI's portable gaming handheld powered by Intel Core Ultra processors and advanced cooling."
    };
    return engMap[id] || original;
  };

  // Game Selection States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearchingGames, setIsSearchingGames] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game>(POPULAR_FALLBACK_GAMES[0]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  // 4 Core Device Selection
  const [deviceType, setDeviceType] = useState<"desktop" | "console" | "handheld" | "mobile">("desktop");
  
  // Custom Desktop specifications
  const [customCpu, setCustomCpu] = useState("Intel Core i5-12600K");
  const [customGpu, setCustomGpu] = useState("NVIDIA GeForce RTX 3060");
  const [cpuValError, setCpuValError] = useState("");
  const [gpuValError, setGpuValError] = useState("");

  const [ramGB, setRamGB] = useState(16);
  const [vramGB, setVramGB] = useState(8);
  const [storageGB, setStorageGB] = useState(150);
  const [ramSpeedMHz, setRamSpeedMHz] = useState(3200);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [storageType, setStorageType] = useState<string>("NVMe SSD");
  const [osName, setOsName] = useState("Windows 11 64-bit");

  // PC Sub-types & Laptop Identity
  const [pcCategory, setPcCategory] = useState<"custom" | "apple-mac">("custom");
  const [pcSubType, setPcSubType] = useState<"desktop" | "laptop">("desktop");
  const [motherboardModel, setMotherboardModel] = useState("ASUS PRIME B550M-A");
  const [motherboardError, setMotherboardError] = useState("");
  const [laptopModel, setLaptopModel] = useState("Lenovo Legion 5 15ACH6H");
  const [laptopError, setLaptopError] = useState("");

  // Mobile Device Platform (Apple vs Android)
  const [mobileSubType, setMobileSubType] = useState<"android" | "apple-ios">("android");

  // Absolute Apple Device Tree selectors
  const [appleFamily, setAppleFamily] = useState<string>("macbook_pro");
  const [appleGen, setAppleGen] = useState<string>("m3-chipsets");
  const [appleTier, setAppleTier] = useState<string>("pro");

  // Live Auto-scan Simulation states
  const [autoScanStatus, setAutoScanStatus] = useState<"idle" | "running" | "success">("idle");
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Console / Handheld selection
  const [consoleBrand, setConsoleBrand] = useState("sony");
  const [consoleModel, setConsoleModel] = useState("ps5");

  const [handheldBrand, setHandheldBrand] = useState("valve");
  const [handheldModel, setHandheldModel] = useState("steam-deck-oled");

  // Phone / Tablet specs
  const [phoneName, setPhoneName] = useState("Samsung Galaxy S24 Ultra");
  const [phoneCpu, setPhoneCpu] = useState("Snapdragon 8 Gen 3");
  const [phoneGpu, setPhoneGpu] = useState("Adreno 750");
  const [phoneRam, setPhoneRam] = useState(12);
  const [phoneStorage, setPhoneStorage] = useState(256);

  // General computed Specs object
  const [specs, setSpecs] = useState<SystemSpecs>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SPECS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      cpuName: "Intel Core i5-12600K",
      cpuScore: 7.2,
      gpuName: "NVIDIA GeForce RTX 3060",
      gpuScore: 7.3,
      ramGB: 16,
      vramGB: 8,
      storageGB: 150,
      isSSD: true,
      os: "Windows 11 64-bit"
    };
  });

  // Deep Analysis States
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [deepAnalysisRaw, setDeepAnalysisRaw] = useState<string>("");
  const [localAnalysis, setLocalAnalysis] = useState<AnalysisResult | null>(null);

  // Offline Caching & Reports History (Last 5 Unique Games)
  const [historyList, setHistoryList] = useState<CachedAnalysisItem[]>([]);

  // PWA Support state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [pwaStatus, setPwaStatus] = useState<string>("");

  // Load trending games on setup using RAWG API proxy
  useEffect(() => {
    async function loadPopularGames() {
      try {
        console.log("Fetching live trending games from secure RAWG proxied endpoint...");
        const res = await fetch("/api/trending");
        if (res.ok) {
          const data = await res.json();
          if (data && data.results && data.results.length > 0) {
            const parsed: Game[] = data.results.slice(0, 6).map((g: any) => {
              // Extract or generate minimum values
              let minR = null;
              let recR = null;
              const pcPlatform = g.platforms?.find((p: any) => p.platform.slug === "pc");
              if (pcPlatform && pcPlatform.requirements_en) {
                minR = parseRawgRequirements(pcPlatform.requirements_en.minimum, true);
                recR = parseRawgRequirements(pcPlatform.requirements_en.recommended, false);
              }
              if (!minR) {
                minR = {
                  cpu: "Intel Core i5-4460 / AMD FX-6300",
                  gpu: "NVIDIA GTX 760 2GB / AMD R7 260X",
                  ram: 8,
                  storage: 60
                };
              }
              if (!recR) {
                recR = {
                  cpu: "Intel Core i7-4790K / AMD Ryzen 5 1600",
                  gpu: "NVIDIA GTX 1060 6GB / AMD RX 580",
                  ram: 12,
                  storage: 60
                };
              }
              return {
                id: String(g.id),
                name: g.name,
                slug: g.slug,
                background_image: g.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                released: g.released || "2023",
                genres: g.genres || [],
                minimum_requirements: minR,
                recommended_requirements: recR
              };
            });
            setTrendingGames(parsed);
            if (parsed.length > 0) {
              setSelectedGame(parsed[0]);
            }
          } else {
            setTrendingGames(POPULAR_FALLBACK_GAMES);
          }
        } else {
          setTrendingGames(POPULAR_FALLBACK_GAMES);
        }
      } catch (err) {
        console.error("Error fetching trending RAWG games:", err);
        setTrendingGames(POPULAR_FALLBACK_GAMES);
      }
    }
    loadPopularGames();
  }, [lang]);

  // Live Game Search (Debounced via Secure RAWG Proxy)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchingGames(false);
      return;
    }

    setIsSearchingGames(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameName: searchQuery })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.results) {
            const parsed: Game[] = data.results.slice(0, 10).map((g: any) => {
              let minR = null;
              let recR = null;
              const pcPlatform = g.platforms?.find((p: any) => p.platform.slug === "pc");
              if (pcPlatform && pcPlatform.requirements_en) {
                minR = parseRawgRequirements(pcPlatform.requirements_en.minimum, true);
                recR = parseRawgRequirements(pcPlatform.requirements_en.recommended, false);
              }
              if (!minR) {
                minR = {
                  cpu: "Intel Core i5-4460 / AMD FX-6300",
                  gpu: "NVIDIA GTX 760 2GB / AMD R7 260X",
                  ram: 8,
                  storage: 60
                };
              }
              if (!recR) {
                recR = {
                  cpu: "Intel Core i7-4790K / AMD Ryzen 5 1600",
                  gpu: "NVIDIA GTX 1060 6GB / AMD RX 580",
                  ram: 12,
                  storage: 60
                };
              }
              return {
                id: String(g.id),
                name: g.name,
                slug: g.slug,
                background_image: g.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                released: g.released || "2023",
                genres: g.genres || [],
                minimum_requirements: minR,
                recommended_requirements: recR
              };
            });
            setSearchResults(parsed);
          } else {
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching RAWG games:", err);
        setSearchResults([]);
      } finally {
        setIsSearchingGames(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleRestoreHistoryItem = (item: CachedAnalysisItem) => {
    setSelectedGame(item.game);
    setLocalAnalysis(item.result);
    if (item.aiReport) {
      setDeepAnalysisRaw(item.aiReport);
    } else {
      setDeepAnalysisRaw("");
    }

    // Set specs based on saved specs
    const sp = item.specs;
    if (sp) {
      setDeviceType(sp.deviceType);
      if (sp.deviceType === "desktop") {
        if (sp.cpuName.includes("Unified GPU") || sp.os.includes("macOS")) {
          // It was an Apple Mac!
          setPcCategory("apple-mac");
        } else {
          setPcCategory("custom");
          setCustomCpu(sp.cpuName);
          setCustomGpu(sp.gpuName);
          setRamGB(sp.ramGB);
          setVramGB(sp.vramGB);
          setStorageGB(sp.storageGB);
          if (sp.ramSpeedMHz) setRamSpeedMHz(sp.ramSpeedMHz);
          setIsOverclocked(!!sp.isOverclocked);
          if (sp.storageType) setStorageType(sp.storageType);
          setOsName(sp.os);
        }
      } else if (sp.deviceType === "mobile") {
        if (sp.os.includes("iOS") || sp.os.includes("iPhone")) {
          setMobileSubType("apple-ios");
        } else {
          setMobileSubType("android");
          const derivedName = sp.os.split(" // ")[0] || "Android Phone";
          setPhoneName(derivedName);
          setPhoneCpu(sp.cpuName);
          setPhoneGpu(sp.gpuName);
          setPhoneRam(sp.ramGB);
          setPhoneStorage(sp.storageGB);
        }
      } else if (sp.deviceType === "console") {
        setConsoleBrand("sony"); // fallback default check
        for (const [brand, list] of Object.entries(CONSOLE_MODELS)) {
          const m = list.find(x => x.cpu === sp.cpuName && x.gpu === sp.gpuName);
          if (m) {
            setConsoleBrand(brand);
            setConsoleModel(m.id);
            break;
          }
        }
      } else if (sp.deviceType === "handheld") {
        setHandheldBrand("valve"); // fallback default check
        for (const [brand, list] of Object.entries(HANDHELD_MODELS)) {
          const m = list.find(x => x.cpu === sp.cpuName && x.gpu === sp.gpuName);
          if (m) {
            setHandheldBrand(brand);
            setHandheldModel(m.id);
            break;
          }
        }
      }
    }
  };

  // Load offline reports history & register PWA handlers
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read history from local storage", e);
    }

    // Capture install prompt
    const capturePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaStatus("Installable");
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);

  // Update specs dynamically based on chosen Device Type
  useEffect(() => {
    if (deviceType === "desktop") {
      if (pcCategory === "apple-mac") {
        const famNode = APPLE_DEVICES_TREE[appleFamily];
        if (famNode) {
          const genNode = famNode.generations[appleGen] || Object.values(famNode.generations)[0];
          if (genNode) {
            const tierNode = genNode.tiers[appleTier] || Object.values(genNode.tiers)[0];
            if (tierNode) {
              setSpecs({
                cpuName: tierNode.chip,
                cpuScore: tierNode.cpuScore,
                gpuName: tierNode.chip + " (Unified GPU)",
                gpuScore: tierNode.gpuScore,
                ramGB: tierNode.ram,
                vramGB: tierNode.vram,
                storageGB,
                isSSD: true,
                os: "macOS Sequoia 15"
              });
            }
          }
        }
      } else {
        const { cpuScore, gpuScore, defaultVram } = estimateHardwareScores(customCpu, customGpu);
        setSpecs({
          cpuName: customCpu,
          cpuScore: cpuScore,
          gpuName: customGpu,
          gpuScore: gpuScore,
          ramGB,
          vramGB: Math.max(vramGB, defaultVram),
          storageGB,
          isSSD: storageType.includes("SSD") || storageType.includes("UFS"),
          os: osName
        });
      }
    } else if (deviceType === "console") {
      // Find matches in Console preset DB
      const brandList = CONSOLE_MODELS[consoleBrand] || [];
      const modelItem = brandList.find(c => c.id === consoleModel);
      if (modelItem) {
        setSpecs({
          cpuName: modelItem.cpu,
          cpuScore: modelItem.cpuScore,
          gpuName: modelItem.gpu,
          gpuScore: modelItem.gpuScore,
          ramGB: modelItem.ramGB,
          vramGB: modelItem.vramGB,
          storageGB: modelItem.storageGB,
          isSSD: modelItem.storageType.includes("SSD"),
          os: `${consoleBrand.toUpperCase()} Operating System`
        });
      }
    } else if (deviceType === "handheld") {
      const brandList = HANDHELD_MODELS[handheldBrand] || [];
      const modelItem = brandList.find(c => c.id === handheldModel);
      if (modelItem) {
        setSpecs({
          cpuName: modelItem.cpu,
          cpuScore: modelItem.cpuScore,
          gpuName: modelItem.gpu,
          gpuScore: modelItem.gpuScore,
          ramGB: modelItem.ramGB,
          vramGB: modelItem.vramGB,
          storageGB: modelItem.storageGB,
          isSSD: modelItem.storageType.includes("SSD"),
          os: `${handheldBrand.toUpperCase()} OS / SteamOS Architecture`
        });
      }
    } else if (deviceType === "mobile") {
      if (mobileSubType === "apple-ios") {
        const famNode = APPLE_DEVICES_TREE["iphone"];
        if (famNode) {
          const genNode = famNode.generations[appleGen] || Object.values(famNode.generations)[0];
          if (genNode) {
            const tierNode = genNode.tiers[appleTier] || Object.values(genNode.tiers)[0];
            if (tierNode) {
              setSpecs({
                cpuName: tierNode.chip,
                cpuScore: tierNode.cpuScore,
                gpuName: tierNode.chip + " (Apple GPU)",
                gpuScore: tierNode.gpuScore,
                ramGB: tierNode.ram,
                vramGB: tierNode.vram,
                storageGB: phoneStorage,
                isSSD: true,
                os: `iOS System Device (${tierNode.name})`
              });
            }
          }
        }
      } else {
        // Manual entries for Mobile Phone
        const { cpuScore, gpuScore } = estimateHardwareScores(phoneCpu, phoneGpu);
        setSpecs({
          cpuName: phoneCpu,
          cpuScore: cpuScore,
          gpuName: phoneGpu,
          gpuScore: gpuScore,
          ramGB: phoneRam,
          vramGB: Math.round(phoneRam * 0.4),
          storageGB: phoneStorage,
          isSSD: true,
          os: `${phoneName} // ARM Stack`
        });
      }
    }
  }, [
    deviceType, 
    customCpu, 
    customGpu, 
    ramGB, 
    vramGB, 
    storageGB, 
    storageType, 
    osName, 
    consoleBrand, 
    consoleModel, 
    handheldBrand, 
    handheldModel,
    phoneName,
    phoneCpu,
    phoneGpu,
    phoneRam,
    phoneStorage,
    pcCategory,
    pcSubType,
    mobileSubType,
    appleFamily,
    appleGen,
    appleTier
  ]);

  // Execute linter & validation logic for Free-text desktop configs before submission
  const validateTextInputs = (): boolean => {
    let isValid = true;
    setCpuValError("");
    setGpuValError("");
    setMotherboardError("");
    setLaptopError("");

    if (deviceType !== "desktop") return true;
    if (pcCategory === "apple-mac") return true;

    const trimmedCpu = customCpu.trim().toLowerCase();
    const trimmedGpu = customGpu.trim().toLowerCase();

    // Motherboard vs Laptop validation
    if (pcSubType === "desktop") {
      const trimmedMoth = motherboardModel.trim().toLowerCase();
      if (trimmedMoth.length < 3) {
        setMotherboardError(t.motherboardError);
        isValid = false;
      }
    } else {
      const trimmedLap = laptopModel.trim().toLowerCase();
      if (trimmedLap.length < 3) {
        setLaptopError(t.laptopError);
        isValid = false;
      }
    }

    // CPU validation
    if (trimmedCpu.length < 3) {
      setCpuValError(t.cpuValErrorShort);
      isValid = false;
    } else {
      const cpuKeywords = ["intel", "amd", "ryzen", "core", "xeon", "celeron", "pentium", "snapdragon", "dimensity", "apple", "m1", "m2", "m3", "m4", "bionic", "exynos", "kirin", "qualified"];
      const hasCpuKeyword = cpuKeywords.some(kw => trimmedCpu.includes(kw));
      const repetitiveMatch = /([a-zA-Z1-9])\1{3,}/.test(trimmedCpu); // check letters repeated like aaaa or sssss
      if (!hasCpuKeyword || repetitiveMatch) {
         setCpuValError(t.cpuValErrorBrand);
         isValid = false;
      }
    }

    // GPU validation
    if (trimmedGpu.length < 3) {
      setGpuValError(t.gpuValErrorShort);
      isValid = false;
    } else {
      const gpuKeywords = ["nvidia", "geforce", "rtx", "gtx", "gts", "quadro", "amd", "radeon", "rx", "vega", "intel", "arc", "iris", "hd graphics", "uhd", "adreno", "mali", "apple", "powervr", "display", "silicon"];
      const hasGpuKeyword = gpuKeywords.some(kw => trimmedGpu.includes(kw));
      const repetitiveMatch = /([a-zA-Z1-9])\1{3,}/.test(trimmedGpu);
      if (!hasGpuKeyword || repetitiveMatch) {
         setGpuValError(t.gpuValErrorBrand);
         isValid = false;
      }
    }

    return isValid;
  };

  // Run fast instant diagnostic calculations
  useEffect(() => {
    if (!selectedGame) return;

    const minR = selectedGame.minimum_requirements || { cpu: "Any", gpu: "Any", ram: 8, storage: 40 };
    const recR = selectedGame.recommended_requirements || minR;

    // Fast calculation modifiers for Overclock and high speed RAM
    let cpuMultiplier = 1.0;
    let gpuMultiplier = 1.0;

    if (isOverclocked && deviceType === "desktop") {
      cpuMultiplier = 1.07;
      gpuMultiplier = 1.07;
    }

    // RAM Speed modifier
    let ramEfficiency = 1.0;
    if (deviceType === "desktop") {
      if (ramSpeedMHz >= 6000) ramEfficiency = 1.05;
      else if (ramSpeedMHz >= 4800) ramEfficiency = 1.02;
      else if (ramSpeedMHz <= 2133) ramEfficiency = 0.92;
    }

    // Storage Speed latency modifier index
    let storageMultiplier = 1.0;
    if (storageType === "NVMe SSD") storageMultiplier = 1.0;
    else if (storageType === "SATA SSD") storageMultiplier = 0.9;
    else if (storageType === "UFS Storage") storageMultiplier = 0.85;
    else if (storageType === "eMMC Storage") storageMultiplier = 0.75;
    else if (storageType === "SATA HDD") storageMultiplier = 0.55;

    // Check RAM
    let ramStatus: "pass" | "warn" | "fail" = "pass";
    if (specs.ramGB * ramEfficiency < minR.ram) {
      ramStatus = "fail";
    } else if (specs.ramGB * ramEfficiency < recR.ram) {
      ramStatus = "warn";
    }

    // Check Storage size
    let storageStatus: "pass" | "warn" | "fail" = "pass";
    if (specs.storageGB < minR.storage) {
      storageStatus = "fail";
    } else if (specs.storageGB < minR.storage + 10) {
      storageStatus = "warn";
    }

    // Heavy game index
    const isHeavy = selectedGame.slug.includes("cyberpunk") || selectedGame.slug.includes("hogwarts") || selectedGame.slug.includes("elden") || selectedGame.slug.includes("red-dead");
    const minCpuReq = isHeavy ? 6.5 : 4.0;
    const recCpuReq = isHeavy ? 8.2 : 6.0;

    // CPU rating
    let cpuStatus: "pass" | "warn" | "fail" = "pass";
    const absoluteCpuMatch = specs.cpuScore * cpuMultiplier;
    if (absoluteCpuMatch < minCpuReq) {
      cpuStatus = "fail";
    } else if (absoluteCpuMatch < recCpuReq) {
      cpuStatus = "warn";
    }

    // GPU rating
    let gpuStatus: "pass" | "warn" | "fail" = "pass";
    const absoluteGpuMatch = specs.gpuScore * gpuMultiplier;
    if (absoluteGpuMatch < minCpuReq) {
      gpuStatus = "fail";
    } else if (absoluteGpuMatch < recCpuReq) {
      gpuStatus = "warn";
    }

    // Overall suitability index
    let score = 0;
    const weights = { cpu: 25, gpu: 35, ram: 20, disk: 20 };
    score += (Math.min(10, absoluteCpuMatch) / 10) * weights.cpu;
    score += (Math.min(10, absoluteGpuMatch) / 10) * weights.gpu;
    score += Math.min(1, (specs.ramGB * ramEfficiency) / recR.ram) * weights.ram;
    score += (specs.isSSD ? 1 : 0.6) * storageMultiplier * weights.disk;

    score = Math.round(score * 100);
    if (score > 100) score = 100;
    if (score < 10) score = 10;

    // Expected FPS Calculation
    let estFps = 60;
    if (gpuStatus === "fail" || cpuStatus === "fail" || ramStatus === "fail") {
       estFps = Math.round(14 + Math.random() * 8);
    } else {
       const globalScoreRatio = (absoluteCpuMatch + absoluteGpuMatch + (specs.ramGB >= recR.ram ? 4 : 2)) / 24;
       estFps = Math.round(30 + globalScoreRatio * 95);
       if (!specs.isSSD) estFps = Math.round(estFps * 0.85); // HDD latency degradation
       if (estFps > 240) estFps = 240;
       if (estFps < 20) estFps = 20;
    }

    // Recommended resolution
    let recommendedResolution = "1080p - High Settings";
    if (score >= 92) {
      recommendedResolution = "4K / Ultra Settings (Dynamic DLSS/PSSR)";
    } else if (score >= 78) {
      recommendedResolution = "1440p - High Settings (Upscaler Active)";
    } else if (score >= 55) {
      recommendedResolution = "1085p - Medium Graphics";
    } else if (score >= 35) {
      recommendedResolution = "720p - Low Settings // FSR Active";
    } else {
      recommendedResolution = "Unsupported / Retro emulation mode Only";
    }

    // Bottleneck detection
    let bottleneck = lang === "ar" ? "لا يوجد [عتاد متماسك]" : "None [Cohesive hardware]";
    if (specs.ramGB < minR.ram) {
      bottleneck = t.ramInsufficient;
    } else if (absoluteGpuMatch < absoluteCpuMatch - 1) {
      bottleneck = t.gpuBound;
    } else if (absoluteCpuMatch < absoluteGpuMatch - 1.5) {
      bottleneck = t.cpuBound;
    } else if (!specs.isSSD) {
      bottleneck = t.slowStorage;
    }

    let verdict = "";
    if (score >= 85) {
       verdict = t.verdictSuper;
    } else if (score >= 60) {
       verdict = t.verdictSmooth;
    } else if (score >= 40) {
       verdict = t.verdictMedium;
    } else {
       verdict = t.verdictLow;
    }

    const compiledResult: AnalysisResult = {
      overallScore: score,
      cpuStatus,
      gpuStatus,
      ramStatus,
      storageStatus,
      estFps,
      recommendedResolution,
      bottleneck,
      verdict
    };

    setLocalAnalysis(compiledResult);

    // Save automatically to Offline history
    saveAnalysisToHistoryList(selectedGame, { ...specs, deviceType, ramSpeedMHz, isOverclocked, storageType }, compiledResult);

  }, [selectedGame, specs, isOverclocked, ramSpeedMHz, storageType, deviceType]);

  // Save successful unique test item into localized database (last 5 items max)
  const saveAnalysisToHistoryList = (game: Game, currentSpecs: any, result: AnalysisResult) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      let list: CachedAnalysisItem[] = stored ? JSON.parse(stored) : [];

      // Avoid duplication of games
      list = list.filter(item => item.game.id !== game.id);

      const newItem: CachedAnalysisItem = {
        id: `${game.id}-${Date.now()}`,
        game,
        specs: currentSpecs,
        result,
        timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };

      list.unshift(newItem);
      if (list.length > 5) {
        list = list.slice(0, 5);
      }

      setHistoryList(list);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to commit history to device cache:", e);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
      setHistoryList([]);
    } catch {}
  };

  // Parse Rawg Requirements
  const parseRawgRequirements = (text: string, isMin: boolean) => {
    if (!text) return null;
    let cpu = isMin ? "Intel Core i5-2500K" : "Intel Core i7-4770K";
    let gpu = isMin ? "NVIDIA GTX 770" : "NVIDIA GTX 1060";
    let ram = isMin ? 8 : 12;
    let storage = 60;

    const ramMatch = text.match(/(\d+)\s*(GB|gb)\s*(RAM|ram)/);
    if (ramMatch) {
      ram = parseFloat(ramMatch[1]);
    }

    const storageMatch = text.match(/(\d+)\s*(GB|gb)\s*(available|space|storage|hdd|ssd)/i);
    if (storageMatch) {
      storage = parseFloat(storageMatch[1]);
    }

    return { cpu, gpu, ram, storage };
  };

  // Estimate Scores heuristically for entered string values
  function estimateHardwareScores(cpuStr: string, gpuStr: string) {
    const cpu = cpuStr.toLowerCase();
    const gpu = gpuStr.toLowerCase();
    
    let cpuScore = 5.0;
    let gpuScore = 5.0;
    let defaultVram = 4;

    // CPU Score heuristics
    if (cpu.includes("9900") || cpu.includes("13900") || cpu.includes("14900") || cpu.includes("7950") || cpu.includes("7800x3d") || cpu.includes("m3 max") || cpu.includes("m4) max")) {
      cpuScore = 10.0;
    } else if (cpu.includes("12900") || cpu.includes("13700") || cpu.includes("14700") || cpu.includes("7900") || cpu.includes("5950") || cpu.includes("m3 pro") || cpu.includes("m2 max")) {
      cpuScore = 9.2;
    } else if (cpu.includes("12600") || cpu.includes("13600") || cpu.includes("14600") || cpu.includes("7700") || cpu.includes("5800") || cpu.includes("z1 extreme") || cpu.includes("m1 max") || cpu.includes("m2 pro") || cpu.includes("7800")) {
      cpuScore = 8.5;
    } else if (cpu.includes("12400") || cpu.includes("10400") || cpu.includes("11400") || cpu.includes("5600") || cpu.includes("3600") || cpu.includes("m1") || cpu.includes("m2") || cpu.includes("m3") || cpu.includes("m4") || cpu.includes("z1")) {
      cpuScore = 7.0;
    } else if (cpu.includes("7700") || cpu.includes("6705") || cpu.includes("4790") || cpu.includes("1600") || cpu.includes("2600") || cpu.includes("1500")) {
      cpuScore = 5.2;
    } else if (cpu.includes("pentium") || cpu.includes("celeron") || cpu.includes("core 2") || cpu.includes("athlon") || cpu.includes("pippin")) {
      cpuScore = 1.5;
    } else {
      cpuScore = 5.8;
    }

    // GPU Score & VRAM heuristics
    if (gpu.includes("4090") || gpu.includes("rtx 4090") || gpu.includes("7900 xtx") || gpu.includes("4080")) {
      gpuScore = 10.0;
      defaultVram = 24;
    } else if (gpu.includes("4070") || gpu.includes("3090") || gpu.includes("3080") || gpu.includes("7900 xt") || gpu.includes("7800 xt") || gpu.includes("rx 6900")) {
      gpuScore = 9.2;
      defaultVram = 16;
    } else if (gpu.includes("4060") || gpu.includes("3070") || gpu.includes("6800") || gpu.includes("7700") || gpu.includes("780m")) {
      gpuScore = 8.0;
      defaultVram = 8;
    } else if (gpu.includes("3060") || gpu.includes("2080") || gpu.includes("2070") || gpu.includes("rx 6605") || gpu.includes("rx 5700") || gpu.includes("z1 extreme") || gpu.includes("arc a7")) {
      gpuScore = 7.2;
      defaultVram = 8;
    } else if (gpu.includes("2060") || gpu.includes("1080") || gpu.includes("1070") || gpu.includes("1660 super") || gpu.includes("rx 5600") || gpu.includes("rx 580")) {
      gpuScore = 5.8;
      defaultVram = 6;
    } else if (gpu.includes("1060") || gpu.includes("1650") || gpu.includes("980") || gpu.includes("970") || gpu.includes("rx 480") || gpu.includes("rx 470")) {
      gpuScore = 4.5;
      defaultVram = 4;
    } else if (gpu.includes("750") || gpu.includes("1030") || gpu.includes("iris") || gpu.includes("vega") || gpu.includes("hd graphics")) {
      gpuScore = 2.0;
      defaultVram = 2;
    } else {
      gpuScore = 5.5;
      defaultVram = 3;
    }

    return { cpuScore, gpuScore, defaultVram };
  }

  // Synchronise Apple dropdown chains securely without undefined errors
  const handleAppleFamilyChange = (fam: string) => {
    setAppleFamily(fam);
    const gens = Object.keys(APPLE_DEVICES_TREE[fam]?.generations || {});
    if (gens.length > 0) {
      const firstGen = gens[0];
      setAppleGen(firstGen);
      const tiers = Object.keys(APPLE_DEVICES_TREE[fam].generations[firstGen]?.tiers || {});
      if (tiers.length > 0) {
        setAppleTier(tiers[0]);
      }
    }
  };

  const handleAppleGenChange = (gen: string) => {
    setAppleGen(gen);
    const tiers = Object.keys(APPLE_DEVICES_TREE[appleFamily]?.generations[gen]?.tiers || {});
    if (tiers.length > 0) {
      setAppleTier(tiers[0]);
    }
  };

  // Implements the requested Smart Auto-Scan dynamically detecting physical features
  const runHardwareAutoScan = () => {
    setAutoScanStatus("running");
    setScanLogs([]);
    
    const logs = lang === "ar" ? [
      "⏳ جاري استجواب مواصفات الهوية وبيئة المتصفح...",
      "🖥️ جاري قياس المعالجات الفيزيائية وخيوط الحساب المتاحة...",
      "⚡ فحص النواة وتقدير سرعة الاستجابة اللحظية...",
      "📊 الكشف عن مخزن الحصص المتاحة للذاكرة الرمتية...",
      "🔬 استجواب عتاد الرسوميات عبر WebGL Core 2.0...",
      "✅ تم كشف القطع وتعبئة النماذج الذكية بنجاح فائق!"
    ] : [
      "⏳ Probing user agent signatures and OS architecture...",
      "🖥️ Detecting physical cores and logical thread pool...",
      "⚡ Performing multithreaded calculation timing test...",
      "📊 Probing client available RAM allocation...",
      "🔬 Analyzing graphics context with WebGL 2.0 API...",
      "✅ Diagnostics complete! Populating specifications dynamically."
    ];

    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setScanLogs(prev => [...prev, logs[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        let detected = {
          deviceType: "desktop",
          mobileSubType: "android",
          pcCategory: "custom",
          pcSubType: "desktop",
          cpuName: "Intel Core i7-12700K",
          gpuName: "NVIDIA GeForce RTX 3070",
          ramGB: 16,
          vramGB: 8,
          storageGB: 512,
          storageType: "NVMe SSD",
          motherboardModel: "ASUS PRIME Z790-P",
          appleFamily: "",
          appleGen: "",
          appleTier: "",
          phoneName: "Google Pixel 8",
          phoneCpu: "Tensor G3",
          phoneGpu: "Mali-G715",
          phoneRam: 8,
          phoneStorage: 128
        };

        if (typeof (window as any).smartHardwareScan === "function") {
          try {
            detected = (window as any).smartHardwareScan();
          } catch (e) {
            console.error("Failed executing smartHardwareScan from index.html", e);
          }
        }

        // Apply detected status to React states:
        setDeviceType(detected.deviceType as any);
        
        if (detected.deviceType === "desktop") {
          setPcCategory(detected.pcCategory as any);
          if (detected.pcCategory === "apple-mac") {
            setAppleFamily(detected.appleFamily || "macbook_pro");
            setAppleGen(detected.appleGen || "m4-chipsets");
            setAppleTier(detected.appleTier || "pro");
          } else {
            setPcSubType(detected.pcSubType as any);
            setCustomCpu(detected.cpuName);
            setCustomGpu(detected.gpuName);
            setRamGB(detected.ramGB);
            setVramGB(detected.vramGB);
            setStorageGB(detected.storageGB);
            setStorageType(detected.storageType);
            setMotherboardModel(detected.motherboardModel);
          }
        } else if (detected.deviceType === "mobile") {
          setMobileSubType(detected.mobileSubType as any);
          if (detected.mobileSubType === "apple-ios") {
            setAppleFamily("iphone");
            setAppleGen(detected.appleGen || "iphone-15");
            setAppleTier(detected.appleTier || "pro");
          } else {
            setPhoneName(detected.phoneName);
            setPhoneCpu(detected.phoneCpu);
            setPhoneGpu(detected.phoneGpu);
            setPhoneRam(detected.phoneRam as any);
            setPhoneStorage(detected.phoneStorage as any);
          }
        }

        setAutoScanStatus("success");
        setTimeout(() => setAutoScanStatus("idle"), 5000);
      }
    }, 250);
  };

  const addAiReportToHistoryItem = (gameId: string, aiReport: string) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (!stored) return;
      let list: CachedAnalysisItem[] = JSON.parse(stored);
      const index = list.findIndex(item => item.game.id === gameId);
      if (index !== -1) {
        list[index].aiReport = aiReport;
        setHistoryList(list);
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(list));
      }
    } catch {}
  };

  // Handle manual PWA button click
  const installPwaApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to installation prompt: ${outcome}`);
      setDeferredPrompt(null);
      setPwaStatus("Installed");
    } else {
      alert(lang === "ar" 
        ? "للتثبيت اليدوي على جهازك:\n- على Chrome/Edge: اضغط على أيقونة التثبيت (⊕) المجاورة لشريط العناوين.\n- على iOS Safari: اضغط على 'مشاركة' (Share) ثم اختر 'إضافة إلى الصفحة الرئيسية' (Add to Home Screen)." 
        : "For manual PWA installation:\n- On Chrome/Edge: click the Install (⊕) button in your URL address bar.\n- On iOS Safari: Tap the 'Share' icon, scroll down and press 'Add to Home Screen' completely offline."
      );
    }
  };

  // Run Gemini Cloud Scanner with strict instruction prompt
  const executeGeminiScanner = async () => {
    if (!selectedGame || isDeepAnalyzing) return;

    // Check custom validation if desktop is selected
    if (deviceType === "desktop") {
      const isInputTextValid = validateTextInputs();
      if (!isInputTextValid) {
        alert(t.validationError);
        return;
      }
    }

    setIsDeepAnalyzing(true);
    setDeepAnalysisRaw("");

    const minR = selectedGame.minimum_requirements || { cpu: "Standard", gpu: "Standard", ram: 8, storage: 60 };
    const recR = selectedGame.recommended_requirements || minR;

    let userSystemHardwareSection = "";

    if (deviceType === "desktop") {
      if (pcSubType === "laptop") {
        userSystemHardwareSection = `
**USER SYSTEM HARDWARE (Device Category: LAPTOP):**
- System Type: The user is running a Laptop named "${laptopModel}"
- Processor (CPU): ${specs.cpuName} (Internal Grade: ${specs.cpuScore}/10)
- Graphics Custom Core (GPU): ${specs.gpuName} (Internal Grade: ${specs.gpuScore}/10)
- RAM Capacity: ${specs.ramGB} GB (Clock speed: ${ramSpeedMHz} MHz, Overclock Mod: ${isOverclocked ? "Enabled" : "Disabled"})
- VRAM Size: ${specs.vramGB} GB
- Free Disk: ${specs.storageGB} GB (Storage Type Architecture: ${storageType})
- Platform OS: ${specs.os}
`;
      } else {
        userSystemHardwareSection = `
**USER SYSTEM HARDWARE (Device Category: DESKTOP PC):**
- System Type: The user is running a Desktop PC with custom configuration
- Motherboard: ${motherboardModel}
- Processor (CPU): ${specs.cpuName} (Internal Grade: ${specs.cpuScore}/10)
- Graphics Custom Core (GPU): ${specs.gpuName} (Internal Grade: ${specs.gpuScore}/10)
- RAM Capacity: ${specs.ramGB} GB (Clock speed: ${ramSpeedMHz} MHz, Overclock Mod: ${isOverclocked ? "Enabled" : "Disabled"})
- VRAM Size: ${specs.vramGB} GB
- Free Disk: ${specs.storageGB} GB (Storage Type Architecture: ${storageType})
- Platform OS: ${specs.os}
`;
      }
    } else if (deviceType === "console" || deviceType === "handheld") {
      const consoleBrandObj = CONSOLE_BRANDS.find(b => b.id === consoleBrand);
      const consoleModelObj = CONSOLE_MODELS[consoleBrand]?.find(m => m.id === consoleModel);
      
      const handheldBrandObj = HANDHELD_BRANDS.find(b => b.id === handheldBrand);
      const handheldModelObj = HANDHELD_MODELS[handheldBrand]?.find(m => m.id === handheldModel);

      const resolvedBrand = deviceType === "console" 
        ? (consoleBrandObj ? consoleBrandObj.name : consoleBrand)
        : (handheldBrandObj ? handheldBrandObj.name : handheldBrand);

      const resolvedModel = deviceType === "console"
        ? (consoleModelObj ? consoleModelObj.name : consoleModel)
        : (handheldModelObj ? handheldModelObj.name : handheldModel);

      userSystemHardwareSection = `
**USER SYSTEM HARDWARE (Device Category: ${deviceType.toUpperCase()} - DEDICATED PLATFORM):**
- Platform device: The user is playing on a ${resolvedBrand} ${resolvedModel}
- Direct Raw Component values (CPU/GPU/RAM specs) are blocked and stripped because this is a standardized proprietary console.
- SPECIAL INSTRUCTION: Do NOT analyze this using general PC compatibility rules. Analyze based strictly on the official native console/handheld developer optimizations, console resolution/framerates targets, custom console graphic presets, and performance/quality modes reported for "${resolvedBrand} ${resolvedModel}" running "${selectedGame.name}".
`;
    } else if (deviceType === "mobile") {
      if (mobileSubType === "apple-ios") {
        userSystemHardwareSection = `
**USER SYSTEM HARDWARE (Device Category: MOBILE - iOS):**
- Platform device: The user is playing on an Apple Mobile iOS Device (iPhone)
- Model: Apple ${specs.cpuName} (iPhone Silicon Preset)
- Combined System RAM: ${specs.ramGB} GB (Unified Buffer)
- Storage Type: High speed Integrated flash
`;
      } else {
        userSystemHardwareSection = `
**USER SYSTEM HARDWARE (Device Category: MOBILE - ANDROID):**
- Platform device: Android Smartphone / Tablet named "${phoneName}"
- Core Processor (SoC): ${phoneCpu}
- Integrated Mobile GPU: ${phoneGpu}
- RAM Capacity: ${phoneRam} GB
- Storage Available: ${phoneStorage} GB (Integrated Mobile NAND)
`;
      }
    }

    const formattedPrompt = `
You are a highly detailed and precise Gaming Compatibility System Expert.
Analyze the compatibility between this Game and this System Hardware Specification.

**GAME DETAILS:**
- Game Name: ${selectedGame.name}
- Release Date: ${selectedGame.released}
- Genres: ${selectedGame.genres?.map(g => g.name).join(", ")}
- MINIMUM REQUIREMENTS: CPU: ${minR.cpu}, GPU: ${minR.gpu}, RAM: ${minR.ram}GB, Storage: ${minR.storage}GB
- RECOMMENDED REQUIREMENTS: CPU: ${recR.cpu}, GPU: ${recR.gpu}, RAM: ${recR.ram}GB, Storage: ${recR.storage}GB

${userSystemHardwareSection}

**STRICT COMPILER RESPONSE FORMAT:**
You MUST structure your response into these exact 3 sections starting with "## Summary", "## Best Settings" and "## Detailed Analysis". Keep your Arabic tone friendly and direct, and supply English terms inside parentheses where helpful.

## Summary
(Write a paragraph about how compatible this hardware is. Will it run? Address CPU/GPU strengths, RAM Speed, and Overclock bonus. Highlight memory caps or bottleneck. Use Arabic with English terms in brackets.)

## Best Settings
(List ideal target graphics details: resolution e.g., 1080p, 1440p, or 4K, quality slider Low, Medium, High, Ultra, target FPS, and options like DLSS or FSR settings). Render as a clean markdown list.

## Detailed Analysis
(Deliver a list breaking down specified hardware capabilities. Conclude with a realistic average FPS prediction.)
`;

    try {
      console.log("Sending system model specifications to Gemini via secure Vercel proxy...");
      const proxyUrl = "https://game-analyzer-proxy.vercel.app/api/analyze";
      let res;
      let textResult = "";
      let isSuccess = false;

      try {
        // Try calling the Vercel Proxy URL first
        res = await fetch(proxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: formattedPrompt })
        });

        if (res.ok) {
          const data = await res.json();
          // Extract response either from candidates list (standard Gemini API) or direct text wrapper
          if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            textResult = data.candidates[0].content.parts[0].text;
            isSuccess = true;
          } else if (data && data.text) {
            textResult = data.text;
            isSuccess = true;
          }
        }
      } catch (proxyErr) {
        console.warn("Vercel proxy connection bypassed, falling back to local proxy...", proxyErr);
      }

      if (!isSuccess) {
        // Execute fallback through the local node server API
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: formattedPrompt })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.text) {
            textResult = data.text;
            isSuccess = true;
          } else if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            textResult = data.candidates[0].content.parts[0].text;
            isSuccess = true;
          }
        }
      }

      if (isSuccess && textResult) {
        setDeepAnalysisRaw(textResult);
        addAiReportToHistoryItem(selectedGame.id, textResult);
      } else {
        throw new Error(lang === "ar" ? "تعذر العثور على محتوى النص المرتجع من الذكاء الاصطناعي." : "Empty context received from Remote AI Analyzer.");
      }
    } catch (e: any) {
      console.error("Gemini connection error:", e);
      const errorMessage = e?.message || "Timeout or Network Interruption";
      
      const errorReport = `## Summary
❌ **${lang === "ar" ? "عذراً! فشل الاتصال بخوادم تحليل الذكاء الاصطناعي السحابية" : "Cloud AI Connection Failed"}**

${lang === "ar" 
  ? `يتعذر الاتصال بخدمة التحليل السحابي الذكي (Gemini API) في الوقت الحالي. يرجى التحقق من اتصال شبكتك وإعادة تشغيل المسح مجدداً.
  • تفاصيل الخطأ: ${errorMessage}`
  : `The Cloud AI Analysis Engine is currently unreachable. Please check your system network connectivity.
  • Diagnostic details: ${errorMessage}`}

## Best Settings
- **${lang === "ar" ? "الإجراء المقترح:" : "Action Required:"}** ${lang === "ar" ? "الرجاء كسر جمود الاتصال أو المحاولة لاحقاً." : "Please check your server configurations and trigger scanner again."}
- **${lang === "ar" ? "البديل التلقائي المتاح على جهازك:" : "Calculated Local Presets:"}** ${lang === "ar" ? "يمكنك الاستعانة بتقرير العتاد السريع بالأعلى ومؤشر الإطارات التقديري المدمج." : "Please refer to the fast hardware specifications card above to verify system capability ratings."}

## Detailed Analysis
- **${lang === "ar" ? "حالة السيرفر:" : "Cloud Connection State:"}** Offline / Network Error.
- **${lang === "ar" ? "تعقب المطورين:" : "Developer Debug trace:"}** Server fetch operation catch sequence triggered.
`;
      setDeepAnalysisRaw(errorReport);
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  // Setup offline fallback generator
  const createLocalFallbackReport = (minR: any, recR: any) => {
    const isSufficient = localAnalysis && localAnalysis.overallScore >= 50;
    
    const summary = `## Summary
تم إنشاء هذا التقرير داخلياً بالوضع المحلي الثابت لتوقف الاتصال بالسحابة مؤقتاً.
يبدو عتاد جهازك المختبر (${specs.cpuName}) مع كرت الشاشة (${specs.gpuName}) بقوة تقديرية ملائمة إجمالاً لتشغيل لعبة **${selectedGame.name}**. 
حجم مساحتك المتوفرة (${specs.storageGB}GB) على قرص من نوع (${storageType}) سيضمن ${specs.isSSD ? "أوقات تحميل خاطفة وسلسة للغاية للعالم" : "تحميلات بمعدلات سرعة عادية ومخاوف كبرى من تفتت الإطارات أحياناً"}. تفعيل كسر السرعة (${isOverclocked ? "نشط" : "غير نشط"}) يدعم الأداء العام بنسبة 7% إضافية لمقاومة عنق الزجاجة الشائع وهو (${localAnalysis?.bottleneck}).`;

    const settings = `## Best Settings
- **دقة الشاشة المثالية:** ${localAnalysis?.recommendedResolution.split(" - ")[0] || "1080p"}
- **جودة الرسوم والمؤثرات:** ${isSufficient ? "High (مرتفعة)" : "Low / Balanced (مخفّضة للثبات)"}
- **تقنيات تنعيم الحواف والدقة:** تشغيل [DLSS / FSR Quality] إن وجد لتقليل الضغط الرسومي.
- **تحديد الإطارات الموصى به:** قفل معدل الإطارات عند ${localAnalysis?.estFps || 60} إطار لتحسين الاستقرار الحراري للقطع.`;

    const detailed = `## Detailed Analysis
- **تحليل المعالج المركزي (CPU):** أداء جيد ومستمر تحت الضغط.
- **سرعة ومسار ذاكرة النظام (RAM):** سعة ${specs.ramGB}GB بتردد ${ramSpeedMHz}MHz كافية للتشغيل.
- **المعالج الرسومي ومخزن الإطارات (VRAM):** مساحة كرتك البالغة ${specs.vramGB}GB توفر حماية مريحة للرندرة.
- **معدل الإطارات التقديري المتوسط القابل للعب:** حوالي **${localAnalysis?.estFps || 45} إطار بالثانية** مع استقرار عام ممتاز.`;

    return `${summary}\n\n${settings}\n\n${detailed}`;
  };

  // Convert Gemini Markdown paragraphs
  const parseAiScanReport = (text: string) => {
    const result = { summary: "", bestSettings: "", detailedAnalysis: "" };
    if (!text) return result;

    const summaryIdentifiers = ["## Summary", "### Summary", "## ملخص الأداء", "ملخص الأداء"];
    const settingsIdentifiers = ["## Best Settings", "### Best Settings", "## إعدادات التشغيل", "إعدادات التشغيل"];
    const analysisIdentifiers = ["## Detailed Analysis", "### Detailed Analysis", "## التحليل العميق", "التحليل العميق"];

    const getMatchedIndex = (queries: string[]) => {
      for (const q of queries) {
        const idx = text.indexOf(q);
        if (idx !== -1) return { tag: q, index: idx };
      }
      return null;
    };

    const s = getMatchedIndex(summaryIdentifiers);
    const bs = getMatchedIndex(settingsIdentifiers);
    const da = getMatchedIndex(analysisIdentifiers);

    const blocks = [
      { key: "summary", index: s?.index ?? -1, len: s?.tag.length ?? 0 },
      { key: "bestSettings", index: bs?.index ?? -1, len: bs?.tag.length ?? 0 },
      { key: "detailedAnalysis", index: da?.index ?? -1, len: da?.tag.length ?? 0 }
    ].filter(x => x.index !== -1).sort((a, b) => a.index - b.index);

    if (blocks.length === 0) {
      result.summary = text;
      return result;
    }

    for (let i = 0; i < blocks.length; i++) {
      const cur = blocks[i];
      const next = blocks[i + 1];
      const start = cur.index + cur.len;
      const end = next ? next.index : text.length;

      let segment = text.slice(start, end).trim();
      if (segment.startsWith(":")) {
        segment = segment.slice(1).trim();
      }

      if (cur.key === "summary") result.summary = segment;
      else if (cur.key === "bestSettings") result.bestSettings = segment;
      else if (cur.key === "detailedAnalysis") result.detailedAnalysis = segment;
    }

    if (!result.summary) result.summary = text.split("##")[0] || text;
    return result;
  };

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black text-right" dir="rtl">
      
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-5 w-80 h-80 bg-cyan-950/20 rounded-full filter blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-5 w-80 h-80 bg-indigo-950/20 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* HEADER BAR */}
      <header className="border-b border-gray-800/80 bg-[#070b18]/75 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-bold shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div>
              <span className="text-sm font-bold tracking-wider font-mono text-cyan-400">CORECOMPAT</span>
              <h1 className="text-[10px] text-gray-400 font-mono hidden sm:block">HARDWARE CHECKER V3.0</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual languages toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-850 border border-gray-800 text-xs font-semibold text-cyan-400 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-gray-400" />
              <span>{lang === "ar" ? "English Specs" : "العربية (Arabic)"}</span>
            </button>

            {/* Restored PWA Install Button */}
            <button
              id="installPwaBtn"
              onClick={installPwaApp}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-lg shadow-teal-500/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.installBtnText}</span>
              <span className="inline md:hidden">{lang === "ar" ? "تنزيل" : "Install"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY CONTENT CONTAINER */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-8 w-full flex flex-col gap-8">
        
        {/* APP HEADING */}
        <section className="text-right flex flex-col gap-2.5 max-w-4xl mx-auto w-full py-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono tracking-wider w-fit self-start">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI-STOMP SECURE SYSTEM SPECS VERIFIED</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-white leading-tight font-display">
            {t.appTitle}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-3xl">
            {t.appSub}
          </p>
        </section>

        {/* BENTO ACTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Game selector + Hardware details */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* 1. SELECTION OF GAME */}
            <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 border-b border-gray-900 pb-2">
                <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400"><Gamepad2 className="w-4 h-4" /></span>
                <span>{t.searchTitle}</span>
              </h3>

              {/* Live search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-3.5 rounded-xl text-xs outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all text-right pr-11 pl-4"
                />
                <Search className="absolute top-3.5 w-4.5 h-4.5 text-gray-500 right-4" />
                
                {isSearchingGames && (
                  <span className="absolute left-3 top-3.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
                  </span>
                )}
              </div>

              {/* Absolute Dropdown Results container */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-950 border border-gray-850 rounded-xl max-h-56 overflow-y-auto divide-y divide-gray-900 z-30 shadow-2xl mt-1"
                  >
                    {searchResults.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => {
                          setSelectedGame(game);
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                        className="w-full p-3 text-right flex items-center gap-3 hover:bg-gray-900 transition flex-row-reverse"
                      >
                        <img src={game.background_image} alt="" className="w-12 h-8 rounded-lg object-cover" />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-gray-200 truncate">{game.name}</h4>
                          <span className="text-[10px] text-gray-500 truncate block">
                            {t.released}: {game.released}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-650 rotate-180 shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic popular section fetched from RAWG API */}
              <div>
                <span className="text-[10px] font-mono text-gray-400 block mb-2 font-bold select-none">
                  {t.popularGames}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(trendingGames.length > 0 ? trendingGames : POPULAR_FALLBACK_GAMES).slice(0, 6).map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className={`relative overflow-hidden rounded-xl h-20 group text-right border transition active:scale-95 cursor-pointer ${
                        selectedGame.id === game.id 
                          ? "border-cyan-500 shadow-md shadow-cyan-500/10 bg-cyan-950/20" 
                          : "border-gray-850 hover:border-gray-700 bg-gray-950/40"
                      }`}
                    >
                      <img 
                        src={game.background_image} 
                        referrerPolicy="no-referrer"
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-2 z-10">
                        <span className="text-[10px] font-bold text-gray-100 line-clamp-2 leading-none text-center">
                          {game.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RAWG attribution link for API legal compliance */}
              <div className="mt-4 pt-3 border-t border-gray-900/60 flex justify-between items-center text-[10px] text-gray-500 font-mono select-none">
                <span>Database Search Status</span>
                <span>
                  Data powered by <a href="https://rawg.io/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">RAWG <ExternalLink className="w-2.5 h-2.5" /></a>
                </span>
              </div>
            </div>

            {/* 2. SPECIFICATION SYSTEM RESTORATION WITH 4 DEVICE TYPES */}
            <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
              
              <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-3 border-b border-gray-900 pb-3">
                <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400"><Sliders className="w-4 h-4" /></span>
                  <span>{t.specTitle}</span>
                </h3>

                {/* Device categories tab selector (4 Categories) */}
                <div className="flex bg-gray-950 p-1.5 rounded-xl border border-gray-850 flex-wrap gap-1 flex-row-reverse">
                  <button
                    onClick={() => setDeviceType("desktop")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${deviceType === "desktop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>{t.desktopMode}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeviceType("console");
                      setConsoleBrand("sony");
                      setConsoleModel("ps5");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${deviceType === "console" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>{t.consoleMode}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeviceType("handheld");
                      setHandheldBrand("valve");
                      setHandheldModel("steam-deck-oled");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${deviceType === "handheld" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <HandheldIcon className="w-3.5 h-3.5 animate-pulse" />
                    <span>{t.handheldMode}</span>
                  </button>
                  <button
                    onClick={() => setDeviceType("mobile")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${deviceType === "mobile" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{t.mobileMode}</span>
                  </button>
                </div>
              </div>

              {/* Smart Auto-Scan Section */}
              <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-900 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={runHardwareAutoScan}
                  disabled={autoScanStatus === "running"}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    autoScanStatus === "running"
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800 animate-pulse"
                      : autoScanStatus === "success"
                      ? "bg-emerald-600 text-white shadow-emerald-950/20"
                      : "bg-[#11182c] hover:bg-[#16223f] text-cyan-400 border border-cyan-900/40 hover:border-cyan-500/30"
                  }`}
                >
                  <Cpu className={`w-4 h-4 text-cyan-400 ${autoScanStatus === "running" ? "animate-spin" : ""}`} />
                  <span>
                    {autoScanStatus === "running"
                      ? t.autoScanRunning
                      : autoScanStatus === "success"
                      ? t.autoScanSuccess
                      : t.autoScanBtn}
                  </span>
                </button>

                {/* Simulated scan output logs */}
                {scanLogs.length > 0 && (
                  <div className="bg-black/80 border border-gray-900 rounded-lg p-3 font-mono text-[10px] text-zinc-400 flex flex-col gap-1 max-h-32 overflow-y-auto text-left" dir="ltr">
                    {scanLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-cyan-500 font-bold select-none">&gt;</span>
                        <span className="flex-1">{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RENDER FOR DESKTOP/LAPTOP (WITH FREE TEXT & VALIDATION & RESTORED OVERCLOCK) */}
              {deviceType === "desktop" && (
                <div className="flex flex-col gap-4">
                  {/* Category Selection: Custom Build vs Apple Mac */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950/40 p-3.5 rounded-xl border border-gray-900">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                        {t.pcCategoryLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                        <button
                          type="button"
                          onClick={() => setPcCategory("custom")}
                          className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${pcCategory === "custom" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                        >
                          {t.customPcOpt}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPcCategory("apple-mac");
                            // Default Apple Preset
                            handleAppleFamilyChange("macbook_pro");
                          }}
                          className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${pcCategory === "apple-mac" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                        >
                          {t.appleMacOpt}
                        </button>
                      </div>
                    </div>

                    {/* Subtype Selection (Only for Custom Build) */}
                    {pcCategory === "custom" && (
                      <div className="flex flex-col gap-1.5 animate-fade-in">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.pcSubTypeLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                          <button
                            type="button"
                            onClick={() => setPcSubType("desktop")}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${pcSubType === "desktop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                          >
                            {t.desktopSubType}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPcSubType("laptop")}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${pcSubType === "laptop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                          >
                            {t.laptopSubType}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Motherboard vs Laptop inputs (Only for Custom PC category) */}
                  {pcCategory === "custom" && (
                    <div className="grid grid-cols-1 gap-4">
                      {pcSubType === "desktop" ? (
                        <div className="flex flex-col gap-1.5 relative">
                          <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                            {t.motherboardLabel} <span className="text-rose-450 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={motherboardModel}
                            onChange={(e) => {
                              setMotherboardModel(e.target.value);
                              setMotherboardError("");
                            }}
                            placeholder={t.motherboardPlaceholder}
                            className={`bg-gray-950 border p-3 rounded-xl text-xs outline-none text-right placeholder:text-gray-650 ${motherboardError ? "border-rose-500/70 focus:border-rose-500" : "border-gray-850 focus:border-cyan-500"}`}
                          />
                          {motherboardError && (
                            <span className="text-[9px] text-rose-400 mt-1 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> {motherboardError}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 relative">
                          <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                            {t.laptopModelLabel} <span className="text-rose-450 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={laptopModel}
                            onChange={(e) => {
                              setLaptopModel(e.target.value);
                              setLaptopError("");
                            }}
                            placeholder={t.laptopModelPlaceholder}
                            className={`bg-gray-950 border p-3 rounded-xl text-xs outline-none text-right placeholder:text-gray-650 ${laptopError ? "border-rose-500/70 focus:border-rose-500" : "border-gray-850 focus:border-cyan-500"}`}
                          />
                          {laptopError && (
                            <span className="text-[9px] text-rose-400 mt-1 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> {laptopError}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* APPLE MAC PRESET SELECTORS */}
                  {pcCategory === "apple-mac" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-cyan-950/15 border border-cyan-900/30 p-4 rounded-xl">
                      {/* Family */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          {t.appleFamilyLabel}
                        </label>
                        <select
                          value={appleFamily}
                          onChange={(e) => handleAppleFamilyChange(e.target.value)}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          {Object.entries(APPLE_DEVICES_TREE)
                            .filter(([key]) => key !== "iphone") // Filter out iphone from Mac list
                            .map(([key, node]) => (
                              <option key={key} value={key}>
                                {lang === "ar" ? node.name_ar : node.name_en}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Generation */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          {t.appleGenLabel}
                        </label>
                        <select
                          value={appleGen}
                          onChange={(e) => handleAppleGenChange(e.target.value)}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          {Object.entries(APPLE_DEVICES_TREE[appleFamily]?.generations || {}).map(([key, gen]) => (
                            <option key={key} value={key}>
                              {lang === "ar" ? gen.name_ar : gen.name_en}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tier */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          {t.appleTierLabel}
                        </label>
                        <select
                          value={appleTier}
                          onChange={(e) => setAppleTier(e.target.value)}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          {Object.entries(APPLE_DEVICES_TREE[appleFamily]?.generations[appleGen]?.tiers || {}).map(([key, tier]) => (
                            <option key={key} value={key}>
                              {lang === "ar" ? tier.name_ar || tier.name : tier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* CUSTOM HARDWARE INPUTS (ONLY SHOWN FOR GENERAL DESKTOP/LAPTOP) */}
                  {pcCategory === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Free Text CPU Input with Client-side validation feedback */}
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.cpu} <span className="text-rose-450 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={customCpu}
                          onChange={(e) => {
                            setCustomCpu(e.target.value);
                            setCpuValError("");
                          }}
                          placeholder={t.cpuPlaceholder}
                          className={`bg-gray-950 border p-3 rounded-xl text-xs outline-none text-right placeholder:text-gray-650 ${cpuValError ? "border-rose-500/70 focus:border-rose-500" : "border-gray-850 focus:border-cyan-500"}`}
                        />
                        {cpuValError && (
                          <span className="text-[9px] text-rose-400 mt-1 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> {cpuValError}
                          </span>
                        )}
                      </div>

                      {/* Free Text GPU Input with validation */}
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.gpu} <span className="text-rose-450 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={customGpu}
                          onChange={(e) => {
                            setCustomGpu(e.target.value);
                            setGpuValError("");
                          }}
                          placeholder={t.gpuPlaceholder}
                          className={`bg-gray-950 border p-3 rounded-xl text-xs outline-none text-right placeholder:text-gray-650 ${gpuValError ? "border-rose-500/70 focus:border-rose-500" : "border-gray-850 focus:border-cyan-500"}`}
                        />
                        {gpuValError && (
                          <span className="text-[9px] text-rose-400 mt-1 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> {gpuValError}
                          </span>
                        )}
                      </div>

                      {/* Restored Overclocking Toggle */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>{t.overclock}</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                          <button
                            type="button"
                            onClick={() => setIsOverclocked(true)}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${isOverclocked ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-gray-500"}`}
                          >
                            <Flame className="w-3 h-3" />
                            <span>{t.overclockOn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsOverclocked(false)}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${!isOverclocked ? "bg-gray-900 text-gray-400 border border-gray-800" : "text-gray-500"}`}
                          >
                            {t.overclockOff}
                          </button>
                        </div>
                      </div>

                      {/* Restored RAM speed dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.ramSpeed}
                        </label>
                        <select
                          value={ramSpeedMHz}
                          onChange={(e) => setRamSpeedMHz(parseInt(e.target.value))}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          <option value="1600">1600 MHz {lang === "ar" ? "(DDR3 - جيل قديم)" : "(DDR3 - Old Gen)"}</option>
                          <option value="2133">2133 MHz {lang === "ar" ? "(LPDDR3 / DDR4 الأساسي)" : "(LPDDR3 / Basic DDR4)"}</option>
                          <option value="2666">2666 MHz {lang === "ar" ? "(DDR4 قياسي)" : "(Standard DDR4)"}</option>
                          <option value="3200">3200 MHz {lang === "ar" ? "(DDR4 شائع)" : "(Common DDR4)"}</option>
                          <option value="3600">3600 MHz {lang === "ar" ? "(DDR4 أداء فائق)" : "(High Performance DDR4)"}</option>
                          <option value="4800">4800 MHz {lang === "ar" ? "(DDR5 قياسي)" : "(Standard DDR5)"}</option>
                          <option value="5200">5200 MHz {lang === "ar" ? "(DDR5 متطور)" : "(Advanced DDR5)"}</option>
                          <option value="6000">6000 MHz+ {lang === "ar" ? "(DDR5/LPDDR5X خارق)" : "(Extreme LPDDR5X)"}</option>
                        </select>
                      </div>

                      {/* Desktop OS selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.os}
                        </label>
                        <select
                          value={osName}
                          onChange={(e) => setOsName(e.target.value)}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          <option value="Windows 11 64-bit">Windows 11 (64-bit)</option>
                          <option value="Windows 10 64-bit">Windows 10 (64-bit)</option>
                          <option value="macOS Sequoia 15">macOS Sequoia (v15)</option>
                          <option value="SteamOS / Linux Core">SteamOS / Linux (Nobara/Arch)</option>
                        </select>
                      </div>

                      {/* Expanded Storage options architecture selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-300/80 uppercase">
                          {t.storageType}
                        </label>
                        <select
                          value={storageType}
                          onChange={(e) => setStorageType(e.target.value)}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          <option value="NVMe SSD">{lang === "ar" ? "NVMe M.2 SSD (فائق السرعة)" : "NVMe M.2 SSD (Super-fast)"}</option>
                          <option value="SATA SSD">{lang === "ar" ? "SATA III SSD (سرعة ممتازة)" : "SATA III SSD (Great Speed)"}</option>
                          <option value="SATA HDD">{lang === "ar" ? "SATA HDD (ميكانيكي بطيء)" : "SATA HDD (Slow Mechanical)"}</option>
                          <option value="UFS Storage">{lang === "ar" ? "ذاكرة فلاش UFS (أجهزة ذكية)" : "UFS Flash Storage (Smart Devices)"}</option>
                          <option value="eMMC Storage">{lang === "ar" ? "ذاكرة eMMC (أجهزة اقتصادية)" : "eMMC Storage (Budget Devices)"}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* DISPLAY SPECS SUMMARY CARD IF APPLE MAC PRESET IS ACTIVE */}
                  {pcCategory === "apple-mac" && (
                    <div className="bg-gray-950/60 border border-gray-900 rounded-xl p-4 flex flex-col gap-2.5">
                      <div className="text-[11px] font-bold text-cyan-400 border-b border-gray-900 pb-2 mb-1 flex items-center justify-between">
                        <span>{t.appleHardwareProfile}</span>
                        <span>🖥️ macOS Silicon Preset</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
                        <div><strong>{t.appleCpu}</strong> <span className="text-gray-200">{specs.cpuName}</span></div>
                        <div><strong>{t.appleRam}</strong> <span className="text-gray-200">{specs.ramGB} GB</span></div>
                        <div><strong>{t.appleVram}</strong> <span className="text-gray-200">{specs.vramGB} GB (Unified Buffer)</span></div>
                        <div><strong>{t.appleScore}</strong> <span className="text-gray-200">{t.appleScoreValue}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Range Sliders for sizes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-950/40 border border-gray-900 p-4 rounded-xl mt-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-teal-400">
                        <span>{t.ram}</span>
                        <span>{ramGB} GB</span>
                      </div>
                      {pcCategory === "custom" ? (
                        <input
                          type="range" min={4} max={128} step={4}
                          value={ramGB}
                          onChange={(e) => setRamGB(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      ) : (
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden mt-2 border border-gray-850">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (ramGB / 128) * 100)}%` }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-indigo-400">
                        <span>{t.vram}</span>
                        <span>{vramGB} GB</span>
                      </div>
                      {pcCategory === "custom" ? (
                        <input
                          type="range" min={1} max={24} step={1}
                          value={vramGB}
                          onChange={(e) => setVramGB(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      ) : (
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden mt-2 border border-gray-850">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (vramGB / 24) * 100)}%` }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-cyan-400">
                        <span>{t.storage}</span>
                        <span>{storageGB} GB</span>
                      </div>
                      <input
                        type="range" min={10} max={2000} step={10}
                        value={storageGB}
                        onChange={(e) => setStorageGB(parseInt(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* RENDER FOR COMPREHENSIVE DEDICATED HOME CONSOLES */}
              {deviceType === "console" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-indigo-300/80 uppercase">
                        {t.brandLabel}
                      </label>
                      <select
                        value={consoleBrand}
                        onChange={(e) => {
                          const brand = e.target.value;
                          setConsoleBrand(brand);
                          const filteredModels = CONSOLE_MODELS[brand] || [];
                          if (filteredModels.length > 0) {
                            setConsoleModel(filteredModels[0].id);
                          }
                        }}
                        className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right"
                      >
                        {CONSOLE_BRANDS.map((b) => (
                          <option key={b.id} value={b.id}>{getBrandName(b.id)}</option>
                        ))}
                      </select>
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-indigo-300/80 uppercase">
                        {t.modelLabel}
                      </label>
                      <select
                        value={consoleModel}
                        onChange={(e) => setConsoleModel(e.target.value)}
                        className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right"
                      >
                        {(CONSOLE_MODELS[consoleBrand] || []).map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
 
                  {/* Auto-filled specifications results card */}
                  {(() => {
                    const matchedPreset = (CONSOLE_MODELS[consoleBrand] || []).find(c => c.id === consoleModel);
                    if (!matchedPreset) return null;
                    return (
                      <div className="bg-indigo-950/10 border border-indigo-900/30 p-4 rounded-xl flex flex-col gap-2 text-right">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest block mb-1">
                          {t.configurationReport}
                        </span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-300">
                          <div><strong>{t.centralCpu}</strong> {matchedPreset.cpu}</div>
                          <div><strong>{t.graphicsGpu}</strong> {matchedPreset.gpu}</div>
                          <div><strong>{t.unifiedMemory}</strong> {matchedPreset.ram}</div>
                          <div><strong>{t.integratedStorage}</strong> {matchedPreset.storage} ({matchedPreset.storageType})</div>
                          <div><strong>{t.playabilityRating}</strong> {matchedPreset.overallRating}% (Index)</div>
                        </div>
                        <p className="text-[10.5px] text-indigo-300 mt-2 leading-relaxed bg-black/35 p-2 rounded-lg border border-indigo-950/40">
                          {getConsoleExplanation(matchedPreset.id, matchedPreset.explanation, lang)}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
 
              {/* RENDER FOR COMPREHENSIVE HANDHELD RETRO & GENERATIONS DATABASE */}
              {deviceType === "handheld" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-emerald-300/80 uppercase">
                        {t.brandLabel}
                      </label>
                      <select
                        value={handheldBrand}
                        onChange={(e) => {
                          const brand = e.target.value;
                          setHandheldBrand(brand);
                          const filteredModels = HANDHELD_MODELS[brand] || [];
                          if (filteredModels.length > 0) {
                            setHandheldModel(filteredModels[0].id);
                          }
                        }}
                        className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right"
                      >
                        {HANDHELD_BRANDS.map((b) => (
                          <option key={b.id} value={b.id}>{getBrandName(b.id)}</option>
                        ))}
                      </select>
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-emerald-300/80 uppercase">
                        {t.modelLabel}
                      </label>
                      <select
                        value={handheldModel}
                        onChange={(e) => setHandheldModel(e.target.value)}
                        className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right"
                      >
                        {(HANDHELD_MODELS[handheldBrand] || []).map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
 
                  {/* Auto-filled stats */}
                  {(() => {
                    const matchedPreset = (HANDHELD_MODELS[handheldBrand] || []).find(h => h.id === handheldModel);
                    if (!matchedPreset) return null;
                    return (
                      <div className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl flex flex-col gap-2 text-right">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
                          {t.handheldFactSheet}
                        </span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-300">
                          <div><strong>{t.handheldApu}</strong> {matchedPreset.cpu}</div>
                          <div><strong>{t.handheldGpuCores}</strong> {matchedPreset.gpu}</div>
                          <div><strong>{t.handheldSharedMem}</strong> {matchedPreset.ram}</div>
                          <div><strong>{t.handheldStorageSpeed}</strong> {matchedPreset.storage} ({matchedPreset.storageType})</div>
                        </div>
                        <p className="text-[10.5px] text-emerald-300 mt-2 leading-relaxed bg-black/35 p-2 rounded-lg border border-emerald-950/40">
                          {getConsoleExplanation(matchedPreset.id, matchedPreset.explanation, lang)}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* RENDER FOR MOBILE PHONE SMART ENTRY & COMPATIBILITY CHECK */}
              {deviceType === "mobile" && (
                <div className="flex flex-col gap-4">
                  
                  {/* Platform Selector */}
                  <div className="flex flex-col gap-1.5 bg-gray-950/40 p-3.5 rounded-xl border border-gray-900">
                    <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                      {t.mobilePlatformLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                      <button
                        type="button"
                        onClick={() => setMobileSubType("android")}
                        className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${mobileSubType === "android" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        {t.androidOpt}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileSubType("apple-ios");
                          // Force standard iPhone selected state values
                          setAppleFamily("iphone");
                          setAppleGen("iphone-15");
                          setAppleTier("pro");
                        }}
                        className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${mobileSubType === "apple-ios" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        {t.appleIosOpt}
                      </button>
                    </div>
                  </div>

                  {/* APPLE IOS IPHONE DROP-DOWN SELECTORS */}
                  {mobileSubType === "apple-ios" ? (
                    <div className="flex flex-col gap-4 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-950/10 border border-purple-900/30 p-4 rounded-xl">
                        {/* Generation select */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                            {t.appleGenLabel}
                          </label>
                          <select
                            value={appleGen}
                            onChange={(e) => handleAppleGenChange(e.target.value)}
                            className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                          >
                            {Object.entries(APPLE_DEVICES_TREE["iphone"]?.generations || {}).map(([key, gen]) => (
                              <option key={key} value={key}>
                                {lang === "ar" ? gen.name_ar : gen.name_en}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Tier select */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                            {t.appleTierLabel}
                          </label>
                          <select
                            value={appleTier}
                            onChange={(e) => setAppleTier(e.target.value)}
                            className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                          >
                            {Object.entries(APPLE_DEVICES_TREE["iphone"]?.generations[appleGen]?.tiers || {}).map(([key, tier]) => (
                              <option key={key} value={key}>
                                {lang === "ar" ? tier.name_ar || tier.name : tier.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Display iPhone Specs breakdown details */}
                      <div className="bg-gray-950/60 border border-gray-900 rounded-xl p-4 flex flex-col gap-2.5">
                        <div className="text-[11px] font-bold text-purple-400 border-b border-gray-900 pb-2 mb-1 flex items-center justify-between flex-row-reverse text-right">
                          <span>📱 iOS iPhone Preset</span>
                          <span>{t.activeIphoneSpecs}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400 text-right flex-row-reverse">
                          <div><strong>{t.processorChip}</strong> <span className="text-gray-200">{specs.cpuName}</span></div>
                          <div><strong>{t.systemMemory}</strong> <span className="text-gray-200">{specs.ramGB} GB RAM</span></div>
                          <div><strong>{t.virtualGraphics}</strong> <span className="text-gray-200">{specs.vramGB} GB (Virtual Buffer)</span></div>
                          <div><strong>{t.defaultEcosystem}</strong> <span className="text-gray-200">{t.appleIosEco}</span></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ANDROID FREE FORM TEXT INPUTS */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                          {t.smartphoneTabletName}
                        </label>
                        <input
                          type="text"
                          value={phoneName}
                          onChange={(e) => setPhoneName(e.target.value)}
                          placeholder={t.smartphoneNamePlaceholder}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                          {t.coreProcessor}
                        </label>
                        <input
                          type="text"
                          value={phoneCpu}
                          onChange={(e) => setPhoneCpu(e.target.value)}
                          placeholder={t.smartphoneCpuPlaceholder}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                          {t.integratedGraphics}
                        </label>
                        <input
                          type="text"
                          value={phoneGpu}
                          onChange={(e) => setPhoneGpu(e.target.value)}
                          placeholder={t.smartphoneGpuPlaceholder}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                          {t.systemMemoryLabel}
                        </label>
                        <select
                          value={phoneRam}
                          onChange={(e) => setPhoneRam(parseInt(e.target.value))}
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                        >
                          <option value="4">4 GB RAM</option>
                          <option value="6">6 GB RAM {lang === "ar" ? "(متوسط)" : "(Medium)"}</option>
                          <option value="8">8 GB RAM {lang === "ar" ? "(ممتاز للكونسول)" : "(Great for Console)"}</option>
                          <option value="12">12 GB RAM {lang === "ar" ? "(أداء ألعاب ثقيل)" : "(Heavy Gaming Performance)"}</option>
                          <option value="16">16 GB RAM {lang === "ar" ? "(وحش ألعاب)" : "(Extreme Power)"}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STORAGE SELECTOR (SHOWN FOR BOTH IPHONE & ANDROID AS THE OPTION SECTOR) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-purple-300/80 uppercase">
                      {t.internalAllocatedStorage}
                    </label>
                    <select
                      value={phoneStorage}
                      onChange={(e) => setPhoneStorage(parseInt(e.target.value))}
                      className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 cursor-pointer text-gray-300 text-right w-full"
                    >
                      <option value="64">64 GB Storage</option>
                      <option value="128">128 GB Storage</option>
                      <option value="256">256 GB Storage</option>
                      <option value="512">512 GB Storage</option>
                      <option value="1000">1 TB Storage Ultra</option>
                    </select>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* RIGHT: Visual results compass + report overview */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
            
            {/* COMPACT Selected Game information cover card */}
            {selectedGame && (
              <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex gap-4 overflow-hidden flex-row-reverse text-right">
                <img 
                  src={selectedGame.background_image} 
                  alt="" 
                  className="w-20 h-24 rounded-xl object-cover border border-gray-800 shrink-0" 
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 justify-start flex-row-reverse">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/25 block">
                      TARGET GAME
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-100 truncate">{selectedGame.name}</h3>
                  <div className="text-[11px] text-gray-400 mt-1 flex flex-row-reverse flex-wrap gap-x-2.5 gap-y-0.5">
                    <span><strong>{t.genre}:</strong> {selectedGame.genres?.map(g => g.name)[0] || t.notSpecified}</span>
                    <span>|</span>
                    <span><strong>{t.released}:</strong> {selectedGame.released}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 mt-2 block leading-none font-mono font-bold">
                    {t.rawgDisclaimer}
                  </span>
                </div>
              </div>
            )}

            {/* LIVE COGNITIVE SCORE AND PERFORMANCE OVERVIEW */}
            <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 flex-row pb-1 border-b border-gray-900">
                <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400"><Activity className="w-4 h-4 text-rose-450" /></span>
                <span>{t.fastAnalysisTitle}</span>
              </h3>

              {localAnalysis ? (
                <div className="flex flex-col gap-4 text-right">
                  {/* Circular visual score representation */}
                  <div className="flex items-center gap-5 bg-gray-950/50 p-4 rounded-xl border border-gray-900 flex-row-reverse">
                    <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx={36} cy={36} r={32} stroke="currentColor" className="text-gray-900" strokeWidth={5} fill="none" />
                        <circle 
                          cx={36} cy={36} r={32} stroke="currentColor" 
                          className="text-cyan-500 transition-all duration-500" 
                          strokeWidth={5} 
                          strokeDasharray={201} 
                          strokeDashoffset={201 - (201 * localAnalysis.overallScore) / 100} 
                          fill="none" 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <span className="absolute text-sm font-mono font-extrabold text-white">{localAnalysis.overallScore}%</span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <span className="text-[9px] uppercase font-mono text-gray-500 block mb-0.5">{t.overallScore}</span>
                      <h4 className="text-xs font-bold text-gray-300 leading-snug truncate">{localAnalysis.verdict}</h4>
                    </div>
                  </div>

                  {/* Component spec ratings checkpoints */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-xl flex items-center justify-between gap-1 flex-row-reverse">
                      <span className="text-gray-400">CPU MATCH</span>
                      <span className={`font-mono font-extrabold ${localAnalysis.cpuStatus === "pass" ? "text-emerald-400" : localAnalysis.cpuStatus === "warn" ? "text-amber-400" : "text-rose-400"}`}>
                        {localAnalysis.cpuStatus === "pass" ? "PASS" : localAnalysis.cpuStatus === "warn" ? "WARN" : "FAIL"}
                      </span>
                    </div>

                    <div className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-xl flex items-center justify-between gap-1 flex-row-reverse">
                      <span className="text-gray-400">GPU CORE</span>
                      <span className={`font-mono font-extrabold ${localAnalysis.gpuStatus === "pass" ? "text-emerald-400" : localAnalysis.gpuStatus === "warn" ? "text-amber-400" : "text-rose-400"}`}>
                        {localAnalysis.gpuStatus === "pass" ? "PASS" : localAnalysis.gpuStatus === "warn" ? "WARN" : "FAIL"}
                      </span>
                    </div>

                    <div className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-xl flex items-center justify-between gap-1 flex-row-reverse">
                      <span className="text-gray-400">SYS RAM</span>
                      <span className={`font-mono font-extrabold ${localAnalysis.ramStatus === "pass" ? "text-emerald-400" : localAnalysis.ramStatus === "warn" ? "text-amber-400" : "text-rose-400"}`}>
                        {localAnalysis.ramStatus === "pass" ? "PASS" : localAnalysis.ramStatus === "warn" ? "WARN" : "FAIL"}
                      </span>
                    </div>

                    <div className="bg-gray-950/40 border border-gray-900 p-2.5 rounded-xl flex items-center justify-between gap-1 flex-row-reverse">
                      <span className="text-gray-400">SSD LOADING</span>
                      <span className={`font-mono font-extrabold ${localAnalysis.storageStatus === "pass" ? "text-emerald-400" : localAnalysis.storageStatus === "warn" ? "text-amber-400" : "text-rose-400"}`}>
                        {localAnalysis.storageStatus === "pass" ? "PASS" : localAnalysis.storageStatus === "warn" ? "WARN" : "FAIL"}
                      </span>
                    </div>
                  </div>

                  {/* GPU Shaders check bar */}
                  <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-900 flex items-center justify-between flex-row-reverse">
                    <span className="text-gray-400 text-[10px] uppercase font-mono">{t.gpuShaders}</span>
                    <span className={`font-bold uppercase text-[10px] ${localAnalysis.gpuStatus === "pass" ? "text-emerald-400" : localAnalysis.gpuStatus === "warn" ? "text-amber-400" : "text-rose-400"}`}>
                      {localAnalysis.gpuStatus === "pass" ? t.renderOk : localAnalysis.gpuStatus === "warn" ? t.aged : t.outdated}
                    </span>
                  </div>

                  {/* Latency statistics estimation boxes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-950/10 border border-indigo-900/35 rounded-xl p-3 flex flex-col justify-between text-right">
                      <span className="text-gray-500 text-[8px] uppercase font-mono">{t.estFps}</span>
                      <span className="text-xl font-black text-indigo-400 font-mono tracking-wider">
                        {localAnalysis.estFps} <span className="text-[10px] font-normal text-gray-400">FPS</span>
                      </span>
                    </div>
                    <div className="bg-cyan-950/10 border border-cyan-900/35 rounded-xl p-3 flex flex-col justify-between text-right">
                      <span className="text-gray-500 text-[8px] uppercase font-mono">{t.resolution}</span>
                      <span className="text-[10px] font-black text-cyan-400 truncate">{localAnalysis.recommendedResolution}</span>
                    </div>
                  </div>

                  {/* Bottleneck feedback line */}
                  <div className="bg-amber-950/10 border border-amber-900/30 p-2.5 rounded-md text-xs text-amber-300 flex items-center gap-2 justify-end">
                    <span>{localAnalysis.bottleneck}</span>
                    <strong className="text-gray-400 font-mono text-[10px]">{t.bottleneck}:</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500 text-xs">{t.noGameSelected}</div>
              )}

              {/* Gemini Trigger Button */}
              <div className="mt-2 flex flex-col gap-3">
                <button
                  onClick={executeGeminiScanner}
                  disabled={isDeepAnalyzing || !selectedGame}
                  className="w-full bg-[#1e1b4b] hover:bg-[#2b277b] text-indigo-100 py-3.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 border border-indigo-700/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg active:scale-98"
                >
                  <Sparkles className={`w-4 h-4 text-yellow-400 ${isDeepAnalyzing ? "animate-pulse" : ""}`} />
                  <span>{isDeepAnalyzing ? t.aiAnalyzing : t.aiFullAnalysis}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: Gemini scan results output dashboard */}
        <AnimatePresence>
          {deepAnalysisRaw && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-[#0a0f1c] border border-cyan-500/10 rounded-2xl p-6 shadow-xl flex flex-col gap-6 text-right"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </span>
                  <h3 className="text-xs font-bold font-mono text-white tracking-widest uppercase">
                    تقرير فحص الذكاء الاصطناعي (GEMINI SYSTEM SCAN REPORT)
                  </h3>
                </div>
                <button 
                  onClick={() => setDeepAnalysisRaw("")} 
                  className="text-gray-500 hover:text-gray-300 text-xs transition cursor-pointer font-mono"
                >
                  [إغلاق // Close X]
                </button>
              </div>

              {(() => {
                const parts = parseAiScanReport(deepAnalysisRaw);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Summary Card */}
                    <div className="bg-[#060810]/70 border border-gray-850 p-5 rounded-xl flex flex-col gap-3">
                      <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 justify-end">
                        <span className="text-gray-300">📝</span> {t.compatibilitySummary}
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line text-justify">{parts.summary}</p>
                    </div>

                    {/* Best Settings suggestion */}
                    <div className="bg-[#060810]/70 border border-gray-850 p-5 rounded-xl flex flex-col gap-3">
                      <h4 className="text-teal-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 justify-end">
                        <span className="text-gray-300">🔧</span> {t.optimalSettings}
                      </h4>
                      <p className="text-gray-350 text-xs leading-relaxed whitespace-pre-line text-right">{parts.bestSettings}</p>
                    </div>

                    {/* Technical breakdown stats */}
                    <div className="bg-[#060810]/70 border border-gray-850 p-5 rounded-xl flex flex-col gap-3">
                      <h4 className="text-indigo-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 justify-end">
                        <span className="text-gray-300">📊</span> {t.detailedMetrics}
                      </h4>
                      <div className="text-gray-300 text-xs leading-relaxed whitespace-pre-line font-mono bg-black/40 p-3 rounded-lg border border-gray-900 text-right">
                        {parts.detailedAnalysis}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESTORED: OFFLINE LOCK PERSISTENCE LAST 5 CHRONOLOGICAL ANALYZED GAMES CAROUSEL */}
        <section className="bg-[#0a0f1c]/50 border border-gray-850 rounded-2xl p-5 shadow-inner text-right">
          <div className="flex flex-row-reverse items-center justify-between border-b border-gray-900 pb-3 mb-4">
            <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase flex items-center gap-2 flex-row-reverse">
              <History className="w-4 h-4 text-cyan-400" />
              <span>{t.historyTitle}</span>
            </h3>
            {historyList.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-3 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-rose-450 hover:text-rose-400 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearHistoryBtn}</span>
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <p className="text-center text-xs text-gray-550 py-6 font-mono">{t.hasNoHistory}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {historyList.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleRestoreHistoryItem(item)}
                  className="bg-gray-950 border border-gray-850/60 rounded-xl p-3.5 flex flex-col justify-between transition hover:border-cyan-500/35 cursor-pointer active:scale-98 group"
                >
                  <div className="flex flex-row-reverse items-start gap-2.5 mb-2.5">
                    <img src={item.game.background_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-850" />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-gray-200 line-clamp-1 truncate block group-hover:text-cyan-400 transition">{item.game.name}</h4>
                      <span className="text-[9px] text-gray-500 uppercase block font-mono">{item.specs.deviceType.toUpperCase()} - {item.timestamp}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-[10px] flex-row-reverse">
                    <span className="text-gray-400">FPS: <strong className="text-indigo-400 font-mono">{item.result.estFps}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${item.result.overallScore >= 75 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/20" : item.result.overallScore >= 50 ? "bg-amber-950/40 text-amber-400 border border-amber-900/20" : "bg-red-950/40 text-rose-400 border border-red-900/20"}`}>
                      {item.result.overallScore}% MATCH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* OFFICIAL CHOSEN GAME SPECIFICATIONS SECTION */}
        {selectedGame && (
          <section className="bg-[#090d16]/30 border border-gray-850 rounded-2xl p-6 shadow-md text-right">
            <h3 className="text-xs font-bold text-gray-300 mb-4 tracking-wider uppercase flex items-center gap-1.5 flex-row-reverse">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{t.specsOfSelected} <strong className="text-cyan-400 font-sans">{selectedGame.name}</strong></span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Minimum spec detail block */}
              <div className="bg-gray-950/40 border border-gray-900/60 p-4 rounded-xl flex flex-col gap-2.5">
                <span className="text-[10px] font-mono text-yellow-500 font-bold tracking-widest block uppercase border-b border-gray-900 pb-1.5 text-right">{t.reqMin}</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">CPU</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.minimum_requirements?.cpu || "Intel Core i5-2500K"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">GPU</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.minimum_requirements?.gpu || "NVIDIA GTX 770"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">RAM</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.minimum_requirements?.ram || 8} GB RAM</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">FREE STORAGE NEEDED</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.minimum_requirements?.storage || 60} GB available</span>
                  </div>
                </div>
              </div>

              {/* Recommended spec detail block */}
              <div className="bg-gray-950/40 border border-gray-900/60 p-4 rounded-xl flex flex-col gap-2.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase border-b border-gray-900 pb-1.5 text-right">{t.reqRec}</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">CPU</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.recommended_requirements?.cpu || "Intel Core i7-4770K"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">GPU</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.recommended_requirements?.gpu || "NVIDIA GTX 1060"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">RAM</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.recommended_requirements?.ram || 12} GB RAM</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase font-mono">FREE STORAGE NEEDED</span>
                    <span className="text-gray-300 block leading-tight font-medium">{selectedGame.recommended_requirements?.storage || 60} GB available</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-gray-850/60 bg-[#04060c] py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row-reverse items-center justify-between gap-4 text-xs text-gray-500">
          <p dir="ltr">© {new Date().getFullYear()} Game Hardware Compatibility Analyzer. Powered by RAWG Global API.</p>
          <div className="flex gap-4">
            <span className="font-mono text-cyan-500 hover:text-cyan-400 transition">PWA STATUS: {pwaStatus || "Offline Cache Enabled"}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
