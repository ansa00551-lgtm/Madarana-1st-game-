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
  AlertTriangle, 
  XCircle, 
  Info, 
  Activity, 
  Languages, 
  Sliders, 
  Layers, 
  ChevronRight, 
  Gauge, 
  Flame, 
  Download, 
  History, 
  RotateCcw, 
  ExternalLink 
} from "lucide-react";
import { UAParser } from "ua-parser-js";

import { Game, SystemSpecs, AnalysisResult } from "./types";
import { 
  CONSOLE_BRANDS, 
  CONSOLE_MODELS, 
  HANDHELD_BRANDS, 
  HANDHELD_MODELS, 
  IPHONE_MODELS,
  MAC_MODELS, 
  POPULAR_FALLBACK_GAMES 
} from "./data";

const LOCAL_STORAGE_SPECS_KEY = "gaming_spec_analyzer_specs_v3";
const LOCAL_STORAGE_HISTORY_KEY = "gaming_spec_analyzer_history_v3";

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
    handheldMode: "جهاز ألعاب محمول",
    mobileMode: "هاتف ذكي / لوحي",
    cpu: "المعالج (CPU)",
    gpu: "كرت الشاشة (GPU)",
    ram: "الذاكرة العشوائية (RAM)",
    vram: "ذاكرة الشاشة (VRAM)",
    ramSpeed: "سرعة الرام MHZ",
    overclock: "وضع كسر السرعة (Overclock Mode)",
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
    estFps: "معدل الإطارات المتوقع بالثانية",
    resolution: "الدقة المقترحة وجودة العرض",
    bottleneck: "موقع عنق الزجاجة (Bottleneck)",
    verdict: "تقرير ملاءمة التشغيل العام",
    aiBtn: "🧠 تشغيل تحليل الذكاء الاصطناعي السحابي العميق (Gemini Cloud Scan)",
    aiAnalyzing: "جاري ربط العتاد واستقصاء خوادم جيميناي...",
    aiFullAnalysis: "توليد فحص متطور بواسطة Gemini AI",
    compatibilitySummary: "📝 ملخص أداء النظام العام",
    optimalSettings: "🔧 إعدادات الرسوم المثالية للتجربة",
    detailedMetrics: "📊 تفاصيل معالجة العتاد وعنق الزجاجة",
    overallScore: "معدل تشغيل اللعبة المتوقع",
    specsOfSelected: "المتطلبات الرسمية للعبة المختارة:",
    genre: "التصنيف",
    released: "تاريخ الإصدار",
    reqMin: "مواصفات التشغيل الصغرى للعبة (Minimum)",
    reqRec: "المواصفات الموصى بها للعبة (Recommended)",
    historyTitle: "الألعاب المفحوصة مؤخراً (Offline History)",
    hasNoHistory: "لا توجد ألعاب مفحوصة مؤخراً بالذاكرة المحلية.",
    clearHistoryBtn: "مسح السجل",
    installBtnText: "تثبيت كتحميل تطبيق مستقل (PWA)",
    autoScanBtn: "مسح تلقائي ذكي للعتاد ⚡ (Smart Auto-Scan)",
    autoScanRunning: "جاري فحص خيوط المعالج ومنافذ الرسوميات وWebGL 2.0...",
    autoScanSuccess: "اكتمل المسح التلقائي وتعبئة القطع بنجاح!",
    pcCategoryLabel: "بيئة تشغيل الكمبيوتر",
    customPcOpt: "نظام مستقل (Windows / Linux)",
    appleMacOpt: "أنظمة آبل ماكنتوش مسبقة الإعداد (macOS)",
    pcSubTypeLabel: "نوع تصميم الحاسوب",
    desktopSubType: "كمبيوتر مكتبي قياسي (Desktop)",
    laptopSubType: "كمبيوتر محمول (Laptop/Notebook)",
    motherboardLabel: "اسم لوحة أم التجميعة (Motherboard Model)",
    motherboardPlaceholder: "مثال: ASUS ROG STRIX B650 / MSI Tomahawk",
    laptopModelLabel: "الموديل التجاري للابتوب (Laptop Model Name)",
    laptopModelPlaceholder: "مثال: Lenovo Legion 5 / ASUS ROG Zephyrus G14",
    mobilePlatformLabel: "بيئة تشغيل الجوال",
    appleIosOpt: "أجهزة أبل المحمولة (iOS iPhone)",
    androidOpt: "أندرويد والمنصات الأخرى",
    appleFamilyLabel: "فئة الجهاز",
    appleGenLabel: "الجيل وسلسلة السيليكون (Generation)",
    appleTierLabel: "الموديل ومستوى المعالجة (Tier)",
    validationError: "فشل فحص العتاد! يرجى إدخال أسماء حقيقية للقطع (مثال: Intel i5, Core i7, Ryzen 5 للمعالج، أو GTX 1060, RTX 3060, Radeon RX لكرت الشاشة).",
    motherboardError: "برجاء إدخال اسم لوحة أم صحيح (مثال: ASUS, Gigabyte, MSI)",
    laptopError: "برجاء إدخال موديل لابتوب صحيح (مثال: Lenovo Legion, HP Omen, ASUS ROG...)",
    cpuValErrorShort: "اسم المعالج قصير للغاية!",
    cpuValErrorBrand: "الرجاء إدخال معالج حقيقي (Intel, AMD, Ryzen...)",
    gpuValErrorShort: "اسم كرت الشاشة قصير للغاية!",
    gpuValErrorBrand: "الرجاء إدخال كرت شاشة حقيقي معروف (NVIDIA, GeForce, RTX, RX Radeon, Intel Arc...)",
    ramInsufficient: "ذاكرة رام النظام (RAM) غير كافية",
    gpuBound: "كرت الشاشة الرسومي يعيق الأداء (GPU Bound)",
    cpuBound: "المعالج المركزي يعيق سرعة الإطارات (CPU Bound)",
    slowStorage: "القرص الصلب البطيء تسبب ببطء التحميل",
    verdictSuper: "✔ مهارة فائقة! تشغيل رائع ومعدل رندرة فائق التفاصيل",
    verdictSmooth: "✔ تشغيل سلس ومستقر بمستوى إطارات مقنع للغاية",
    verdictMedium: "⚠ تجربة متوسطة أو منخفضة، يرجى خفض جودة الظلال والإكساء",
    verdictLow: "✘ دون متمتطلبات التشغيل الدُنيا. خلل وتجميد وتوقف مفاجئ متوقع",
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
    smartphoneNamePlaceholder: "مثال: Galaxy S24 Ultra, Xiaomi 14 Ultra",
    smartphoneCpuPlaceholder: "Snapdragon 8 Gen 3 أو Tensor G4",
    smartphoneGpuPlaceholder: "Adreno 750 أو AMD Xclipse 940",
    cpuPlaceholder: "مثال: Intel Core i5-12600K / Ryzen 5 5600X",
    gpuPlaceholder: "مثال: NVIDIA RTX 3060 / Radeon RX 6700XT"
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
    estFps: "Predicted Average Framerate",
    resolution: "Recommended Target Settings",
    bottleneck: "Expected Bottleneck Element",
    verdict: "General Performance Verdict",
    aiBtn: "🧠 RUN CLOUD AI COMPATIBILITY SCAN (Gemini AI)",
    aiAnalyzing: "Connecting to secure Gemini cloud nodes...",
    aiFullAnalysis: "Generate Deep Gemini AI Review",
    compatibilitySummary: "📝 General System Performance Summary",
    optimalSettings: "🔧 Ideal Graphic Settings Suggestions",
    detailedMetrics: "📊 Deep Hardware Processing Analysis",
    overallScore: "System Playability Score",
    specsOfSelected: "Official Specifications Needed:",
    genre: "Genre",
    released: "Released",
    reqMin: "Minimum System Req",
    reqRec: "Recommended System Req",
    historyTitle: "Recently Scanned Games (Offline Cache)",
    hasNoHistory: "No recently analyzed games stored in offline cache.",
    clearHistoryBtn: "Clear History",
    installBtnText: "Install as Sandboxed Web App (PWA)",
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
    motherboardPlaceholder: "e.g., ASUS ROG STRIX B650 / MSI Tomahawk",
    laptopModelLabel: "Laptop Manufacturer Model Name",
    laptopModelPlaceholder: "e.g., Lenovo Legion 5 / ASUS ROG Zephyrus G14",
    mobilePlatformLabel: "Mobile Platform Environment",
    appleIosOpt: "Apple iOS Ecosystem (iPhone)",
    androidOpt: "Android & Independent Ecosystems",
    appleFamilyLabel: "Sub-Family Classification",
    appleGenLabel: "Processor Silicon Generation (Generation)",
    appleTierLabel: "Hardware Tier/Edition Selection (Tier)",
    validationError: "Hardware validation error! Please input real device/component names (e.g., Intel i5, Core i7, Ryzen 5 for CPU; NVIDIA GTX, RTX 3060, Radeon RX for GPU).",
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
    smartphoneNamePlaceholder: "e.g., Galaxy S24 Ultra, Xiaomi 14 Ultra",
    smartphoneCpuPlaceholder: "e.g., Snapdragon 8 Gen 3 or Tensor G4",
    smartphoneGpuPlaceholder: "e.g., Adreno 750 or AMD Xclipse 940",
    cpuPlaceholder: "e.g., Intel Core i5-12600K / Ryzen 5 5600X",
    gpuPlaceholder: "e.g., NVIDIA RTX 3060 / Radeon RX 6700XT"
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
  };
  result: AnalysisResult;
  timestamp: string;
  aiReport?: string;
}

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const t = translations[lang];

  // Game Selection States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearchingGames, setIsSearchingGames] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game>(POPULAR_FALLBACK_GAMES[0]);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  // Core selectors
  const [deviceType, setDeviceType] = useState<"desktop" | "console" | "handheld" | "mobile">("desktop");
  const [customCpu, setCustomCpu] = useState("Intel Core i5-12600K");
  const [customGpu, setCustomGpu] = useState("NVIDIA GeForce RTX 3060");
  const [cpuValError, setCpuValError] = useState("");
  const [gpuValError, setGpuValError] = useState("");

  const [ramGB, setRamGB] = useState(16);
  const [vramGB, setVramGB] = useState(8);
  const [storageGB, setStorageGB] = useState(256);
  const [ramSpeedMHz, setRamSpeedMHz] = useState(3200);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [storageType, setStorageType] = useState<string>("NVMe M.2 SSD (Gen 4)");
  const [osName, setOsName] = useState("Windows 11");
  const [ramGen, setRamGen] = useState<string>("DDR4");
  const [linuxDistro, setLinuxDistro] = useState("Ubuntu");
  const [androidScanWarning, setAndroidScanWarning] = useState(false);

  // PC Sub-groups
  const [pcCategory, setPcCategory] = useState<"custom" | "apple-mac">("custom");
  const [pcSubType, setPcSubType] = useState<"desktop" | "laptop">("desktop");
  const [motherboardModel, setMotherboardModel] = useState("ASUS PRIME B550M-A");
  const [motherboardError, setMotherboardError] = useState("");
  const [laptopModel, setLaptopModel] = useState("Lenovo Legion 5 15ACH6H");
  const [laptopError, setLaptopError] = useState("");

  const [mobileSubType, setMobileSubType] = useState<"android" | "apple-ios">("android");
  const [appleFamily, setAppleFamily] = useState<string>("apple_silicon");
  const [appleModel, setAppleModel] = useState<string>("MacBook Pro M3");
  const [iphoneModel, setIphoneModel] = useState<string>("iPhone 15 Pro Max");

  const [autoScanStatus, setAutoScanStatus] = useState<"idle" | "running" | "success">("idle");
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const [consoleBrand, setConsoleBrand] = useState("sony");
  const [consoleModel, setConsoleModel] = useState("PlayStation 5 (Base/Fat)");
  const [handheldBrand, setHandheldBrand] = useState("valve");
  const [handheldModel, setHandheldModel] = useState("Steam Deck OLED");

  const [phoneName, setPhoneName] = useState("Samsung Galaxy S24 Ultra");
  const [phoneCpu, setPhoneCpu] = useState("Snapdragon 8 Gen 3");
  const [phoneGpu, setPhoneGpu] = useState("Adreno 750");
  const [phoneRam, setPhoneRam] = useState(12);
  const [phoneStorage, setPhoneStorage] = useState(256);

  const [specs, setSpecs] = useState<SystemSpecs>({
    cpuName: "Intel Core i5-12600K",
    cpuScore: 7.2,
    gpuName: "NVIDIA GeForce RTX 3060",
    gpuScore: 7.3,
    ramGB: 16,
    vramGB: 8,
    storageGB: 150,
    isSSD: true,
    os: "Windows 11 64-bit"
  });

  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [deepAnalysisRaw, setDeepAnalysisRaw] = useState("");
  const [localAnalysis, setLocalAnalysis] = useState<AnalysisResult | null>(null);
  const [historyList, setHistoryList] = useState<CachedAnalysisItem[]>([]);

  // Setup simulated automatic scan function
  useEffect(() => {
    (window as any).smartHardwareScan = () => {
      const parser = new UAParser();
      const res = parser.getResult();
      const ua = navigator.userAgent.toLowerCase();
      
      let device: "desktop" | "mobile" | "console" | "handheld" = "desktop";
      let isApple = /ipad|iphone|macintosh|mac os x/.test(ua);
      let isAndroid = /android/.test(ua);

      if (/iphone|ipad/.test(ua) || res.device.type === "mobile" || res.device.type === "tablet") {
        device = "mobile";
      } else if (isAndroid) {
        device = "mobile";
      }

      const cores = navigator.hardwareConcurrency || 8;
      const detectedRam = (navigator as any).deviceMemory || (cores >= 12 ? 32 : 16);

      // Attempt real hardware unmasking using the WebGL debug renderer info extension
      let detectedGpu = "";
      try {
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as any;
        if (gl) {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            detectedGpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
          }
        }
      } catch (e) {
        console.warn("Unable to unmask WebGL GPU: ", e);
      }

      // Cleanup raw WebGL GPU string (e.g., removing ANGLE browser container layer / active driver details)
      let cleanGpu = "NVIDIA GeForce RTX 3070"; // Core default baseline inside the application
      if (detectedGpu) {
        let tempGpu = detectedGpu;
        // Strip ANGLE wrapper syntax: "ANGLE (vendor, GPU model, driver)"
        const angleMatch = tempGpu.match(/angle\s*\(\s*[^,]+,\s*([^,()]+(?:(?:\([^)]*\))?[^,()]*)*)/i);
        if (angleMatch && angleMatch[1]) {
          tempGpu = angleMatch[1];
        }
        tempGpu = tempGpu
          .replace(/direct3d\d*/gi, "")
          .replace(/vs_\d+_\d+\s+ps_\d+_\d+/gi, "")
          .replace(/(nvidia\s+corporation|advanced\s+micro\s+devices,\s+inc\.|intel\s+inc\.|apple\s+inc\.)/gi, "")
          .replace(/opengl\s*.*$/gi, "")
          .replace(/\s*,.*$/gi, "")
          .replace(/\s+/g, " ")
          .trim();
        
        if (tempGpu.length > 3) {
          cleanGpu = tempGpu;
        }
      }

      // Calculate approximate dedicated Video RAM (VRAM) size in GB based on GPU product numbers
      let estimatedVram = 8;
      const lowerGpu = cleanGpu.toLowerCase();
      if (lowerGpu.includes("4090") || lowerGpu.includes("3090")) estimatedVram = 24;
      else if (lowerGpu.includes("4080")) estimatedVram = 16;
      else if (lowerGpu.includes("4070 ti") || lowerGpu.includes("4070ti")) estimatedVram = 12;
      else if (lowerGpu.includes("4070")) estimatedVram = 12;
      else if (lowerGpu.includes("4060 ti") || lowerGpu.includes("4060ti")) estimatedVram = 8;
      else if (lowerGpu.includes("4060")) estimatedVram = 8;
      else if (lowerGpu.includes("3085") || lowerGpu.includes("3080") || lowerGpu.includes("7900")) estimatedVram = 16;
      else if (lowerGpu.includes("3070 ti") || lowerGpu.includes("3070") || lowerGpu.includes("6800") || lowerGpu.includes("7800")) estimatedVram = 8;
      else if (lowerGpu.includes("3060")) estimatedVram = 12;
      else if (lowerGpu.includes("2080") || lowerGpu.includes("2070") || lowerGpu.includes("5700") || lowerGpu.includes("6600")) estimatedVram = 8;
      else if (lowerGpu.includes("2060") || lowerGpu.includes("1060")) estimatedVram = 6;
      else if (lowerGpu.includes("intel") || lowerGpu.includes("uhd") || lowerGpu.includes("iris") || lowerGpu.includes("arc")) {
        estimatedVram = lowerGpu.includes("a770") ? 16 : lowerGpu.includes("a750") ? 8 : 4;
      }

      // Calculate highly realistic CPU baseline from actual physical thread cores count
      let cleanCpu = "Intel Core i7-12700K";
      if (cores >= 24) cleanCpu = "Intel Core i9-14900K";
      else if (cores >= 16) cleanCpu = "AMD Ryzen 9 7900X";
      else if (cores >= 12) cleanCpu = "Intel Core i7-13700K";
      else if (cores >= 8) cleanCpu = "Intel Core i5-12600K";
      else if (cores >= 6) cleanCpu = "AMD Ryzen 5 5600X";
      else cleanCpu = "Intel Core i3-10100";

      if (isApple) {
        if (/iphone|ipad/.test(ua)) {
          const modelString = res.device.model || "";
          const displayModel = modelString ? `iPhone ${modelString}` : "iPhone 15 Pro Max";
          return {
            deviceType: "mobile",
            mobileSubType: "apple-ios",
            pcCategory: "apple-mac",
            pcSubType: "laptop",
            cpuName: "Apple A17 Pro",
            gpuName: "Apple A17 Pro (Apple GPU)",
            ramGB: 8,
            vramGB: 3,
            storageGB: 256,
            storageType: "NVMe M.2 SSD (Gen 4)",
            motherboardModel: "",
            appleFamily: "iphone",
            appleModel: "MacBook Pro M3",
            iphoneModel: "iPhone 15 Pro Max",
            phoneName: displayModel,
            phoneCpu: "Apple A17 Pro",
            phoneGpu: "Apple A17 Pro (Apple GPU)",
            phoneRam: 8,
            phoneStorage: 256,
            requiresAndroidPrompt: false
          };
        } else {
          // macOS Computer detection mapping
          let macFam = "apple_silicon";
          let macModel = "MacBook Pro M3";
          
          const gpuLower = cleanGpu.toLowerCase();
          if (gpuLower.includes("intel")) {
            macFam = "intel_legacy";
            macModel = cores >= 8 ? "MacBook Pro 16\" (Intel Core i9)" : "MacBook Pro 13\" (Intel Core i5)";
          } else if (gpuLower.includes("powerpc") || gpuLower.includes("g5") || gpuLower.includes("g4") || gpuLower.includes("g3")) {
            macFam = "powerpc_legacy";
            macModel = "Power Mac G5";
          } else {
            macFam = "apple_silicon";
            if (cores >= 16) macModel = "MacBook Pro M3 Max";
            else if (cores >= 12) macModel = "MacBook Pro M3 Pro";
            else if (cores >= 10) macModel = "MacBook Pro M4";
            else if (cores >= 8) macModel = "MacBook Pro M3";
            else macModel = "MacBook Air M1";
          }

          return {
            deviceType: "desktop",
            mobileSubType: "android",
            pcCategory: "apple-mac",
            pcSubType: "laptop",
            cpuName: macModel,
            gpuName: cleanGpu.includes("Apple") ? `${macModel} GPU` : cleanGpu,
            ramGB: detectedRam,
            vramGB: estimatedVram,
            storageGB: detectedRam >= 16 ? 512 : 256,
            storageType: "NVMe M.2 SSD (Gen 4)",
            motherboardModel: "",
            appleFamily: macFam,
            appleModel: macModel,
            iphoneModel: "iPhone 15 Pro Max",
            phoneName: "",
            phoneCpu: "",
            phoneGpu: "",
            phoneRam: detectedRam,
            phoneStorage: 256,
            requiresAndroidPrompt: false
          };
        }
      }

      if (isAndroid) {
        const vendor = res.device.vendor || "Samsung";
        const model = res.device.model || "Galaxy S24 Ultra";
        return {
          deviceType: "mobile",
          mobileSubType: "android",
          pcCategory: "custom",
          pcSubType: "desktop",
          cpuName: "Octa-core ARM Processor",
          gpuName: "ARM Mali / Adreno Graphics",
          ramGB: detectedRam,
          vramGB: Math.round(detectedRam * 0.4),
          storageGB: 256,
          storageType: "SATA SSD",
          motherboardModel: "",
          appleFamily: "",
          appleModel: "",
          iphoneModel: "",
          phoneName: `${vendor} ${model}`,
          phoneCpu: "Snapdragon 8 Gen 3",
          phoneGpu: "Adreno 750",
          phoneRam: detectedRam > 16 ? 12 : detectedRam,
          phoneStorage: 256,
          requiresAndroidPrompt: true
        };
      }

      return {
        deviceType: device,
        mobileSubType: "android",
        pcCategory: "custom",
        pcSubType: "desktop",
        cpuName: cleanCpu,
        gpuName: cleanGpu,
        ramGB: detectedRam,
        vramGB: estimatedVram,
        storageGB: detectedRam >= 32 ? 1024 : 512,
        storageType: "NVMe M.2 SSD (Gen 4)",
        motherboardModel: "ASUSTeK COMPUTER INC. PRIME Z790-P",
        appleFamily: "apple_silicon",
        appleModel: "MacBook Pro M3",
        iphoneModel: "iPhone 15 Pro Max",
        phoneName: "Samsung Galaxy S24 Ultra",
        phoneCpu: "Snapdragon 8 Gen 3",
        phoneGpu: "Adreno 750",
        phoneRam: 12,
        phoneStorage: 256,
        requiresAndroidPrompt: false
      };
    };
  }, []);

  // Fetch trending games from backend API
  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("/api/trending");
        if (res.ok) {
          const data = await res.json();
          if (data && data.results && data.results.length > 0) {
            const parsed = data.results.slice(0, 6).map((g: any) => ({
              id: String(g.id),
              name: g.name,
              slug: g.slug,
              background_image: g.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
              released: g.released || "2023",
              genres: g.genres || [],
              minimum_requirements: g.minimum_requirements || { cpu: "Intel Core i5-4460", gpu: "NVIDIA GTX 760", ram: 8, storage: 60 },
              recommended_requirements: g.recommended_requirements || { cpu: "Intel Core i7-4790K", gpu: "NVIDIA GTX 1060", ram: 12, storage: 60 }
            }));
            setTrendingGames(parsed);
            setSelectedGame(parsed[0]);
          } else {
            setTrendingGames(POPULAR_FALLBACK_GAMES);
          }
        } else {
          setTrendingGames(POPULAR_FALLBACK_GAMES);
        }
      } catch {
        setTrendingGames(POPULAR_FALLBACK_GAMES);
      }
    }
    loadGames();
  }, []);

  // Debounced live search utilizing /api/analyze to bypass custom file missing queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchingGames(true);
    const delay = setTimeout(async () => {
      try {
        // We use /api/analyze as the single unified full-stack file router
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "search_game", gameName: searchQuery })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.results) {
            const parsed = data.results.slice(0, 10).map((g: any) => ({
              id: String(g.id),
              name: g.name,
              slug: g.slug,
              background_image: g.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
              released: g.released || "2023",
              genres: g.genres || [],
              minimum_requirements: g.minimum_requirements || { cpu: "Intel Core i5-4460", gpu: "NVIDIA GTX 760", ram: 8, storage: 60 },
              recommended_requirements: g.recommended_requirements || { cpu: "Intel Core i7-4790K", gpu: "NVIDIA GTX 1060", ram: 12, storage: 60 }
            }));
            setSearchResults(parsed);
          }
        }
      } catch (err) {
        console.error("Game search error:", err);
      } finally {
        setIsSearchingGames(false);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Sync state values dynamically to computed System Specs
  useEffect(() => {
    if (deviceType === "desktop") {
      if (pcCategory === "apple-mac") {
        const modelLower = appleModel.toLowerCase();
        let cpuName = appleModel;
        let cpuScore = 5.0;
        let gpuName = appleModel + " Graphics";
        let gpuScore = 4.8;
        let derivedRamGB = 8;
        let derivedVramGB = 1;

        if (modelLower.includes("m4")) {
          cpuScore = 9.4;
          gpuScore = 9.2;
          derivedRamGB = 16;
          derivedVramGB = 8;
        } else if (modelLower.includes("m3 pro") || modelLower.includes("m3 max")) {
          cpuScore = 8.8;
          gpuScore = 8.5;
          derivedRamGB = 16;
          derivedVramGB = 8;
        } else if (modelLower.includes("m3")) {
          cpuScore = 8.2;
          gpuScore = 7.8;
          derivedRamGB = 8;
          derivedVramGB = 4;
        } else if (modelLower.includes("m2").valueOf() && modelLower.includes("ultra")) {
          cpuScore = 9.8;
          gpuScore = 9.8;
          derivedRamGB = 64;
          derivedVramGB = 32;
        } else if (modelLower.includes("m2 max") || modelLower.includes("m2 studio")) {
          cpuScore = 9.0;
          gpuScore = 9.0;
          derivedRamGB = 32;
          derivedVramGB = 16;
        } else if (modelLower.includes("m2 pro")) {
          cpuScore = 8.2;
          gpuScore = 8.0;
          derivedRamGB = 16;
          derivedVramGB = 8;
        } else if (modelLower.includes("m2")) {
          cpuScore = 7.8;
          gpuScore = 7.2;
          derivedRamGB = 8;
          derivedVramGB = 4;
        } else if (modelLower.includes("m1 pro") || modelLower.includes("m1 max")) {
          cpuScore = 7.8;
          gpuScore = 7.4;
          derivedRamGB = 16;
          derivedVramGB = 6;
        } else if (modelLower.includes("m1")) {
          cpuScore = 7.2;
          gpuScore = 6.8;
          derivedRamGB = 8;
          derivedVramGB = 4;
        } else if (modelLower.includes("intel core i9")) {
          cpuScore = 7.0;
          gpuScore = 6.8;
          derivedRamGB = 32;
          derivedVramGB = 8;
        } else if (modelLower.includes("intel core i7")) {
          cpuScore = 6.2;
          gpuScore = 6.0;
          derivedRamGB = 16;
          derivedVramGB = 4;
        } else if (modelLower.includes("intel core i5")) {
          cpuScore = 5.4;
          gpuScore = 5.2;
          derivedRamGB = 8;
          derivedVramGB = 2;
        } else if (modelLower.includes("intel") || modelLower.includes("xeon")) {
          cpuScore = 5.8;
          gpuScore = 5.6;
          derivedRamGB = 16;
          derivedVramGB = 4;
        } else if (modelLower.includes("g5")) {
          cpuScore = 2.5;
          gpuScore = 2.2;
          derivedRamGB = 1;
          derivedVramGB = 0.128;
        } else if (modelLower.includes("g4") || modelLower.includes("emac")) {
          cpuScore = 1.6;
          gpuScore = 1.3;
          derivedRamGB = 0.512;
          derivedVramGB = 0.032;
        } else if (modelLower.includes("g3")) {
          cpuScore = 1.0;
          gpuScore = 0.8;
          derivedRamGB = 0.256;
          derivedVramGB = 0.008;
        }

        setSpecs({
          cpuName,
          cpuScore,
          gpuName,
          gpuScore,
          ramGB: derivedRamGB,
          vramGB: derivedVramGB,
          storageGB,
          isSSD: !modelLower.includes("g3") && !modelLower.includes("g4") && !modelLower.includes("g5") && !modelLower.includes("emac"),
          os: appleFamily === "apple_silicon"
            ? "macOS Sequoia"
            : appleFamily === "intel_legacy"
            ? "macOS Monterey / Ventura"
            : "Mac OS 9 / Classic Mac OS X"
        });
      } else {
        const { cpuScore, gpuScore, defaultVram } = estimateHardwareScores(customCpu, customGpu);
        const derivedOS = osName === "Linux" ? `Linux (${linuxDistro})` : osName;
        setSpecs({
          cpuName: customCpu,
          cpuScore,
          gpuName: customGpu,
          gpuScore,
          ramGB,
          vramGB: Math.max(vramGB, defaultVram),
          storageGB,
          isSSD: storageType.toLowerCase().includes("ssd") || storageType.toLowerCase().includes("flash") || storageType.toLowerCase().includes("ufs"),
          os: derivedOS
        });
      }
    } else if (deviceType === "console") {
      const name = consoleModel;
      const lower = name.toLowerCase();
      let cpuName = "Console Processor";
      let cpuScore = 5.0;
      let gpuName = "Console Graphics";
      let gpuScore = 5.0;
      let ram = 16;
      let vram = 8;
      let storage = 1000;
      let isSSD = false;

      if (lower.includes("playstation 5 pro")) {
        cpuName = "Custom AMD Zen 2 @ 3.85 GHz";
        cpuScore = 8.5;
        gpuName = "Custom RDNA 3/4 (16.7 TFLOPS)";
        gpuScore = 9.0;
        ram = 16; vram = 18; storage = 2000; isSSD = true;
      } else if (lower.includes("playstation 5")) {
        cpuName = "Custom AMD Zen 2 (8-core)";
        cpuScore = 7.8;
        gpuName = "Custom RDNA 2 (10.28 TFLOPS)";
        gpuScore = 8.0;
        ram = 16; vram = 16; storage = 825; isSSD = true;
      } else if (lower.includes("playstation 4 pro")) {
        cpuName = "Semi-custom AMD Jaguar @ 2.13 GHz";
        cpuScore = 6.2;
        gpuName = "AMD GCN (4.2 TFLOPS)";
        gpuScore = 6.8;
        ram = 8; vram = 8; storage = 1000;
      } else if (lower.includes("playstation 4")) {
        cpuName = "Semi-custom AMD Jaguar (8 cores)";
        cpuScore = 5.5;
        gpuName = "AMD GCN @ 1.84 TFLOPS";
        gpuScore = 5.5;
        ram = 8; vram = 8; storage = 1000;
      } else if (lower.includes("playstation 3")) {
        cpuName = "Cell Broadband Engine @ 3.2 GHz";
        cpuScore = 4.2;
        gpuName = "NVIDIA RSX Reality Synthesizer";
        gpuScore = 4.0;
        ram = 0.256; vram = 0.256; storage = 500;
      } else if (lower.includes("playstation 2")) {
        cpuName = "Emotion Engine @ 294 MHz";
        cpuScore = 1.2;
        gpuName = "Graphics Synthesizer";
        gpuScore = 1.2;
        ram = 0.032; vram = 0.004; storage = 40;
      } else if (lower.includes("playstation 1") || lower.includes("ps one")) {
        cpuName = "MIPS R3000A";
        cpuScore = 0.5;
        gpuName = "Sony GPU (3D geometry)";
        gpuScore = 0.5;
        ram = 0.002; vram = 0.001; storage = 0.001;
      } else if (lower.includes("xbox series x")) {
        cpuName = "Custom AMD Zen 2 (8 Cores @ 3.8 GHz)";
        cpuScore = 8.0;
        gpuName = "Custom RDNA 2 (12 TFLOPS)";
        gpuScore = 8.2;
        ram = 16; vram = 16; storage = 1000; isSSD = true;
      } else if (lower.includes("xbox series s")) {
        cpuName = "Custom AMD Zen 2 (8 Cores @ 3.6 GHz)";
        cpuScore = 7.5;
        gpuName = "Custom RDNA 2 (4 TFLOPS)";
        gpuScore = 6.2;
        ram = 10; vram = 10; storage = 512; isSSD = true;
      } else if (lower.includes("xbox one x")) {
        cpuName = "Custom AMD Jaguar (8 Cores @ 2.3 GHz)";
        cpuScore = 6.5;
        gpuName = "AMD Scorpio GPU @ 6 TFLOPS";
        gpuScore = 7.0;
        ram = 12; vram = 12; storage = 1000;
      } else if (lower.includes("xbox one s") || lower.includes("xbox one s all-digital")) {
        cpuName = "AMD Jaguar (8 Cores @ 1.75 GHz)";
        cpuScore = 5.3;
        gpuName = "AMD Durango GPU @ 1.4 TFLOPS";
        gpuScore = 5.2;
        ram = 8; vram = 8; storage = 1000;
      } else if (lower.includes("xbox one")) {
        cpuName = "AMD Jaguar (8 Cores @ 1.75 GHz)";
        cpuScore = 5.2;
        gpuName = "AMD Durango GPU @ 1.31 TFLOPS";
        gpuScore = 5.0;
        ram = 8; vram = 8; storage = 500;
      } else if (lower.includes("xbox 360")) {
        cpuName = "IBM Xenon (3 cores @ 3.2 GHz)";
        cpuScore = 3.8;
        gpuName = "ATI Xenos @ 500 MHz";
        gpuScore = 3.8;
        ram = 0.5; vram = 0.5; storage = 250;
      } else if (lower.includes("xbox (original)")) {
        cpuName = "Intel Mobile Celeron @ 733 MHz";
        cpuScore = 1.0;
        gpuName = "NVIDIA NV2A";
        gpuScore = 1.0;
        ram = 0.064; vram = 0.064; storage = 8;
      } else if (lower.includes("switch oled") || lower.includes("switch (v1)") || lower.includes("switch (v2)")) {
        cpuName = "NVIDIA Tegra X1 Mariko";
        cpuScore = 5.1;
        gpuName = "NVIDIA Maxwell (256 Cores)";
        gpuScore = 5.1;
        ram = 4; vram = 4; storage = 64;
      } else if (lower.includes("wii u")) {
        cpuName = "IBM 'Espresso' (3-core)";
        cpuScore = 4.0;
        gpuName = "AMD Radeon 'Latte'";
        gpuScore = 4.2;
        ram = 2; vram = 1; storage = 32;
      } else if (lower.includes("wii")) {
        cpuName = "IBM PowerPC 'Broadway'";
        cpuScore = 2.2;
        gpuName = "ATI 'Hollywood'";
        gpuScore = 2.2;
        ram = 0.088; vram = 0.024; storage = 0.5;
      } else if (lower.includes("gamecube")) {
        cpuName = "IBM PowerPC 'Gekko'";
        cpuScore = 1.8;
        gpuName = "ATI 'Flipper'";
        gpuScore = 1.8;
        ram = 0.043; vram = 0.016; storage = 0.016;
      } else if (lower.includes("nintendo 64")) {
        cpuName = "NEC VR4300";
        cpuScore = 1.0;
        gpuName = "SGI Reality Coprocessor";
        gpuScore = 1.0;
        ram = 0.004; vram = 0.004; storage = 0.064;
      } else if (lower.includes("snes")) {
        cpuName = "Ricoh 5A22";
        cpuScore = 0.4;
        gpuName = "S-PPU1 & S-PPU2";
        gpuScore = 0.4;
        ram = 0.000128; vram = 0.000064; storage = 0.004;
      } else if (lower.includes("nes")) {
        cpuName = "Ricoh 2A03 (NMOS)";
        cpuScore = 0.2;
        gpuName = "Nintendo PPU";
        gpuScore = 0.2;
        ram = 0.000002; vram = 0.000002; storage = 0.0005;
      } else if (lower.includes("dreamcast")) {
        cpuName = "Hitachi SH-4 @ 200 MHz";
        cpuScore = 3.2;
        gpuName = "NEC PowerVR2 CLX2 @ 100 MHz";
        gpuScore = 3.2;
        ram = 0.016; vram = 0.008; storage = 0.002;
      } else if (lower.includes("saturn")) {
        cpuName = "Hitachi SH-2 (2 Cores @ 28.6 MHz)";
        cpuScore = 2.2;
        gpuName = "VDP1 & VDP2";
        gpuScore = 2.2;
        ram = 0.002; vram = 0.0015; storage = 0.002;
      } else if (lower.includes("genesis") || lower.includes("nomad")) {
        cpuName = "Motorola 68000 @ 7.67 MHz";
        cpuScore = 0.8;
        gpuName = "Sega VDP";
        gpuScore = 0.8;
        ram = 0.000064; vram = 0.000064; storage = 0.004;
      } else if (lower.includes("sega cd")) {
        cpuName = "Motorola 68000 @ 12.5 MHz";
        cpuScore = 1.0;
        gpuName = "Sega CD ASIC custom scaler";
        gpuScore = 1.0;
        ram = 0.000512; vram = 0.000256; storage = 0.001;
      } else if (lower.includes("32x")) {
        cpuName = "Hitachi SH-2 @ 23 MHz";
        cpuScore = 1.4;
        gpuName = "Sega 32X Custom 3D engine";
        gpuScore = 1.4;
        ram = 0.000256; vram = 0.000256; storage = 0.004;
      } else if (lower.includes("jaguar cd")) {
        cpuName = "Motorola 68000 Tom @ 26.59 MHz";
        cpuScore = 1.8;
        gpuName = "Tom graphics Engine";
        gpuScore = 1.8;
        ram = 0.002; vram = 0.002; storage = 0.790;
      } else if (lower.includes("jaguar")) {
        cpuName = "Motorola 68000 / Tom / Jerry";
        cpuScore = 1.8;
        gpuName = "Tom Graphics @ 26.59 MHz";
        gpuScore = 1.8;
        ram = 0.002; vram = 0.002; storage = 0.006;
      } else if (lower.includes("atari 7800")) {
        cpuName = "Atari SALLY 6502";
        cpuScore = 0.3;
        gpuName = "Atari MARIA Custom";
        gpuScore = 0.3;
        ram = 0.000004; vram = 0.000004; storage = 0.000048;
      } else if (lower.includes("atari 5200")) {
        cpuName = "MOS Technology 6502C";
        cpuScore = 0.2;
        gpuName = "ANTIC & GTIA";
        gpuScore = 0.2;
        ram = 0.000016; vram = 0.000016; storage = 0.000032;
      } else if (lower.includes("atari 2600")) {
        cpuName = "MOS Technology 6507";
        cpuScore = 0.1;
        gpuName = "TIA Custom chip";
        gpuScore = 0.1;
        ram = 0.000000128; vram = 0.000000128; storage = 0.000004;
      } else {
        cpuName = "Processor " + name;
        cpuScore = 1.5;
        gpuName = "Graphics " + name;
        gpuScore = 1.5;
        ram = 0.016; vram = 0.016; storage = 4;
      }

      setSpecs({
        cpuName,
        cpuScore,
        gpuName,
        gpuScore,
        ramGB: ram,
        vramGB: vram,
        storageGB: storage,
        isSSD,
        os: `${consoleBrand.toUpperCase()} OS`
      });
    } else if (deviceType === "handheld") {
      const name = handheldModel;
      const lower = name.toLowerCase();
      let cpuName = "Handheld APU";
      let cpuScore = 5.0;
      let gpuName = "Handheld GPU";
      let gpuScore = 5.0;
      let ram = 16;
      let vram = 4;
      let storage = 512;
      let isSSD = true;

      if (lower.includes("steam deck oled")) {
        cpuName = "AMD Sephiroth (6nm Zen 2)";
        cpuScore = 6.0;
        gpuName = "AMD RDNA 2 Custom (8 CUs)";
        gpuScore = 5.5;
        ram = 16; vram = 16; storage = 512;
      } else if (lower.includes("steam deck lcd")) {
        cpuName = "AMD Aerith (7nm Zen 2)";
        cpuScore = 5.5;
        gpuName = "AMD RDNA 2 Custom (8 CUs)";
        gpuScore = 5.1;
        ram = 16; vram = 16; storage = 256;
      } else if (lower.includes("rog ally (z1 extreme)") || lower.includes("legion go")) {
        cpuName = "AMD Ryzen Z1 Extreme";
        cpuScore = 7.2;
        gpuName = "AMD Radeon 780M";
        gpuScore = 6.8;
        ram = 16; vram = 16; storage = 512;
      } else if (lower.includes("rog ally (z1 non-extreme)")) {
        cpuName = "AMD Ryzen Z1 (6-core)";
        cpuScore = 6.5;
        gpuName = "AMD Radeon 740M";
        gpuScore = 5.8;
        ram = 16; vram = 16; storage = 512;
      } else if (lower.includes("psp-1000")) {
        cpuName = "MIPS R4000 @ 333 MHz";
        cpuScore = 1.5;
        gpuName = "Sony Custom GPU @ 166 MHz";
        gpuScore = 1.5;
        ram = 0.032; vram = 0.002; storage = 0.032; isSSD = false;
      } else if (lower.includes("psp-2000") || lower.includes("psp-3000") || lower.includes("psp go") || lower.includes("psp street")) {
        cpuName = "MIPS R4000 @ 333 MHz";
        cpuScore = 1.6;
        gpuName = "Sony Custom GPU";
        gpuScore = 1.6;
        ram = 0.064; vram = 0.002; storage = 16; isSSD = false;
      } else if (lower.includes("vita 1000")) {
        cpuName = "ARM Cortex-A9 MPCore @ 444 MHz";
        cpuScore = 3.0;
        gpuName = "PowerVR SGX543MP4+";
        gpuScore = 3.0;
        ram = 0.512; vram = 0.128; storage = 4; isSSD = false;
      } else if (lower.includes("vita 2000")) {
        cpuName = "ARM Cortex-A9 MPCore @ 444 MHz";
        cpuScore = 3.0;
        gpuName = "PowerVR SGX543MP4+";
        gpuScore = 3.0;
        ram = 0.512; vram = 0.128; storage = 1; isSSD = false;
      } else if (lower.includes("playstation portal")) {
        cpuName = "Snapdragon 662 Octa-Core";
        cpuScore = 4.8;
        gpuName = "Qualcomm Adreno 610";
        gpuScore = 4.5;
        ram = 6; vram = 2; storage = 16;
      } else if (lower.includes("game boy color")) {
        cpuName = "Sharp LR35902 @ 8.38 MHz";
        cpuScore = 0.4;
        gpuName = "Nintendo Color Graphics";
        gpuScore = 0.4;
        ram = 0.000032; vram = 0.000016; storage = 0.001; isSSD = false;
      } else if (lower.includes("game boy advance") || lower.includes("gba")) {
        cpuName = "ARM7TDMI @ 16.78 MHz";
        cpuScore = 0.8;
        gpuName = "Custom 2D Graphics Hardware";
        gpuScore = 0.8;
        ram = 0.000288; vram = 0.000096; storage = 0.004; isSSD = false;
      } else if (lower.includes("game boy") || lower.includes("pocket") || lower.includes("light")) {
        cpuName = "Sharp LR35902 @ 4.19 MHz";
        cpuScore = 0.2;
        gpuName = "Nintendo LCD Custom";
        gpuScore = 0.2;
        ram = 0.000008; vram = 0.000008; storage = 0.000256; isSSD = false;
      } else if (lower.includes("nintendo ds lite") || lower.includes("nintendo ds")) {
        cpuName = "ARM946E-S @ 67 MHz";
        cpuScore = 1.4;
        gpuName = "Custom 3D Rasterizer";
        gpuScore = 1.4;
        ram = 0.004; vram = 0.000656; storage = 0.256; isSSD = false;
      } else if (lower.includes("dsi")) {
        cpuName = "ARM9 @ 133 MHz";
        cpuScore = 1.8;
        gpuName = "Custom 2D/3D hardware";
        gpuScore = 1.8;
        ram = 0.016; vram = 0.001; storage = 0.256; isSSD = false;
      } else if (lower.includes("3ds max") || lower.includes("3ds xl") || lower.includes("3ds") || lower.includes("2ds")) {
        cpuName = "ARM11 Dual-Core @ 268 MHz";
        cpuScore = 2.8;
        gpuName = "DMP PICA200 @ 200 MHz";
        gpuScore = 2.8;
        ram = 0.128; vram = 0.006; storage = 4; isSSD = false;
      } else if (lower.includes("new nintendo 3ds") || lower.includes("new nintendo 2ds")) {
        cpuName = "ARM11 Quad-Core @ 804 MHz";
        cpuScore = 3.5;
        gpuName = "DMP PICA200";
        gpuScore = 3.5;
        ram = 0.256; vram = 0.010; storage = 4; isSSD = false;
      } else if (lower.includes("switch lite")) {
        cpuName = "NVIDIA Tegra X1 Mariko";
        cpuScore = 5.0;
        gpuName = "NVIDIA Maxwell GPU";
        gpuScore = 5.0;
        ram = 4; vram = 4; storage = 32;
      } else {
        cpuName = "Processor " + name;
        cpuScore = 3.0;
        gpuName = "GPU " + name;
        gpuScore = 3.0;
        ram = 1; vram = 1; storage = 16;
      }

      setSpecs({
        cpuName,
        cpuScore,
        gpuName,
        gpuScore,
        ramGB: ram,
        vramGB: vram,
        storageGB: storage,
        isSSD,
        os: `${handheldBrand.toUpperCase()} OS`
      });
    } else if (deviceType === "mobile") {
      if (mobileSubType === "apple-ios") {
        const name = iphoneModel;
        const lower = name.toLowerCase();
        let cpuName = "Apple A-Series";
        let cpuScore = 5.0;
        let gpuName = "Apple Graphics";
        let gpuScore = 5.0;
        let ram = 4;
        let vram = 1;

        if (lower.includes("iphone 17 pro max") || lower.includes("iphone 17 pro")) {
          cpuName = "Apple A19 Pro";
          cpuScore = 10.0;
          gpuName = "Apple GPU @ A19 Pro";
          gpuScore = 10.0;
          ram = 12; vram = 6;
        } else if (lower.includes("iphone 17")) {
          cpuName = "Apple A19";
          cpuScore = 9.6;
          gpuName = "Apple GPU @ A19";
          gpuScore = 9.4;
          ram = 8; vram = 4;
        } else if (lower.includes("iphone 16 pro max") || lower.includes("iphone 16 pro")) {
          cpuName = "Apple A18 Pro";
          cpuScore = 9.6;
          gpuName = "Apple GPU @ A18 Pro";
          gpuScore = 9.6;
          ram = 8; vram = 4;
        } else if (lower.includes("iphone 16")) {
          cpuName = "Apple A18";
          cpuScore = 9.2;
          gpuName = "Apple GPU @ A18";
          gpuScore = 8.9;
          ram = 8; vram = 3;
        } else if (lower.includes("iphone 15 pro max") || lower.includes("iphone 15 pro")) {
          cpuName = "Apple A17 Pro";
          cpuScore = 9.1;
          gpuName = "Apple GPU @ A17 Pro";
          gpuScore = 9.1;
          ram = 8; vram = 3;
        } else if (lower.includes("iphone 15")) {
          cpuName = "Apple A16 Bionic";
          cpuScore = 8.5;
          gpuName = "Apple GPU @ A16";
          gpuScore = 8.3;
          ram = 6; vram = 2;
        } else if (lower.includes("iphone 14 pro max") || lower.includes("iphone 14 pro")) {
          cpuName = "Apple A16 Bionic";
          cpuScore = 8.5;
          gpuName = "Apple GPU @ A16";
          gpuScore = 8.3;
          ram = 6; vram = 2;
        } else if (lower.includes("iphone 14")) {
          cpuName = "Apple A15 Bionic (5-core)";
          cpuScore = 8.1;
          gpuName = "Apple GPU @ A15";
          gpuScore = 8.0;
          ram = 6; vram = 1.5;
        } else if (lower.includes("iphone 13 pro max") || lower.includes("iphone 13 pro")) {
          cpuName = "Apple A15 Bionic (5-core)";
          cpuScore = 8.3;
          gpuName = "Apple GPU @ A15";
          gpuScore = 8.1;
          ram = 6; vram = 1.5;
        } else if (lower.includes("iphone 13") || lower.includes("iphone se (3rd gen)")) {
          cpuName = "Apple A15 Bionic";
          cpuScore = 8.0;
          gpuName = "Apple GPU @ A15";
          gpuScore = 7.6;
          ram = 4; vram = 1.0;
        } else if (lower.includes("iphone 12")) {
          cpuName = "Apple A14 Bionic";
          cpuScore = 7.5;
          gpuName = "Apple GPU @ A14";
          gpuScore = 7.4;
          ram = 4; vram = 1.0;
        } else if (lower.includes("iphone 11") || lower.includes("iphone se (2nd gen)")) {
          cpuName = "Apple A13 Bionic";
          cpuScore = 6.4;
          gpuName = "Apple GPU @ A13";
          gpuScore = 6.3;
          ram = 4; vram = 0.512;
        } else if (lower.includes("iphone xs") || lower.includes("iphone xr")) {
          cpuName = "Apple A12 Bionic";
          cpuScore = 6.0;
          gpuName = "Apple GPU @ A12";
          gpuScore = 5.8;
          ram = 3; vram = 0.256;
        } else if (lower.includes("iphone x") || lower.includes("iphone 8")) {
          cpuName = "Apple A11 Bionic";
          cpuScore = 5.3;
          gpuName = "Apple GPU @ A11";
          gpuScore = 5.2;
          ram = 3; vram = 0.256;
        } else if (lower.includes("iphone 7")) {
          cpuName = "Apple A10 Fusion";
          cpuScore = 4.4;
          gpuName = "Apple GPU @ A10";
          gpuScore = 4.2;
          ram = 2; vram = 0.128;
        } else if (lower.includes("iphone 6s") || lower.includes("iphone se (1st gen)")) {
          cpuName = "Apple A9";
          cpuScore = 3.8;
          gpuName = "Apple GPU @ A9";
          gpuScore = 3.6;
          ram = 2; vram = 0.128;
        } else if (lower.includes("iphone 6")) {
          cpuName = "Apple A8";
          cpuScore = 3.2;
          gpuName = "Apple GPU @ A8";
          gpuScore = 3.0;
          ram = 1; vram = 0.064;
        } else if (lower.includes("iphone 5")) {
          cpuName = "Apple A6/A7";
          cpuScore = 2.5;
          gpuName = "Apple GPU @ A6";
          gpuScore = 2.2;
          ram = 1; vram = 0.064;
        } else if (lower.includes("iphone 4")) {
          cpuName = "Apple A4/A5";
          cpuScore = 1.4;
          gpuName = "Apple GPU @ A4";
          gpuScore = 1.2;
          ram = 0.5; vram = 0.016;
        } else {
          cpuName = "Apple Older Core";
          cpuScore = 0.5;
          gpuName = "PowerVR MBX";
          gpuScore = 0.5;
          ram = 0.128; vram = 0.008;
        }

        setSpecs({
          cpuName,
          cpuScore,
          gpuName,
          gpuScore,
          ramGB: ram,
          vramGB: vram,
          storageGB: phoneStorage,
          isSSD: true,
          os: "iOS System Device"
        });
      } else {
        const { cpuScore, gpuScore } = estimateHardwareScores(phoneCpu, phoneGpu);
        setSpecs({
          cpuName: phoneCpu,
          cpuScore,
          gpuName: phoneGpu,
          gpuScore,
          ramGB: phoneRam,
          vramGB: Math.round(phoneRam * 0.4),
          storageGB: phoneStorage,
          isSSD: true,
          os: `${phoneName} // Android`
        });
      }
    }
  }, [
    deviceType, customCpu, customGpu, ramGB, vramGB, storageGB, storageType, osName, 
    consoleBrand, consoleModel, handheldBrand, handheldModel, phoneName, phoneCpu, 
    phoneGpu, phoneRam, phoneStorage, pcCategory, pcSubType, mobileSubType, appleFamily, 
    appleModel, iphoneModel, ramGen, linuxDistro
  ]);

  // Core local diagnostic generator
  useEffect(() => {
    if (!selectedGame) return;
    const minR = selectedGame.minimum_requirements || { cpu: "Any", gpu: "Any", ram: 8, storage: 45 };
    const recR = selectedGame.recommended_requirements || minR;

    let cpuMultiplier = isOverclocked && deviceType === "desktop" ? 1.07 : 1.0;
    let gpuMultiplier = isOverclocked && deviceType === "desktop" ? 1.07 : 1.0;

    let ramStatus: "pass" | "warn" | "fail" = specs.ramGB >= recR.ram ? "pass" : specs.ramGB >= minR.ram ? "warn" : "fail";
    let storageStatus: "pass" | "warn" | "fail" = specs.storageGB >= minR.storage ? "pass" : "fail";

    const isHeavy = selectedGame.slug.includes("cyberpunk") || selectedGame.slug.includes("elden") || selectedGame.slug.includes("red-dead");
    const minCpuReq = isHeavy ? 6.5 : 4.0;
    const recCpuReq = isHeavy ? 8.2 : 6.0;

    const modifiedCpu = specs.cpuScore * cpuMultiplier;
    const modifiedGpu = specs.gpuScore * gpuMultiplier;

    let cpuStatus: "pass" | "warn" | "fail" = modifiedCpu >= recCpuReq ? "pass" : modifiedCpu >= minCpuReq ? "warn" : "fail";
    let gpuStatus: "pass" | "warn" | "fail" = modifiedGpu >= recCpuReq ? "pass" : modifiedGpu >= minCpuReq ? "warn" : "fail";

    let score = Math.round((Math.min(10, modifiedCpu) / 10) * 30 + (Math.min(10, modifiedGpu) / 10) * 40 + (specs.ramGB / recR.ram) * 30);
    if (score > 100) score = 100;

    let estFps = 30;
    if (score >= 85) estFps = 80;
    else if (score >= 60) estFps = 60;
    else if (score >= 45) estFps = 40;

    let recommendedResolution = "1085p - Medium settings";
    if (score >= 90) recommendedResolution = "4K / Ultra Settings (DLSS/PSSR Active)";
    else if (score >= 75) recommendedResolution = "1440p - High Settings";

    let bottleneck = lang === "ar" ? "لا يوجد [عتاد متجانس]" : "None [Balanced Output]";
    if (ramStatus === "fail") bottleneck = t.ramInsufficient;
    else if (modifiedGpu < modifiedCpu - 1) bottleneck = t.gpuBound;
    else if (modifiedCpu < modifiedGpu - 1.5) bottleneck = t.cpuBound;

    let verdict = score >= 85 ? t.verdictSuper : score >= 60 ? t.verdictSmooth : score >= 40 ? t.verdictMedium : t.verdictLow;

    const result: AnalysisResult = {
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

    setLocalAnalysis(result);

    // Auto-save search items to offline hist
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      let list: CachedAnalysisItem[] = stored ? JSON.parse(stored) : [];
      list = list.filter(item => item.game.id !== selectedGame.id);
      list.unshift({
        id: `${selectedGame.id}-${Date.now()}`,
        game: selectedGame,
        specs: { ...specs, deviceType, ramSpeedMHz, isOverclocked, storageType },
        result,
        timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      });
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(list.slice(0, 5)));
      setHistoryList(list.slice(0, 5));
    } catch {}
  }, [selectedGame, specs, isOverclocked, ramSpeedMHz, storageType, deviceType, lang]);

  // Load offline reports history on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (stored) setHistoryList(JSON.parse(stored));
    } catch {}
  }, []);

  const handleRestoreHistoryItem = (item: CachedAnalysisItem) => {
    setSelectedGame(item.game);
    setLocalAnalysis(item.result);
    setDeepAnalysisRaw(item.aiReport || "");
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
      setHistoryList([]);
    } catch {}
  };

  const validateTextInputs = (): boolean => {
    if (deviceType !== "desktop" || pcCategory === "apple-mac") return true;
    let isValid = true;
    setCpuValError("");
    setGpuValError("");
    setMotherboardError("");
    setLaptopError("");

    if (pcSubType === "desktop" && motherboardModel.trim().length < 3) {
      setMotherboardError(t.motherboardError);
      isValid = false;
    }
    if (pcSubType === "laptop" && laptopModel.trim().length < 3) {
      setLaptopError(t.laptopError);
      isValid = false;
    }
    const cpuLow = customCpu.toLowerCase();
    const gpuLow = customGpu.toLowerCase();

    if (cpuLow.length < 3) {
      setCpuValError(t.cpuValErrorShort);
      isValid = false;
    } else if (!["intel", "amd", "ryzen", "core", "m1", "m2", "m3", "m4", "apple", "snapdragon"].some(x => cpuLow.includes(x))) {
      setCpuValError(t.cpuValErrorBrand);
      isValid = false;
    }

    if (gpuLow.length < 3) {
      setGpuValError(t.gpuValErrorShort);
      isValid = false;
    } else if (!["nvidia", "geforce", "rtx", "gtx", "radeon", "rx", "intel", "arc", "graphics", "apple"].some(x => gpuLow.includes(x))) {
      setGpuValError(t.gpuValErrorBrand);
      isValid = false;
    }
    return isValid;
  };

  // Run Gemini Cloud Analyzer proxy
  const executeGeminiScanner = async () => {
    if (!selectedGame || isDeepAnalyzing) return;
    if (deviceType === "desktop" && !validateTextInputs()) {
      alert(t.validationError);
      return;
    }

    setIsDeepAnalyzing(true);
    setDeepAnalysisRaw("");

    const prompt = `
You are a highly detailed and precise Gaming Compatibility System Expert.
Analyze the compatibility between:
- Game Name: ${selectedGame.name}
- System CPU: ${specs.cpuName}
- System GPU: ${specs.gpuName}
- System RAM: ${specs.ramGB} GB
- System storage: ${specs.storageGB} GB (Type: ${storageType})
- Category Device: ${deviceType.toUpperCase()}

STRICT RESPONSE FORMAT:
You MUST start section names with "## Summary", "## Best Settings" and "## Detailed Analysis". Use friendly Arabic tone with English helper terms in brackets. Include specific average FPS prediction at the end.
`;

    let didTimeout = false;
    let timeoutId: any = null;

    try {
      timeoutId = setTimeout(() => {
        didTimeout = true;
        const timeoutMsg = lang === "ar"
          ? `انتهت مهلة الاتصال بخوادم فحص جيميناي (Gemini AI) لعدم استجابة الخادم في الوقت المحدد. يرجى محاولة الفحص مجدداً في وقت لاحق.`
          : `Connection to the Gemini AI scan servers timed out because the server did not respond in time. Please try scanning again later.`;
        setDeepAnalysisRaw(timeoutMsg);
        setIsDeepAnalyzing(false);
      }, 30000);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (timeoutId) clearTimeout(timeoutId);
      if (didTimeout) return;

      if (response.ok) {
        const data = await response.json();
        const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (geminiText) {
          setDeepAnalysisRaw(geminiText);
          setIsDeepAnalyzing(false);
          return;
        }
        throw new Error("No text in response");
      }
      throw new Error("Unable to parse API response stream");
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (didTimeout) return;

      console.warn("API Error, setting error state...", err);
      
      const errorMsg = lang === "ar"
        ? `فشل الاتصال بخادم فحص جيميناي السحابي (Gemini AI). تم فحص مواصفات قطع العتاد في جهازك محلياً بشكل سليم في القسم الفوري أعلاه. يرجى محاولة الفحص السحابي مجدداً لاحقاً.`
        : `Failed to connect to the Gemini AI cloud scan server. Your equipment was analyzed locally in the immediate section above. Please try running the cloud scan again later.`;
        
      setDeepAnalysisRaw(errorMsg);
    } finally {
      if (!didTimeout) {
        setIsDeepAnalyzing(false);
      }
    }
  };

  // Helper score heuristics
  function estimateHardwareScores(cpuStr: string, gpuStr: string) {
    const cpu = cpuStr.toLowerCase();
    const gpu = gpuStr.toLowerCase();
    let cpuScore = 5.8;
    let gpuScore = 5.5;
    let defaultVram = 4;

    if (cpu.includes("9900") || cpu.includes("13900") || cpu.includes("14900") || cpu.includes("7800x3d") || cpu.includes("m4") || cpu.includes("m3 max")) cpuScore = 10.0;
    else if (cpu.includes("12700") || cpu.includes("13700") || cpu.includes("5900") || cpu.includes("m3")) cpuScore = 8.5;
    else if (cpu.includes("12400") || cpu.includes("11400") || cpu.includes("3600") || cpu.includes("5600")) cpuScore = 7.0;

    if (gpu.includes("4090") || gpu.includes("4080") || gpu.includes("7950")) {
      gpuScore = 10.0;
      defaultVram = 16;
    } else if (gpu.includes("4070") || gpu.includes("3080") || gpu.includes("6800")) {
      gpuScore = 8.8;
      defaultVram = 12;
    } else if (gpu.includes("3060") || gpu.includes("2060") || gpu.includes("rx")) {
      gpuScore = 7.0;
      defaultVram = 8;
    }
    return { cpuScore, gpuScore, defaultVram };
  }

  const handleAppleFamilyChange = (fam: string) => {
    setAppleFamily(fam);
    if (fam === "apple_silicon") {
      setAppleModel("MacBook Pro M3");
    } else if (fam === "intel_legacy") {
      setAppleModel("MacBook Pro 16\" (Intel Core i9)");
    } else {
      setAppleModel("Power Mac G5");
    }
  };

  const handleAppleGenChange = (model: string) => {
    setAppleModel(model);
  };

  const runHardwareAutoScan = () => {
    setAutoScanStatus("running");
    setScanLogs([]);
    const logsArr = lang === "ar" ? [
      "⏳ جاري استجواب مواصفات الهوية وبيئة المتصفح...",
      "🖥️ جاري قياس المعالجات الفيزيائية وخيوط الحساب المتاحة...",
      "🔬 استجواب عتاد الرسوميات عبر WebGL Core 2.0...",
      "✅ تم كشف القطع وتعبئة النماذج الذكية بنجاح فائق!"
    ] : [
      "⏳ Probing user agent signatures and OS architecture...",
      "🖥️ Detecting physical cores and logical thread pool...",
      "🔬 Analyzing graphics context with WebGL 2.0 API...",
      "✅ Diagnostics complete! Populating specifications dynamically."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logsArr.length) {
        setScanLogs(prev => [...prev, logsArr[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        if (typeof (window as any).smartHardwareScan === "function") {
          const detected = (window as any).smartHardwareScan();
          setDeviceType(detected.deviceType);
          setAndroidScanWarning(detected.requiresAndroidPrompt || false);
          
          if (detected.deviceType === "desktop") {
            setPcCategory(detected.pcCategory);
            if (detected.pcCategory === "apple-mac") {
              setAppleFamily(detected.appleFamily);
              setAppleModel(detected.appleModel || "MacBook Pro M3");
            } else {
              setPcSubType(detected.pcSubType);
              setCustomCpu(detected.cpuName);
              setCustomGpu(detected.gpuName);
              setRamGB(detected.ramGB);
              setVramGB(detected.vramGB);
              setStorageGB(detected.storageGB);
              setStorageType(detected.storageType);
              setMotherboardModel(detected.motherboardModel);
            }
          } else if (detected.deviceType === "mobile") {
             setMobileSubType(detected.mobileSubType);
             if (detected.mobileSubType === "apple-ios") {
               setAppleFamily("iphone");
               setIphoneModel(detected.iphoneModel || "iPhone 15 Pro Max");
             } else {
               setPhoneName(detected.phoneName);
               setPhoneCpu(detected.phoneCpu);
               setPhoneGpu(detected.phoneGpu);
               setPhoneRam(detected.phoneRam);
               setPhoneStorage(detected.phoneStorage);
             }
          }
        }
        setAutoScanStatus("success");
        setTimeout(() => setAutoScanStatus("idle"), 4000);
      }
    }, 400);
  };

  const parseAiScanReport = (text: string) => {
    const result = { summary: "", bestSettings: "", detailedAnalysis: "" };
    if (!text) return result;
    const sIdx = text.indexOf("## Summary");
    const bsIdx = text.indexOf("## Best Settings");
    const daIdx = text.indexOf("## Detailed Analysis");

    if (sIdx !== -1 && bsIdx !== -1 && daIdx !== -1) {
      result.summary = text.slice(sIdx + 10, bsIdx).trim();
      result.bestSettings = text.slice(bsIdx + 16, daIdx).trim();
      result.detailedAnalysis = text.slice(daIdx + 20).trim();
    } else {
      result.summary = text;
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-[#060913] text-[#f3f4f6]" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Background radial layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Header bar */}
      <header className="border-b border-[#1f2937] bg-[#070b18]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Gamepad2 className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className="text-sm font-extrabold tracking-wider font-mono text-cyan-400">CORECOMPAT</span>
              <h1 className="text-[10px] text-gray-500 font-mono hidden sm:block">AI HARDWARE MATRIX V3.0</h1>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-cyan-400 transition hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
          >
            <Languages className="w-4 h-4 text-gray-400" />
            <span>{lang === "ar" ? "English Model" : "العربية"}</span>
          </button>
        </div>
      </header>

      {/* Main body content container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full flex flex-col gap-8 text-right">
        
        {/* App Heading */}
        <section className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono w-fit">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>STRICT SERVER-SIDE GEMINI VERIFICATION ACTIVE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-gray-200">
            {t.appTitle}
          </h2>
          <p className="text-gray-400 text-xs max-w-3xl leading-relaxed">
            {t.appSub}
          </p>
        </section>

        {/* Action Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION - Inputs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Search Game Box */}
            <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 border-b border-gray-900 pb-2 flex-row-reverse">
                <span className="p-1 px-2.5 rounded bg-cyan-950 text-cyan-400">1</span>
                <span>{t.searchTitle}</span>
              </h3>

              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 p-3.5 rounded-xl text-xs outline-none focus:border-cyan-500 text-right pr-4 pl-11 text-gray-200"
                />
                <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                {isSearchingGames && (
                  <span className="absolute left-14 top-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
              </div>

              {/* Search Result Box Dropdown */}
              <AnimatePresence>
                {searchQuery.trim() !== "" && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-950 border border-gray-800 rounded-xl divide-y divide-gray-900 max-h-56 overflow-y-auto shadow-2xl mt-1 text-right z-50"
                  >
                    {searchResults.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => {
                          setSelectedGame(game);
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                        className="w-full p-3.5 text-right flex items-center justify-between hover:bg-gray-900 transition gap-3"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500 rotate-180" />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-gray-200">{game.name}</h4>
                          <span className="text-[10px] text-gray-500 block">{t.released}: {game.released}</span>
                        </div>
                        <img src={game.background_image} alt="" className="w-12 h-9 rounded object-cover" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid fallbacks */}
              <div>
                <span className="text-[10px] font-mono text-gray-500 block mb-2 font-bold">{t.popularGames}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(trendingGames.length > 0 ? trendingGames : POPULAR_FALLBACK_GAMES).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGame(g)}
                      className={`relative overflow-hidden rounded-xl h-20 text-right border transition-all hover:scale-98 cursor-pointer ${selectedGame.id === g.id ? "border-cyan-500 bg-cyan-950/15" : "border-gray-850 hover:border-gray-700"}`}
                    >
                      <img src={g.background_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 text-[10px] font-extrabold text-center line-clamp-1 block z-10">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic System Specs selection card */}
            <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-3 border-b border-gray-900 pb-3">
                <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 flex-row pb-1">
                  <span className="p-1 px-2.5 rounded bg-cyan-950 text-cyan-400">2</span>
                  <span>{t.specTitle}</span>
                </h3>

                {/* Categories Tab selectors */}
                <div className="flex bg-gray-950 p-1.5 rounded-xl border border-gray-850 flex-wrap gap-1 flex-row-reverse justify-end">
                  <button
                    onClick={() => setDeviceType("desktop")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${deviceType === "desktop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>{t.desktopMode}</span>
                  </button>
                  <button
                    onClick={() => { setDeviceType("console"); setConsoleBrand("sony"); setConsoleModel("ps5"); }}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${deviceType === "console" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>{t.consoleMode}</span>
                  </button>
                  <button
                    onClick={() => { setDeviceType("handheld"); setHandheldBrand("valve"); setHandheldModel("steam-deck-oled"); }}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${deviceType === "handheld" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{t.handheldMode}</span>
                  </button>
                  <button
                    onClick={() => setDeviceType("mobile")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${deviceType === "mobile" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{t.mobileMode}</span>
                  </button>
                </div>
              </div>

              {/* Automatic Scan simulation buttons */}
              <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-900 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={runHardwareAutoScan}
                  disabled={autoScanStatus === "running"}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${autoScanStatus === "running" ? "bg-cyan-950/40 text-cyan-400 border border-cyan-800 animate-pulse" : "bg-[#11182c] hover:bg-[#16223f] text-cyan-400 border border-cyan-900/40"}`}
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{autoScanStatus === "running" ? t.autoScanRunning : autoScanStatus === "success" ? t.autoScanSuccess : t.autoScanBtn}</span>
                </button>
                {scanLogs.length > 0 && (
                  <div className="bg-black/70 border border-gray-900 rounded-lg p-3 font-mono text-[10px] text-zinc-400 flex flex-col gap-0.5 text-left" dir="ltr">
                    {scanLogs.map((log, idx) => (
                      <div key={idx}>&gt; {log}</div>
                    ))}
                  </div>
                )}
              </div>
              {deviceType === "desktop" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-950/40 p-3.5 rounded-xl border border-gray-900">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-cyan-300/80">{t.pcCategoryLabel}</label>
                      <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                        <button type="button" onClick={() => setPcCategory("custom")} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${pcCategory === "custom" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.customPcOpt}</button>
                        <button type="button" onClick={() => { setPcCategory("apple-mac"); handleAppleFamilyChange("apple_silicon_era"); }} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${pcCategory === "apple-mac" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.appleMacOpt}</button>
                      </div>
                    </div>
                    {pcCategory === "custom" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-300/80">{t.pcSubTypeLabel}</label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                          <button type="button" onClick={() => setPcSubType("desktop")} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${pcSubType === "desktop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.desktopSubType}</button>
                          <button type="button" onClick={() => setPcSubType("laptop")} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${pcSubType === "laptop" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.laptopSubType}</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {pcCategory === "custom" ? (
                    <>
                      {/* Desktop / Laptop Model text entry with validation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">{pcSubType === "desktop" ? t.motherboardLabel : t.laptopModelLabel}</label>
                          <input
                            type="text"
                            value={pcSubType === "desktop" ? motherboardModel : laptopModel}
                            onChange={(e) => pcSubType === "desktop" ? setMotherboardModel(e.target.value) : setLaptopModel(e.target.value)}
                            placeholder={pcSubType === "desktop" ? t.motherboardPlaceholder : t.laptopModelPlaceholder}
                            className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">{t.cpu}</label>
                          <input
                            type="text" value={customCpu} onChange={(e) => setCustomCpu(e.target.value)}
                            placeholder={t.cpuPlaceholder}
                            className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">{t.gpu}</label>
                          <input
                            type="text" value={customGpu} onChange={(e) => setCustomGpu(e.target.value)}
                            placeholder={t.gpuPlaceholder}
                            className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">{t.overclock}</label>
                          <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                            <button type="button" onClick={() => setIsOverclocked(true)} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1 ${isOverclocked ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-gray-500"}`}><Flame className="w-3.5 h-3.5" /> {t.overclockOn}</button>
                            <button type="button" onClick={() => setIsOverclocked(false)} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${!isOverclocked ? "bg-gray-900 text-gray-400 border border-gray-850" : "text-gray-500"}`}>{t.overclockOff}</button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">نوع وسرعة وحدة التخزين (Drive Interface & Speed)</label>
                          <select value={storageType} onChange={(e) => setStorageType(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                            <option value="SATA HDD">SATA HDD (Mechanical Magnetic)</option>
                            <option value="SATA SSD (550 MB/s)">SATA SSD (Solid State - 550 MB/s)</option>
                            <option value="NVMe M.2 SSD (Gen 3 - 3500 MB/s)">NVMe M.2 SSD (PCIe Gen 3 - 3500 MB/s)</option>
                            <option value="NVMe M.2 SSD (Gen 4 - 7000 MB/s)">NVMe M.2 SSD (PCIe Gen 4 - 7000 MB/s)</option>
                            <option value="NVMe M.2 SSD (Gen 5 - 14000 MB/s)">NVMe M.2 SSD (PCIe PCIe Gen 5 - 14000 MB/s)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-305/85">جيل ذاكرة الـ RAM (RAM Generation)</label>
                          <select value={ramGen} onChange={(e) => setRamGen(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                            <option value="DDR5">DDR5 (High Bandwidth / Modern)</option>
                            <option value="DDR4">DDR4 (Standard mainstream)</option>
                            <option value="DDR3">DDR3 (Legacy)</option>
                            <option value="DDR2">DDR2 (Vintage)</option>
                            <option value="DDR1">DDR1 (Retro)</option>
                            <option value="SDRAM">SDRAM (Classic legacy)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-300/80">نظام التشغيل (Operating System)</label>
                          <select value={osName} onChange={(e) => setOsName(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-200 w-full">
                            <optgroup label="Microsoft Windows">
                              <option value="Windows 11">Windows 11</option>
                              <option value="Windows 10">Windows 10</option>
                              <option value="Windows 8.1">Windows 8.1</option>
                              <option value="Windows 8">Windows 8</option>
                              <option value="Windows 7">Windows 7</option>
                              <option value="Windows XP">Windows XP</option>
                              <option value="Windows 98">Windows 98</option>
                            </optgroup>
                            <optgroup label="Apple macOS">
                              <option value="macOS Sequoia">macOS Sequoia (Modern)</option>
                              <option value="macOS Sonoma">macOS Sonoma</option>
                              <option value="macOS Ventura">macOS Ventura</option>
                              <option value="macOS Monterey">macOS Monterey</option>
                              <option value="OS X El Capitan">OS X El Capitan</option>
                              <option value="OS X Yosemite">OS X Yosemite</option>
                              <option value="Mac OS X Snow Leopard">Mac OS X Snow Leopard</option>
                              <option value="Mac OS 9 (Classic PowerPC OS)">Mac OS 9 (Classic PowerPC OS)</option>
                            </optgroup>
                            <optgroup label="Open-Source Linux">
                              <option value="Linux">Linux (توزيعة مخصصة)</option>
                            </optgroup>
                          </select>
                        </div>
                        {osName === "Linux" && (
                          <div className="flex flex-col gap-1.5 animate-fade-in">
                            <label className="text-[10px] font-mono text-cyan-400">اسم التوزيعة النشطة (Linux Distribution)</label>
                            <input
                              type="text"
                              value={linuxDistro}
                              onChange={(e) => setLinuxDistro(e.target.value)}
                              placeholder="مثال: Ubuntu, Arch Linux, Mint"
                              className="bg-gray-950 border border-cyan-900 p-3 rounded-xl text-xs outline-none focus:border-cyan-500 text-right text-gray-300 w-full"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Apple Silicon selectors */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cyan-950/10 p-4 rounded-xl border border-cyan-900/30 text-right">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-400">{t.appleFamilyLabel}</label>
                        <select value={appleFamily} onChange={(e) => handleAppleFamilyChange(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full text-gray-250">
                          <option value="apple_silicon">{lang === "ar" ? "معالجات Apple Silicon (M1-M4)" : "Apple Silicon Core (M1-M4)"}</option>
                          <option value="intel_legacy">{lang === "ar" ? "معالجات Intel Mac القديمة" : "Intel-based Legacy Mac"}</option>
                          <option value="powerpc_legacy">{lang === "ar" ? "معالجات PowerPC القديمة (G3-G5)" : "Legacy PowerPC Mac (G3-G5)"}</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-400">{lang === "ar" ? "موديل الجهاز" : "Mac Device Model"}</label>
                        <select value={appleModel} onChange={(e) => handleAppleGenChange(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full text-gray-250">
                          {(appleFamily === "apple_silicon"
                            ? MAC_MODELS.apple_silicon
                            : appleFamily === "intel_legacy"
                            ? MAC_MODELS.intel_era
                            : MAC_MODELS.powerpc_era
                          ).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Range Sliders for sizes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-950/40 p-4 rounded-xl border border-gray-900 mt-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-teal-400">
                        <span>{t.ram || "الذاكرة العشوائية"}</span>
                        <span>{ramGB} GB {pcCategory === "custom" && `(${ramGen})`}</span>
                      </div>
                      {pcCategory === "custom" ? (
                        <input type="range" min={2} max={256} step={2} value={ramGB} onChange={(e) => setRamGB(parseInt(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                      ) : (
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden mt-2"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (ramGB / 256) * 100)}%` }} /></div>
                      )}
                    </div>

                    {pcCategory === "custom" && (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-orange-400">
                          <span>سرعة الذاكرة (RAM Speed)</span>
                          <span>{ramSpeedMHz} MHz</span>
                        </div>
                        <input type="range" min={1600} max={8600} step={100} value={ramSpeedMHz} onChange={(e) => setRamSpeedMHz(parseInt(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-indigo-400"><span>{t.vram || "ذاكرة كرت الشاشة"}</span><span>{vramGB} GB</span></div>
                      {pcCategory === "custom" ? (
                        <input type="range" min={1} max={24} step={1} value={vramGB} onChange={(e) => setVramGB(parseInt(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                      ) : (
                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden mt-2"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (vramGB / 24) * 100)}%` }} /></div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-cyan-400">
                        <span>{t.storage || "مساحة التخزين"}</span>
                        <span>{storageGB >= 1024 ? `${(storageGB / 1024).toFixed(1)} TB` : `${storageGB} GB`}</span>
                      </div>
                      <input type="range" min={16} max={16384} step={16} value={storageGB} onChange={(e) => setStorageGB(parseInt(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated home console selectors */}
              {deviceType === "console" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 animate-fade-in text-right">
                    <label className="text-[10px] font-mono text-cyan-400">{t.brandLabel}</label>
                    <select value={consoleBrand} onChange={(e) => { setConsoleBrand(e.target.value); const models = CONSOLE_MODELS[e.target.value] || []; if (models.length > 0) setConsoleModel(models[0]); }} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                      {CONSOLE_BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 animate-fade-in text-right">
                    <label className="text-[10px] font-mono text-cyan-400">{t.modelLabel}</label>
                    <select value={consoleModel} onChange={(e) => setConsoleModel(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                      {(CONSOLE_MODELS[consoleBrand] || []).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Handheld selectors */}
              {deviceType === "handheld" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 animate-fade-in text-right">
                    <label className="text-[10px] font-mono text-cyan-400">{t.brandLabel}</label>
                    <select value={handheldBrand} onChange={(e) => { setHandheldBrand(e.target.value); const models = HANDHELD_MODELS[e.target.value] || []; if (models.length > 0) setHandheldModel(models[0]); }} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                      {HANDHELD_BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 animate-fade-in text-right">
                    <label className="text-[10px] font-mono text-cyan-400">{t.modelLabel}</label>
                    <select value={handheldModel} onChange={(e) => setHandheldModel(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full">
                      {(HANDHELD_MODELS[handheldBrand] || []).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Mobile Phone entry */}
              {deviceType === "mobile" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 bg-gray-950/40 p-3.5 rounded-xl border border-gray-900">
                    <label className="text-[10px] font-mono text-cyan-400">{t.mobilePlatformLabel}</label>
                    <div className="grid grid-cols-2 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-850">
                      <button type="button" onClick={() => setMobileSubType("android")} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${mobileSubType === "android" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.androidOpt}</button>
                      <button type="button" onClick={() => { setMobileSubType("apple-ios"); setIphoneModel("iPhone 15 Pro Max"); }} className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${mobileSubType === "apple-ios" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}>{t.appleIosOpt}</button>
                    </div>
                  </div>

                  {mobileSubType === "apple-ios" ? (
                    <>
                      <div className="flex flex-col gap-1.5 bg-cyan-950/10 p-4 rounded-xl border border-cyan-900/30 text-right">
                        <label className="text-[10px] font-mono text-cyan-400">{lang === "ar" ? "موديل الآيفون" : "iPhone Model Selection"}</label>
                        <select value={iphoneModel} onChange={(e) => setIphoneModel(e.target.value)} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full text-gray-250">
                          {IPHONE_MODELS.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-400">{t.internalAllocatedStorage}</label>
                        <select value={phoneStorage} onChange={(e) => setPhoneStorage(parseInt(e.target.value))} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right cursor-pointer text-gray-300 w-full text-gray-250">
                          <option value="64">64 GB Storage</option>
                          <option value="128">128 GB Storage</option>
                          <option value="256">256 GB Storage</option>
                          <option value="512">512 GB Storage</option>
                          <option value="1024">1024 GB Storage</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-400">{t.smartphoneTabletName}</label>
                          <input type="text" value={phoneName} onChange={(e) => setPhoneName(e.target.value)} placeholder={t.smartphoneNamePlaceholder} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right text-gray-300 w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-400">{t.coreProcessor}</label>
                          <input type="text" value={phoneCpu} onChange={(e) => setPhoneCpu(e.target.value)} placeholder={t.smartphoneCpuPlaceholder} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right text-gray-300 w-full" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-cyan-400">{t.integratedGraphics}</label>
                          <input type="text" value={phoneGpu} onChange={(e) => setPhoneGpu(e.target.value)} placeholder={t.smartphoneGpuPlaceholder} className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right text-gray-300 w-full" />
                        </div>
                      </div>

                      {/* Android RAM Slider */}
                      <div className="flex flex-col gap-1 bg-gray-950/40 p-4 rounded-xl border border-gray-900 mt-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-teal-400">
                          <span>ذاكرة الجهاز (RAM)</span>
                          <span>{phoneRam} GB</span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={16}
                          step={2}
                          value={phoneRam}
                          onChange={(e) => setPhoneRam(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      {/* Android Storage Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-cyan-400">{t.internalAllocatedStorage}</label>
                        <input
                          type="number"
                          min={16}
                          max={1024}
                          value={phoneStorage || ""}
                          onChange={(e) => setPhoneStorage(parseInt(e.target.value) || 0)}
                          placeholder="مثال: 128"
                          className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-xs text-right text-gray-300 w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - Result presentation */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Target Cover Mini Card */}
            {selectedGame && (
              <div className="bg-[#0b0f1a] border border-gray-850 rounded-2xl p-4 overflow-hidden flex gap-4 text-right flex-row-reverse">
                <img src={selectedGame.background_image} alt="" className="w-20 h-24 rounded-xl object-cover shrink-0 border border-gray-800" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 w-fit block mb-1">TARGET RELEASE</span>
                  <h4 className="text-sm font-extrabold text-gray-100 truncate">{selectedGame.name}</h4>
                  <div className="text-[11px] text-gray-400 mt-1 flex flex-wrap gap-x-2 gap-y-0.5 flex-row-reverse justify-end">
                    <span><strong>{t.genre}:</strong> {selectedGame.genres?.[0]?.name || "Action"}</span>
                    <span>|</span>
                    <span><strong>{t.released}:</strong> {selectedGame.released}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instant predicted Score metrics */}
            <div className="bg-[#0b0f1a] border border-gray-850 border-cyan-950 rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <h3 className="text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 border-b border-gray-900 pb-2 flex-row-reverse justify-end">
                <span className="p-1 rounded-sm bg-cyan-950 text-cyan-400"><Activity className="w-4 h-4 text-rose-500 animate-pulse" /></span>
                <span>{t.fastAnalysisTitle}</span>
              </h3>

              {localAnalysis && (
                <div className="flex flex-col gap-4">
                  {/* Gauge score bar */}
                  <div className="flex items-center gap-4 bg-gray-950/60 p-4 rounded-xl border border-gray-900 flex-row-reverse">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-gray-900" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-cyan-500" strokeWidth="4" strokeDasharray="176" strokeDashoffset={176 - (176 * localAnalysis.overallScore) / 100} fill="none" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-xs font-mono font-extrabold text-zinc-200">{localAnalysis.overallScore}%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-mono text-gray-500 block mb-0.5">{t.overallScore}</span>
                      <h4 className="text-xs font-bold text-gray-300 leading-snug line-clamp-2">{localAnalysis.verdict}</h4>
                    </div>
                  </div>

                  {/* Rating grids */}
                  <div className="grid grid-cols-2 gap-2 text-[11.5px] font-mono">
                    <div className="bg-gray-950/40 p-2.5 rounded-xl flex justify-between flex-row-reverse border border-gray-900">
                      <span className="text-gray-500">CPU</span>
                      <span className={localAnalysis.cpuStatus === "pass" ? "text-emerald-400" : "text-rose-400"}>{localAnalysis.cpuStatus === "pass" ? "PASS" : "WARN"}</span>
                    </div>
                    <div className="bg-gray-950/40 p-2.5 rounded-xl flex justify-between flex-row-reverse border border-gray-900">
                      <span className="text-gray-500">GPU</span>
                      <span className={localAnalysis.gpuStatus === "pass" ? "text-emerald-400" : "text-rose-400"}>{localAnalysis.gpuStatus === "pass" ? "PASS" : "WARN"}</span>
                    </div>
                    <div className="bg-gray-950/40 p-2.5 rounded-xl flex justify-between flex-row-reverse border border-gray-900">
                      <span className="text-gray-500">RAM</span>
                      <span className={localAnalysis.ramStatus === "pass" ? "text-emerald-400" : "text-rose-400"}>{localAnalysis.ramStatus === "pass" ? "PASS" : "WARN"}</span>
                    </div>
                    <div className="bg-gray-950/40 p-2.5 rounded-xl flex justify-between flex-row-reverse border border-gray-900">
                      <span className="text-gray-500">HDD/SSD</span>
                      <span className={localAnalysis.storageStatus === "pass" ? "text-emerald-400" : "text-rose-400"}>{localAnalysis.storageStatus === "pass" ? "PASS" : "FAIL"}</span>
                    </div>
                  </div>

                  <div className="bg-gray-950/40 p-3 rounded-xl border border-gray-900 flex justify-between items-center text-xs flex-row-reverse">
                    <span className="text-gray-500">{t.estFps}</span>
                    <span className="font-bold text-teal-400 flex items-center gap-1.5"><Gauge className="w-4 h-4" /> ~{localAnalysis.estFps} FPS</span>
                  </div>
                  <div className="bg-gray-950/40 p-3 rounded-xl border border-gray-900 flex justify-between items-center text-xs flex-row-reverse">
                    <span className="text-gray-500">{t.resolution}</span>
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5"><Layers className="w-4 h-4" /> {localAnalysis.recommendedResolution.split(" (")[0]}</span>
                  </div>
                  <div className="bg-gray-950/40 p-3 rounded-xl border border-gray-900 flex justify-between items-center text-xs flex-row-reverse">
                    <span className="text-gray-500">{t.bottleneck}</span>
                    <span className="font-bold text-rose-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {localAnalysis.bottleneck}</span>
                  </div>

                  {/* Detailed AI Scanner button */}
                  <button
                    onClick={executeGeminiScanner}
                    disabled={isDeepAnalyzing}
                    className="w-full mt-1.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold text-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/30"
                  >
                    {isDeepAnalyzing ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>{t.aiAnalyzing}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
                        <span>{t.aiBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* AI Deep Scan Output markup */}
            <AnimatePresence>
              {deepAnalysisRaw && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-950 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-right ml-0 mr-0"
                >
                  <div className="flex items-center justify-between border-b border-gray-900 pb-2 flex-row-reverse text-right">
                    <span className="text-[9px] font-mono tracking-wider text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/25">GEMINI SYSTEM REPORT</span>
                    <h3 className="text-xs font-bold text-gray-200">{t.aiFullAnalysis}</h3>
                  </div>

                  {(() => {
                    const parsed = parseAiScanReport(deepAnalysisRaw);
                    const isError = !parsed.bestSettings && !parsed.detailedAnalysis;
                    if (isError) {
                      return (
                        <div className="bg-[#1b0a0a]/70 border border-red-900/40 p-4 rounded-xl flex items-start gap-3 flex-row-reverse text-right">
                          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-red-400 font-bold text-xs mb-1 text-right">
                              {lang === "ar" ? "فشل الاتصال بالذكاء الاصطناعي" : "AI Scan Connection Error"}
                            </h4>
                            <p className="text-gray-300 text-xs leading-relaxed text-right">{parsed.summary}</p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#060810]/70 border border-gray-850 p-4 rounded-xl">
                          <h4 className="text-cyan-400 font-mono text-[11px] font-bold uppercase mb-2 flex items-center gap-1.5 justify-end"><span className="text-gray-400">📝</span> {t.compatibilitySummary}</h4>
                          <p className="text-gray-300 text-xs leading-relaxed text-justify whitespace-pre-line">{parsed.summary}</p>
                        </div>
                        <div className="bg-[#060810]/70 border border-gray-850 p-4 rounded-xl">
                          <h4 className="text-teal-400 font-mono text-[11px] font-bold uppercase mb-2 flex items-center gap-1.5 justify-end"><span className="text-gray-400">🔧</span> {t.optimalSettings}</h4>
                          <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line text-right">{parsed.bestSettings}</p>
                        </div>
                        <div className="bg-[#060810]/70 border border-gray-850 p-4 rounded-xl">
                          <h4 className="text-indigo-400 font-mono text-[11px] font-bold uppercase mb-2 flex items-center gap-1.5 justify-end"><span className="text-gray-400">📊</span> {t.detailedMetrics}</h4>
                          <div className="text-gray-300 text-[11px] font-mono leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-lg border border-gray-900 text-right">{parsed.detailedAnalysis}</div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* History slider list */}
        <section className="bg-[#0a0f1c]/50 border border-gray-850 rounded-2xl p-5 shadow-inner mt-2">
          <div className="flex flex-row-reverse items-center justify-between border-b border-gray-900 pb-3 mb-4">
            <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase flex items-center gap-2 flex-row-reverse">
              <History className="w-4 h-4 text-cyan-400" />
              <span>{t.historyTitle}</span>
            </h3>
            {historyList.length > 0 && (
              <button type="button" onClick={clearHistory} className="px-3 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-rose-400 hover:text-rose-300 rounded-lg text-[10px] font-bold cursor-pointer transition">
                <span>{t.clearHistoryBtn}</span>
              </button>
            )}
          </div>
          {historyList.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-6 font-mono">{t.hasNoHistory}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {historyList.map((item) => (
                <div
                  key={item.id} onClick={() => handleRestoreHistoryItem(item)}
                  className="bg-gray-950 border border-gray-850/60 rounded-xl p-3 flex flex-col justify-between transition hover:border-cyan-500/35 cursor-pointer active:scale-98 group text-right"
                >
                  <div className="flex gap-2 mb-2 flex-row-reverse justify-start">
                    <img src={item.game.background_image} alt="" className="w-8 h-8 rounded object-cover border border-gray-850 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-cyan-400 transition leading-none">{item.game.name}</h4>
                      <span className="text-[8px] text-gray-500 uppercase mt-1 block font-mono">{item.specs.deviceType.toUpperCase()} - {item.timestamp}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-[10px] flex-row-reverse">
                    <span className="text-gray-400">FPS: <strong className="text-teal-400">{item.result.estFps}</strong></span>
                    <span className="text-[8.5px] text-indigo-400 font-bold">{item.result.overallScore}% MATCH</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Selected Game specs */}
        {selectedGame && (
          <section className="bg-[#090d16]/30 border border-gray-850 rounded-2xl p-5 mt-2">
            <h3 className="text-xs font-bold text-gray-300 mb-4 tracking-wider uppercase flex items-center gap-1.5 flex-row-reverse border-b border-gray-900 pb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{t.specsOfSelected} <strong className="text-cyan-400 font-sans">{selectedGame.name}</strong></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 text-right">
                <span className="text-[10px] text-yellow-500 font-bold block uppercase border-b border-gray-900 pb-1.5 mb-2">{t.reqMin}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500 block text-[9px]">CPU</span><span className="text-gray-300">{selectedGame.minimum_requirements?.cpu || "Core i5"}</span></div>
                  <div><span className="text-gray-500 block text-[9px]">GPU</span><span className="text-gray-300">{selectedGame.minimum_requirements?.gpu || "GTX 760"}</span></div>
                  <div><span className="text-gray-500 block text-[9px]">RAM</span><span className="text-gray-300">{selectedGame.minimum_requirements?.ram || 8} GB</span></div>
                  <div><span className="text-gray-500 block text-[9px]">DISK</span><span className="text-gray-300">{selectedGame.minimum_requirements?.storage || 60} GB</span></div>
                </div>
              </div>
              <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 text-right">
                <span className="text-[10px] text-cyan-400 font-bold block uppercase border-b border-gray-900 pb-1.5 mb-2">{t.reqRec}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500 block text-[9px]">CPU</span><span className="text-gray-300">{selectedGame.recommended_requirements?.cpu || "Core i7"}</span></div>
                  <div><span className="text-gray-500 block text-[9px]">GPU</span><span className="text-gray-300">{selectedGame.recommended_requirements?.gpu || "GTX 1060"}</span></div>
                  <div><span className="text-gray-500 block text-[9px]">RAM</span><span className="text-gray-300">{selectedGame.recommended_requirements?.ram || 12} GB</span></div>
                  <div><span className="text-gray-500 block text-[9px]">DISK</span><span className="text-gray-300">{selectedGame.recommended_requirements?.storage || 60} GB</span></div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Footer bar */}
      <footer className="border-t border-gray-850/60 bg-[#04060c] py-6 text-center mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row-reverse items-center justify-between gap-4 text-xs text-gray-500">
          <p dir="ltr">© {new Date().getFullYear()} CoreCompat Smart Compatibility Analyzer. Powered by RAWG & Gemini AI.</p>
          <span className="font-mono text-cyan-500">Offline Fallback Database Configured</span>
        </div>
      </footer>
    </div>
  );
}
