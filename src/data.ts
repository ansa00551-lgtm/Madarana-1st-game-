import { Game, ApplePreset } from "./types";

export interface ConsolePreset {
  id: string;
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  vram: string;
  storage: string;
  cpuScore: number; // 1-10 scale
  gpuScore: number; // 1-10 scale
  ramGB: number;
  vramGB: number;
  storageGB: number;
  storageType: "NVMe SSD" | "SATA SSD" | "SATA HDD" | "UFS Storage" | "eMMC Storage" | "Memory Card" | "Flash" | "Cartridge";
  overallRating: number; // 0-100 index for older/newer capability
  explanation: string;
}

// Fallback games if dynamic trending is offline
export const POPULAR_FALLBACK_GAMES: Game[] = [
  {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    background_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    released: "2020-12-10",
    genres: [{ name: "RPG" }, { name: "Action" }],
    minimum_requirements: {
      cpu: "Intel Core i7-6700 / AMD Ryzen 5 1600",
      gpu: "NVIDIA GTX 1060 6GB / AMD RX 580",
      ram: 12,
      storage: 70
    },
    recommended_requirements: {
      cpu: "Intel Core i7-12700 / AMD Ryzen 7 7800X3D",
      gpu: "NVIDIA RTX 2060 SUPER / AMD RX 5700 XT",
      ram: 16,
      storage: 70
    }
  },
  {
    id: "grand-theft-auto-v",
    name: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    background_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    released: "2013-09-17",
    genres: [{ name: "Sandbox" }, { name: "Action" }],
    minimum_requirements: {
      cpu: "Intel Core 2 Quad Q6600 / AMD Phenom 9850",
      gpu: "NVIDIA 9800 GT 1GB / AMD HD 4870",
      ram: 4,
      storage: 72
    },
    recommended_requirements: {
      cpu: "Intel Core i5-3470 / AMD FX-8350",
      gpu: "NVIDIA GTX 660 2GB / AMD HD 7870",
      ram: 8,
      storage: 72
    }
  },
  {
    id: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    background_image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    released: "2018-10-26",
    genres: [{ name: "Adventure" }, { name: "Action" }],
    minimum_requirements: {
      cpu: "Intel Core i5-2500K / AMD FX-6300",
      gpu: "NVIDIA GTX 770 2GB / AMD R9 280",
      ram: 8,
      storage: 150
    },
    recommended_requirements: {
      cpu: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
      gpu: "NVIDIA GTX 1060 6GB / AMD RX 480",
      ram: 12,
      storage: 150
    }
  }
];

// Dedicated (Home) Consoles Database
export const CONSOLE_BRANDS = [
  { id: "sony", name: "Sony PlayStation" },
  { id: "microsoft", name: "Microsoft Xbox" },
  { id: "nintendo", name: "Nintendo" },
  { id: "sega", name: "Sega" },
  { id: "apple", name: "Apple Gaming" }
];

export const CONSOLE_MODELS: Record<string, ConsolePreset[]> = {
  sony: [
    {
      id: "ps5-pro",
      name: "PlayStation 5 Pro",
      cpu: "Custom 8-core AMD Zen 2 (3.85GHz Boost)",
      gpu: "AMD RDNA RGA custom (16.7 TFLOPS Core, 33.5 TFLOPS dual issue)",
      ram: "16GB GDDR6 (Shared) + 2GB DDR5 dedicated system cache",
      vram: "Shared 16GB VRAM Allocation",
      storage: "2TB Custom High-speed Gen4 NVMe",
      cpuScore: 8.5,
      gpuScore: 9.0,
      ramGB: 16,
      vramGB: 12,
      storageGB: 2000,
      storageType: "NVMe SSD",
      overallRating: 92,
      explanation: "تعتبر أقوى منصة كونسول منزلية حالياً. تدعم تتبع الأشعة المتقدم وميزة تقريب الدقة الذكية PSSR لتوليد إطارات عالية على دقة 4K."
    },
    {
      id: "ps5",
      name: "PlayStation 5 / Slim",
      cpu: "Custom 8-core AMD Zen 2 (3.5GHz)",
      gpu: "AMD RDNA 2 Custom (10.28 TFLOPS)",
      ram: "16GB GDDR6 (Shared)",
      vram: "Shared 16GB Allocation",
      storage: "825GB / 1TB Ultra-fast NVMe SSD",
      cpuScore: 8.0,
      gpuScore: 8.0,
      ramGB: 16,
      vramGB: 10,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 85,
      explanation: "منصة الجيل الحالي الممتازة للألعاب بدقة 4K/60FPS أو 120FPS للألعاب التنافسية مع رصيد هائل من الألعاب الحصرية."
    },
    {
      id: "ps4-pro",
      name: "PlayStation 4 Pro",
      cpu: "8-core AMD Jaguar (2.13GHz)",
      gpu: "AMD Radeon Custom GCN 4.0 (4.2 TFLOPS)",
      ram: "8GB GDDR5 + 1GB DDR3 RAM",
      vram: "8GB Shared",
      storage: "1TB HDD / Upgradeable SATA SSD",
      cpuScore: 4.5,
      gpuScore: 5.5,
      ramGB: 8,
      vramGB: 6,
      storageGB: 1000,
      storageType: "SATA SSD",
      overallRating: 58,
      explanation: "منصة رائعة قادرة على تشغيل ألعاب الجيل الماضي المطور بدقة 4K ديناميكية ومعدل إطارات مستقر 30-60 إطار بالثانية."
    },
    {
      id: "ps4",
      name: "PlayStation 4 (Standard/Slim)",
      cpu: "8-core AMD Jaguar (1.6GHz)",
      gpu: "AMD Radeon GCN (1.84 TFLOPS)",
      ram: "8GB GDDR5",
      vram: "8GB Shared",
      storage: "500GB / 1TB SATA HDD",
      cpuScore: 3.5,
      gpuScore: 4.0,
      ramGB: 8,
      vramGB: 4,
      storageGB: 500,
      storageType: "SATA HDD",
      overallRating: 44,
      explanation: "أكثر منصة مبيعاً بالجيل الماضي. تشغل آلاف العناوين بدقة 1080p بمعدل إطارات مقفل 30 إطار بالثانية."
    },
    {
      id: "ps3",
      name: "PlayStation 3 (FAT / Slim / SuperSlim)",
      cpu: "Cell Broadband Engine (3.2GHz 1-PPE 7-SPEs)",
      gpu: "NVIDIA RSX 'Reality Synthesizer' (256MB)",
      ram: "256MB XDR Main RAM",
      vram: "256MB GDDR3 VRAM",
      storage: "20GB - 500GB HDD",
      cpuScore: 2.5,
      gpuScore: 2.0,
      ramGB: 0.512,
      vramGB: 0.256,
      storageGB: 250,
      storageType: "SATA HDD",
      overallRating: 25,
      explanation: "معمارية معقدة جداً تميزت بمعالج الخلية العملاق. تشغيل دقة 720p مستقرة."
    },
    {
      id: "ps2",
      name: "PlayStation 2",
      cpu: "Emotion Engine (294.9MHz)",
      gpu: "Graphics Synthesizer (147MHz)",
      ram: "32MB RDRAM System Memory",
      vram: "4MB eDRAM Virtual Graphics Page Cache",
      storage: "8MB Sony Memory Card",
      cpuScore: 1.2,
      gpuScore: 1.0,
      ramGB: 0.032,
      vramGB: 0.004,
      storageGB: 0.008,
      storageType: "Memory Card",
      overallRating: 12,
      explanation: "جهاز الكونسول الأكثر مبيعاً في التاريخ! تشغيل ألعاب العصر الذهبي عبر أقراص DVD وبسرعة خرافية."
    },
    {
      id: "ps1",
      name: "PlayStation 1 (PSX / One)",
      cpu: "32-bit LSI R3000A RISC (33.86MHz)",
      gpu: "Sony Video Transformation Engine",
      ram: "2MB Main System Memory",
      vram: "1MB Dual-Port VRAM Block",
      storage: "1MB Memory Card Socket Space",
      cpuScore: 0.5,
      gpuScore: 0.3,
      ramGB: 0.002,
      vramGB: 0.001,
      storageGB: 0.001,
      storageType: "Memory Card",
      overallRating: 5,
      explanation: "تاريخ الألعاب ثلاثية الأبعاد الحقيقية بدأ هنا. ألعاب أيقونية ومحركات ريفولوشن عتيقة."
    },
    {
      id: "ps-tv",
      name: "PlayStation TV / Vita TV",
      cpu: "4-core ARM Cortex-A9 MPCore (444MHz)",
      gpu: "PowerVR SGX543MP4+ (4-core, 111-200MHz)",
      ram: "512MB System memory",
      vram: "128MB Dedicated VRAM",
      storage: "1GB Internal + Vita Memory Slot Available",
      cpuScore: 2.0,
      gpuScore: 1.8,
      ramGB: 0.512,
      vramGB: 0.128,
      storageGB: 16,
      storageType: "Memory Card",
      overallRating: 20,
      explanation: "تلفاز بلايستيشن المحمول مصمم لتجربة ألعاب الفيتا والبي اس بي عبر منفذ HDMI للتلفزيون مباشرة."
    }
  ],
  microsoft: [
    {
      id: "xbox-series-x",
      name: "Xbox Series X",
      cpu: "8-Core Custom AMD Zen 2 (3.8GHz)",
      gpu: "Custom RDNA 2 (12 TFLOPS, 52 CUs at 1.825GHz)",
      ram: "16GB GDDR6 Memory Bus Allocation",
      vram: "10GB Fast shared / 6GB Standard allocation",
      storage: "1TB Custom High Speed NVMe SSD",
      cpuScore: 8.5,
      gpuScore: 8.5,
      ramGB: 16,
      vramGB: 10,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 90,
      explanation: "المنصة الرائدة والأقوى لعلامة إكس بوكس. مصممة لتجربة ألعاب بدقة 4K حقيقية مع ميزة استئناف اللعب السريع Quick Resume."
    },
    {
      id: "xbox-series-s",
      name: "Xbox Series S",
      cpu: "8-Core Custom AMD Zen 2 (3.6GHz)",
      gpu: "Custom RDNA 2 (4 TFLOPS, 20 CUs at 1.565GHz)",
      ram: "10GB GDDR6 Memory",
      vram: "8GB Fast Shared / 2GB System Only",
      storage: "512GB / 1TB Custom NVMe SSD",
      cpuScore: 7.8,
      gpuScore: 6.8,
      ramGB: 10,
      vramGB: 6,
      storageGB: 512,
      storageType: "NVMe SSD",
      overallRating: 78,
      explanation: "أفضل قيمة تشغيل لكونسول للجيل الحالي. مثالي لدقة 1080p أو 1440p ويعتمد على التخزين الرقمي السريع بالكامل."
    },
    {
      id: "xbox-one-x",
      name: "Xbox One X",
      cpu: "8-core Custom AMD CPU at 2.3 GHz",
      gpu: "AMD Radeon Polaris Custom Architecture (6 TFLOPS)",
      ram: "12GB GDDR5 Unified Engine Memory",
      vram: "9GB Shared for Game Graphics",
      storage: "1TB HDD with High-bandwidth Bus",
      cpuScore: 4.8,
      gpuScore: 6.0,
      ramGB: 12,
      vramGB: 9,
      storageGB: 1000,
      storageType: "SATA HDD",
      overallRating: 62,
      explanation: "أقوى جهاز في جيل الكونسول السابق. يوفر دقة 4K حقيقية مع دعم كامل للأقراص وخلفية توافق تاريخية ضخمة."
    },
    {
      id: "xbox-one-s",
      name: "Xbox One S",
      cpu: "8-core Custom AMD CPU at 1.75 GHz",
      gpu: "AMD Radeon Custom (1.4 TFLOPS)",
      ram: "8GB DDR3 + 32MB ESRAM Speed Buffering",
      vram: "8GB Shared (slow DDR3 block)",
      storage: "500GB - 2TB Internal HDD",
      cpuScore: 3.6,
      gpuScore: 3.5,
      ramGB: 8,
      vramGB: 3,
      storageGB: 1000,
      storageType: "SATA HDD",
      overallRating: 42,
      explanation: "منصة رائعة تدعم تشغيل الألعاب بدقة FHD، وتدعم تشغيل الأفلام بدقة 4K وقارئ أقراص Ultra-HD Blu-ray."
    },
    {
      id: "xbox-360",
      name: "Xbox 360 (FAT / Elite / Slim)",
      cpu: "3.2GHz IBM Xenon (3-Core PowerPC Core Class)",
      gpu: "ATI Xenos Custom Engine GPU (512MB)",
      ram: "512MB GDDR3 Multi-port Unified RAM",
      vram: "10MB Embedded DRAM Framebuffer Cache",
      storage: "20GB - 500GB Upgradeable HDD",
      cpuScore: 2.5,
      gpuScore: 2.2,
      ramGB: 0.512,
      vramGB: 0.10,
      storageGB: 250,
      storageType: "SATA HDD",
      overallRating: 28,
      explanation: "المنصة الذهبية التي أطلقت شبكة إكس بوكس ليف بشكل عملاق لتغيير خارطة الألعاب التنافسية بالكامل."
    },
    {
      id: "xbox-original",
      name: "Xbox Original (الأول)",
      cpu: "Intel Pentium III Custom Processor at 733MHz",
      gpu: "NVIDIA NV2A Xbox Sound and Graphics Engine",
      ram: "64MB DDR System memory",
      vram: "64MB Unified Architecture Size",
      storage: "8GB / 10GB Built-in Mechanical Disk",
      cpuScore: 1.5,
      gpuScore: 1.3,
      ramGB: 0.064,
      vramGB: 0.064,
      storageGB: 8,
      storageType: "SATA HDD",
      overallRating: 15,
      explanation: "أول دخول أمريكي رسمي لمجال الكونسول بواسطة شركة مايكروسوفت مدمجاً بقرص صلب داخلي وقدرة لا تضاهى تقليلاً لعنق الزجاجة."
    }
  ],
  nintendo: [
    {
      id: "switch",
      name: "Nintendo Switch (V1/V2/OLED)",
      cpu: "NVIDIA Custom Tegra X1 (4-core ARM Cortex-A57)",
      gpu: "NVIDIA Maxwell-based GPU (256 Cores)",
      ram: "4GB LPDDR4 Memory Core",
      vram: "Shared 4GB System Memory",
      storage: "32GB / 64GB High Speed eMMC Cache",
      cpuScore: 3.5,
      gpuScore: 3.5,
      ramGB: 4,
      vramGB: 2,
      storageGB: 64,
      storageType: "eMMC Storage",
      overallRating: 45,
      explanation: "المنصة الهجينة الأكثر شعبية بالعالم. تقدم متعة متوازنة جداً بين الألعاب الفردية والألعاب العائلية والجماعية الفورية."
    },
    {
      id: "wii-u",
      name: "Nintendo Wii U",
      cpu: "IBM Espresso Tri-Core running at 1.24GHz",
      gpu: "AMD Radeon 'Latte' GPGPU Engine Size",
      ram: "2GB DDR3 Main System Memory",
      vram: "32MB Embedded eDRAM",
      storage: "8GB / 32GB Internal Flash Drive",
      cpuScore: 2.5,
      gpuScore: 2.2,
      ramGB: 2,
      vramGB: 0.512,
      storageGB: 32,
      storageType: "Flash",
      overallRating: 29,
      explanation: "أول كونسول من نينتندو يدعم الصورة فائقة الدقة بفضل المعالج الرسومي AMD ومرفقاً بشاشة تحكم لوحية ممتازة."
    },
    {
      id: "wii",
      name: "Nintendo Wii",
      cpu: "IBM 'Broadway' PowerPC Processor at 729MHz",
      gpu: "ATI 'Hollywood' GPU with 3MB Embedded eDRAM",
      ram: "88MB Unified System RAM Block",
      vram: "24MB Dedicated 1T-SRAM Board",
      storage: "512MB Built-in Flash Memory System",
      cpuScore: 1.8,
      gpuScore: 1.4,
      ramGB: 0.088,
      vramGB: 0.024,
      storageGB: 0.512,
      storageType: "Flash",
      overallRating: 18,
      explanation: "الجهاز الأيقوني بنظام كشف الحركة الاستثنائي الذي غيّر طريقة لعب العائلات والأصدقاء في العقد الماضي."
    },
    {
      id: "gamecube",
      name: "Nintendo GameCube",
      cpu: "IBM 'Gekko' PowerPC Processor at 485MHz",
      gpu: "ATI 'Flipper' Custom 3D Processor",
      ram: "40MB Unified High-speed System RAM",
      vram: "16MB Integrated DRAM Frame Cache",
      storage: "Nintendo Proprietary Optical Disc & Card Support",
      cpuScore: 1.4,
      gpuScore: 1.2,
      ramGB: 0.040,
      vramGB: 0.016,
      storageGB: 0.016,
      storageType: "Memory Card",
      overallRating: 14,
      explanation: "تحفة هندسية بشكل المكعب الكلاسيكي الممتع ومجموعة ألعاب ذات وزن ثقيل كـ Zelda و Super Smash."
    },
    {
      id: "n64",
      name: "Nintendo 64",
      cpu: "NEC VR4300 64-bit RISC running at 93.75MHz",
      gpu: "SGI Reality Coprocessor Custom ASIC 64-bit",
      ram: "4MB RDRAM (Expanded up to 8MB via Expansion Pak)",
      vram: "Shared 4MB System Architecture Memory",
      storage: "Nintendo 64 Game Cartridge Block",
      cpuScore: 0.8,
      gpuScore: 0.6,
      ramGB: 0.004,
      vramGB: 0.004,
      storageGB: 0.064,
      storageType: "Cartridge",
      overallRating: 8,
      explanation: "انطلاقة ألعاب نينتندو الثلاثية الأبعاد الكلاسيكية بدقة ثورية وأربعة منافذ تحكم جاهزة للاستمتاع الفوري."
    },
    {
      id: "snes",
      name: "Super Nintendo (SNES)",
      cpu: "Ricoh 5A22 custom 16-bit processor (3.58MHz)",
      gpu: "S-PPU1 and S-PPU2 custom graphics chip",
      ram: "128KB System RAM",
      vram: "64KB VRAM + 64KB Sound RAM",
      storage: "Game Cartridge with ROM Storage Space",
      cpuScore: 0.4,
      gpuScore: 0.2,
      ramGB: 0.000128,
      vramGB: 0.000064,
      storageGB: 0.004,
      storageType: "Cartridge",
      overallRating: 4,
      explanation: "ملك الألعاب ثنائية الأبعاد بدقة بصرية مذهلة ومؤثرات صوتية رائدة لعصر التسعينات الحافل بالإمتاع."
    },
    {
      id: "nes",
      name: "Nintendo Entertainment System (NES / كمبيوتر العائلة)",
      cpu: "Ricoh 2A03 8-bit CPU running at 1.79MHz",
      gpu: "Ricoh Picture Processing Unit (PPU) Custom Chip",
      ram: "2KB Internal Work Main RAM",
      vram: "2KB Video RAM + Optional MMC expansion",
      storage: "Family Game Cartridge Storage Drive",
      cpuScore: 0.2,
      gpuScore: 0.1,
      ramGB: 0.000002,
      vramGB: 0.000002,
      storageGB: 0.001,
      storageType: "Cartridge",
      overallRating: 2,
      explanation: "المنصة الكلاسيكية التي أنقذت قطاع الألعاب بأكمله في الثمانينات بقائمة ألعاب تاريخية كـ Super Mario."
    }
  ],
  sega: [
    {
      id: "dreamcast",
      name: "Sega Dreamcast",
      cpu: "Hitachi SH-4 32-bit RISC running at 200MHz",
      gpu: "NEC PowerVR2 CLX2 3D Graphics ASIC",
      ram: "16MB Main SDRAM + 2MB Visual RAM",
      vram: "8MB Unified Video RAM Block",
      storage: "1.2GB GD-ROM Dual Density Media format",
      cpuScore: 1.6,
      gpuScore: 1.4,
      ramGB: 0.016,
      vramGB: 0.008,
      storageGB: 0.001,
      storageType: "Memory Card",
      overallRating: 16,
      explanation: "آخر كونسول من شركة سيجا وبوابة حقيقية لعصر ألعاب الأركيد والشاشات المنزلية عالية التفاصيل ونظام التوصيل الهاتفي."
    },
    {
      id: "sega-saturn",
      name: "Sega Saturn",
      cpu: "Dual Hitachi SH-2 32-bit RISC at 28.6MHz",
      gpu: "VDP1 3D Geometry and Sprite Processor",
      ram: "2MB Main system memory block",
      vram: "1.5MB Graphics engine VRAM",
      storage: "CD-ROM game media storage",
      cpuScore: 1.2,
      gpuScore: 1.0,
      ramGB: 0.002,
      vramGB: 0.0015,
      storageGB: 0.001,
      storageType: "Memory Card",
      overallRating: 11,
      explanation: "أقوى معمارية خرافية ثنائية الأبعاد ممتازة في صالات الأركيد، لكن كانت صعبة البرمجة نظراً لتصميم المعالجة المتوازي."
    },
    {
      id: "genesis",
      name: "Sega Genesis / Mega Drive",
      cpu: "Motorola 68000 16-bit processor running at 7.67MHz",
      gpu: "Sega Video Display Processor (VDP)",
      ram: "64KB System RAM + 8KB Sound memory",
      vram: "64KB Dedicated Video Memory Buffer",
      storage: "Sega ROM Cartridge Engine Board",
      cpuScore: 0.5,
      gpuScore: 0.3,
      ramGB: 0.000064,
      vramGB: 0.000064,
      storageGB: 0.004,
      storageType: "Cartridge",
      overallRating: 5,
      explanation: "غريم نينتندو التاريخي وأقوى مشغل ألعاب من سيجا قدّم تجارب سريعة كـ Sonic بفضل ميزة التفوق الصوتي والبصري."
    },
    {
      id: "master-system",
      name: "Sega Master System",
      cpu: "Zilog Z80 8-bit CPU running at 3.58MHz",
      gpu: "Sega Video Display Processor (VDP) Chip",
      ram: "8KB System Main RAM Board",
      vram: "16KB Video Display Generator Buffer",
      storage: "Game Card & Cartridge Support System",
      cpuScore: 0.2,
      gpuScore: 0.1,
      ramGB: 0.000008,
      vramGB: 0.000016,
      storageGB: 0.001,
      storageType: "Cartridge",
      overallRating: 2,
      explanation: "منصة سيجا القديمة كلاسيكية 8-بت اشتهرت في أوروبا والشرق الأوسط بألعابها المسلية ومنافستها لعائلة نينتندو."
    }
  ],
  apple: [
    {
      id: "apple-tv",
      name: "Apple TV 4K (A15 Bionic Profile)",
      cpu: "Apple A15 Bionic Hexa-Core Silicon Class",
      gpu: "Apple custom 5-core Graphics Processing",
      ram: "4GB LPDDR4X Memory Size",
      vram: "Shared System Memory Allocation",
      storage: "64GB / 128GB High Speed Flash Memory",
      cpuScore: 6.5,
      gpuScore: 5.5,
      ramGB: 4,
      vramGB: 2,
      storageGB: 128,
      storageType: "Flash",
      overallRating: 55,
      explanation: "منصة ترفيه ممتازة تمكن المشتركين من تشغيل ألعاب متجر Apple Arcade بدقة 4K تزامناً ومع معالجة رسومية ناعمة وسلسة."
    },
    {
      id: "pippin",
      name: "Apple Bandai Pippin (Classic)",
      cpu: "PowerPC 603 RISC processor running at 66MHz",
      gpu: "Apple custom Video and Frame Buffer System",
      ram: "6MB Standard main memory block",
      vram: "1MB Video Storage Page Allocation",
      storage: "4x Speed CD-ROM Reader System",
      cpuScore: 0.6,
      gpuScore: 0.4,
      ramGB: 0.006,
      vramGB: 0.001,
      storageGB: 0.002,
      storageType: "Memory Card",
      overallRating: 6,
      explanation: "المنصة الكلاسيكية العتيقة النادرة التي طورتها شركة Apple بالتعاون مع Bandai في منتصف التسعينات لعصر الوسائط المتعددة."
    }
  ]
};

// Handheld Console Brands and Presets Dataset
export const HANDHELD_BRANDS = [
  { id: "sony_handheld", name: "Sony PS Handhelds" },
  { id: "nintendo_handheld", name: "Nintendo Handhelds" },
  { id: "sega_handheld", name: "Sega Retro Handheld" },
  { id: "valve", name: "Valve Steam Deck" },
  { id: "asus", name: "ASUS ROG Ally" },
  { id: "lenovo", name: "Lenovo Gaming" },
  { id: "msi", name: "MSI Intel" }
];

export const HANDHELD_MODELS: Record<string, ConsolePreset[]> = {
  sony_handheld: [
    {
      id: "ps-vita",
      name: "PlayStation Vita (V1000/Slender)",
      cpu: "4-core ARM Cortex-A9 MPCore up to 444MHz",
      gpu: "SGX543MP4+ (4 cores at 111MHz, 128MB)",
      ram: "512MB RAM Memory Engine",
      vram: "128MB Dedicated Visual Memory Cache",
      storage: "Sony Vita Memory Card slot (8GB-64GB)",
      cpuScore: 2.2,
      gpuScore: 2.0,
      ramGB: 0.512,
      vramGB: 0.128,
      storageGB: 32,
      storageType: "Memory Card",
      overallRating: 25,
      explanation: "تحفة سوني الهندسية المحمولة بشاشة OLED أو LCD فائقة النضرة وسطي تشغيل لمسي بالكامل مع ألعاب مذهلة كـ Uncharted."
    },
    {
      id: "psp",
      name: "PlayStation Portable (PSP 1000/2000/3000/Go)",
      cpu: "MIPS R4000 custom processor running at 1-333MHz",
      gpu: "Sega/Sony Custom 3D Graphics Core",
      ram: "32MB (Standard 1000) / 64MB (Slim Models)",
      vram: "4MB Embedded DRAM Graphics Buffer",
      storage: "Memory Stick PRO Duo Board space",
      cpuScore: 1.2,
      gpuScore: 1.0,
      ramGB: 0.064,
      vramGB: 0.004,
      storageGB: 16,
      storageType: "Memory Card",
      overallRating: 12,
      explanation: "الجهاز الهجين الرائد الأكثر شهرة الذي أدخل جودة ألعاب البلايستيشن الضخمة للجيب بواسطة أقراص UMD الرائعة."
    }
  ],
  nintendo_handheld: [
    {
      id: "switch-oled",
      name: "Nintendo Switch OLED / Lite",
      cpu: "Custom Nvidia Tegra X1 Octa-Core Processor",
      gpu: "Nvidia GM20B Maxwell Graphic Core with 256 CUDA cores",
      ram: "4GB Shared system RAM Memory",
      vram: "Shared 4GB Block Buffer",
      storage: "64GB High Capacity eMMC Storage",
      cpuScore: 3.5,
      gpuScore: 3.5,
      ramGB: 4,
      vramGB: 2,
      storageGB: 64,
      storageType: "eMMC Storage",
      overallRating: 46,
      explanation: "النسخة فائقة النقاء لمشغل نينتندو الهجين بشاشة OLED نابضة بالحياة وأحدث توافق للألعاب المحمولة."
    },
    {
      id: "3ds",
      name: "Nintendo 3DS / New 3DS XL",
      cpu: "Dual-Core ARM11 running up to 268MHz (New: 4-Core 804MHz)",
      gpu: "DMP PICA200 custom graphics chip (64MHz, 6MB)",
      ram: "128MB RAM Buffer (New: 256MB)",
      vram: "6MB High Speed Frame buffer Block",
      storage: "Upgradeable SD/MicroSD Card Support",
      cpuScore: 2.0,
      gpuScore: 1.5,
      ramGB: 0.256,
      vramGB: 0.006,
      storageGB: 32,
      storageType: "Memory Card",
      overallRating: 22,
      explanation: "قاد تكنولوجيا العرض ثلاثية الأبعاد دون الحاجة لنظارة مخصصة وامتلك مكتبة ألعاب كلاسيكية لا تقهر."
    },
    {
      id: "ds",
      name: "Nintendo DS / DS Lite / DSi",
      cpu: "Dual Core processing: ARM9 (67MHz) & ARM7 (33MHz)",
      gpu: "Nintendo Custom 2D/3D dual engine system",
      ram: "4MB RAM Ring Buffer",
      vram: "656KB VRAM integrated board cache",
      storage: "Nintendo DS Game Card Storage System",
      cpuScore: 1.0,
      gpuScore: 0.8,
      ramGB: 0.004,
      vramGB: 0.00065,
      storageGB: 0.032,
      storageType: "Cartridge",
      overallRating: 10,
      explanation: "جهاز الشاشتين وقلم اللمس الأسطوري صاحب ثاني أضخم مبيعات أجهزة ألعاب في التاريخ البشري بالمتعة والابتكار."
    },
    {
      id: "gba",
      name: "Game Boy Advance (GBA / SP / Micro)",
      cpu: "ARM7TDMI 32-bit RISC running at 16.78MHz",
      gpu: "Integrated Custom Display Generator Module",
      ram: "32KB internal WRAM + 256KB External WRAM Board",
      vram: "96KB Dedicated Graphics Engine VRAM",
      storage: "GBA ROM Game Cartridge Block",
      cpuScore: 0.5,
      gpuScore: 0.3,
      ramGB: 0.000288,
      vramGB: 0.000096,
      storageGB: 0.004,
      storageType: "Cartridge",
      overallRating: 5,
      explanation: "صاحب أفضل ذكريات الألعاب الكلاسيكية ثنائية الأبعاد بدقة 16-بت الغنية والملونة بتفاصيل مبهرة تثير الشغف."
    },
    {
      id: "gb",
      name: "Game Boy (الأول/الملون/الجيب/Pocket)",
      cpu: "Sharp LR35902 8-bit custom CPU (4.19MHz)",
      gpu: "Integrated LCD Display Engine System",
      ram: "8KB Work RAM Block",
      vram: "8KB Integrated Video Display Buffer",
      storage: "Game Boy Original game Cartridge",
      cpuScore: 0.15,
      gpuScore: 0.08,
      ramGB: 0.000008,
      vramGB: 0.000008,
      storageGB: 0.001,
      storageType: "Cartridge",
      overallRating: 1,
      explanation: "المشغل الأسطوري للثمانينات الذي بدأ مجرة كاملة من الألعاب المتنقلة بأطول معدل استدامة للبطارية."
    }
  ],
  sega_handheld: [
    {
      id: "game-gear",
      name: "Sega Game Gear",
      cpu: "Zilog Z80 8-bit CPU running at 3.58MHz",
      gpu: "Custom Sega Graphics engine (16KB)",
      ram: "8KB System memory allocation",
      vram: "16KB video display processor RAM",
      storage: "Sega Handheld Game Cartridge Media Core",
      cpuScore: 0.2,
      gpuScore: 0.1,
      ramGB: 0.000008,
      vramGB: 0.000016,
      storageGB: 0.002,
      storageType: "Cartridge",
      overallRating: 2,
      explanation: "جهاز سيجا الملون المحمول المميز، امتلك شاشة مضيئة ممتازة من خلف للعب في الظلام لكنه كان يستهلك البطاريات بسرعة."
    }
  ],
  valve: [
    {
      id: "steam-deck-oled",
      name: "Steam Deck OLED (1TB custom)",
      cpu: "Custom AMD Zen 2 (4 Cores / 8 Threads, up to 3.5GHz)",
      gpu: "AMD RDNA 2 custom (8 CUs up to 1.6GHz, 1.6 TFLOPS)",
      ram: "16GB LPDDR5 Unified memory at 6400MT/s",
      vram: "Up to 8GB dynamically shared allocations",
      storage: "1TB PCIe Gen4 NVMe high speed solid state",
      cpuScore: 7.2,
      gpuScore: 7.0,
      ramGB: 16,
      vramGB: 8,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 80,
      explanation: "أفضل دمج رائع لنظام لود ستيم في شاشة OLED محترفة ومعدل استغلال طاقة مستقر وقدرة ممتازة لتشغيل العناوين الضخمة."
    },
    {
      id: "steam-deck-lcd",
      name: "Steam Deck LCD",
      cpu: "Custom AMD Zen 2 (4 Cores / 8 Threads, up to 3.5GHz)",
      gpu: "AMD RDNA 2 custom (8 CUs up to 1.6GHz, 1.6 TFLOPS)",
      ram: "16GB LPDDR5 Unified memory at 5500MT/s",
      vram: "Shared System Memory size",
      storage: "256GB / 512GB NVMe SSD Drive",
      cpuScore: 6.8,
      gpuScore: 6.5,
      ramGB: 16,
      vramGB: 6,
      storageGB: 512,
      storageType: "NVMe SSD",
      overallRating: 75,
      explanation: "النسخة الأساسية من صمام ستيم التي زعزعت سوق الألعاب المحمولة ومكنت ملاك الـ PC من لعب ألعابهم بالجيب."
    }
  ],
  asus: [
    {
      id: "rog-ally-x",
      name: "ASUS ROG Ally X (أحدث كلاس)",
      cpu: "AMD Ryzen Z1 Extreme (8 Cores / 16 Threads, Zen 4)",
      gpu: "AMD Radeon 780M (12 CUs RDNA 3 up to 2.7GHz, 8.6 TFLOPS)",
      ram: "24GB LPDDR5X dual channel at 7500MT/s",
      vram: "Up to 12GB dynamically shared scale",
      storage: "1TB Gen4 NVMe M.2 Solid State",
      cpuScore: 8.8,
      gpuScore: 8.2,
      ramGB: 24,
      vramGB: 8,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 88,
      explanation: "أقوى ترقية للأجهزة المحمولة بـ 24 جيجا رام وبطارية ضخمة جداً لتفادي عجز الطاقة وأداء أسرع للألعاب بدقة 1080p."
    },
    {
      id: "rog-ally-extreme",
      name: "ASUS ROG Ally (Ryzen Z1 Extreme)",
      cpu: "AMD Ryzen Z1 Extreme with 8-cores/16-threads architecture",
      gpu: "AMD Radeon 780M RDNA 3 graphics system",
      ram: "16GB LPDDR5 Dual-port high performance RAM",
      vram: "Shared system memory setup (default 4GB)",
      storage: "512GB PCIe Gen4 M.2 NVMe SSD",
      cpuScore: 8.4,
      gpuScore: 7.8,
      ramGB: 16,
      vramGB: 4,
      storageGB: 512,
      storageType: "NVMe SSD",
      overallRating: 82,
      explanation: "جهاز رائع بشاشة FHD بتردد 120HZ ودعم كامل لنظام ويندوز 11 لتشغيل جميع منصات الألعاب المتاحة."
    }
  ],
  lenovo: [
    {
      id: "legion-go",
      name: "Lenovo Legion Go",
      cpu: "AMD Ryzen Z1 Extreme with 8-cores up to 5.1GHz",
      gpu: "AMD Radeon 780M Custom RDNA 3 Graphics processor",
      ram: "16GB LPDDR5X running at 7500MHz Speed link",
      vram: "4GB to 8GB Unified setting selection",
      storage: "512GB / 1TB Custom Gen4 SSD Drive slot",
      cpuScore: 8.5,
      gpuScore: 7.8,
      ramGB: 16,
      vramGB: 6,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 83,
      explanation: "شاشة عملاقة ومذهلة بدقة 2.5K وحجم 8.8 بوصة قابلة للفصل ووحدة تحكم تدعم وضعية التصويب المتقدمة FPS."
    }
  ],
  msi: [
    {
      id: "msi-claw",
      name: "MSI Claw (Intel Core Ultra 7)",
      cpu: "Intel Core Ultra 7 155H (16 Cores / 22 Threads)",
      gpu: "Intel Arc Graphics custom engine integrated (2.25GHz)",
      ram: "16GB LPDDR5 Unified memory system",
      vram: "Dynamically pooled system memory allocation",
      storage: "1TB M.2 solid state high performance storage",
      cpuScore: 8.2,
      gpuScore: 7.5,
      ramGB: 16,
      vramGB: 4,
      storageGB: 1000,
      storageType: "NVMe SSD",
      overallRating: 81,
      explanation: "أول جهاز ألعاب محمول يعتمد بالكامل على معالجة Intel Ultra المتطورة بتقنية تحسين الرندرة XeSS المتقدمة."
    }
  ]
};

export interface AppleTreeNode {
  id: string;
  name: string;
  name_ar: string;
  chip: string;
  ram: number;
  vram: number;
  cpuScore: number;
  gpuScore: number;
  explanation: string;
  explanation_en: string;
}

export const APPLE_DEVICES_TREE: Record<
  string,
  {
    name_ar: string;
    name_en: string;
    generations: Record<
      string,
      {
        name_ar: string;
        name_en: string;
        tiers: Record<string, AppleTreeNode>;
      }
    >;
  }
> = {
  iphone: {
    name_ar: "آيفون (iPhone)",
    name_en: "iPhone Family",
    generations: {
      "iphone-15": {
        name_ar: "سلسلة آيفون 15",
        name_en: "iPhone 15 Series",
        tiers: {
          base: {
            id: "iphone-15-base",
            name: "iPhone 15",
            name_ar: "آيفون 15 (الأساسي)",
            chip: "Apple A16 Bionic (5-Core GPU)",
            ram: 6,
            vram: 3,
            cpuScore: 7.2,
            gpuScore: 7.0,
            explanation: "أداء قوي جداً للألعاب المحمولة القياسية بفضل شريحة A16، ولكن تفتقر لدعم الألعاب الضخمة الأصلية كمحرك Resident Evil 4 بسبب قيود الرام.",
            explanation_en: "Strong performance for premium mobile games with A16 Bionic. Lacks support for high-end native AAA console ports (e.g. Resident Evil 4) due to 6GB RAM limitation."
          },
          plus: {
            id: "iphone-15-plus",
            name: "iPhone 15 Plus",
            name_ar: "آيفون 15 بلس",
            chip: "Apple A16 Bionic (5-Core GPU)",
            ram: 6,
            vram: 3,
            cpuScore: 7.2,
            gpuScore: 7.0,
            explanation: "نفس أداء الهاتف الأساسي مع شاشة أكبر وبطارية أضخم تمنح فترات لعب مستمرة ومستقرة حرارياً.",
            explanation_en: "Identical performance to the base model with a larger screen and beefier battery for thermally stable, extended mobile gaming."
          },
          pro: {
            id: "iphone-15-pro",
            name: "iPhone 15 Pro",
            name_ar: "آيفون 15 برو",
            chip: "Apple A17 Pro (6-Core CPU, 6-Core GPU)",
            ram: 8,
            vram: 4,
            cpuScore: 8.5,
            gpuScore: 8.0,
            explanation: "يدعم ألعاب الفئة الأولى (AAA Console Games) مثل Death Stranding و Assassin's Creed Mirage محلياً. يمثل قوة محمولة رائدة.",
            explanation_en: "Fully supports native custom AAA console ports (Death Stranding, Assassin's Creed Mirage) using hardware ray tracing on A17 Pro."
          },
          promax: {
            id: "iphone-15-pro-max",
            name: "iPhone 15 Pro Max",
            name_ar: "آيفون 15 برو ماكس",
            chip: "Apple A17 Pro (6-Core CPU, 6-Core GPU)",
            ram: 8,
            vram: 4,
            cpuScore: 8.5,
            gpuScore: 8.2,
            explanation: "قمة الهواتف المحمولة يدير ألعاب الكونسول الحديثة مع شاشة مبهرة وثبات حراري أفضل لتجنب خفض تردد المعالجة.",
            explanation_en: "Peak mobile performance. Runs native AAA console games on a sprawling OLED screen with superior thermal bounds to prevent throttling."
          }
        }
      },
      "iphone-14": {
        name_ar: "سلسلة آيفون 14",
        name_en: "iPhone 14 Series",
        tiers: {
          base: {
            id: "iphone-14-base",
            name: "iPhone 14",
            name_ar: "آيفون 14 (الأساسي)",
            chip: "Apple A15 Bionic (5-Core GPU)",
            ram: 6,
            vram: 2.5,
            cpuScore: 6.8,
            gpuScore: 6.5,
            explanation: "يوفر أداءً هائلاً للغالبية الكاسحة من ألعاب متجر التطبيقات والرسوم ثلاثية الأبعاد.",
            explanation_en: "Outstanding processor parameters. Effortlessly handles 99% of modern App Store games with maximum response rates."
          },
          plus: {
            id: "iphone-14-plus",
            name: "iPhone 14 Plus",
            name_ar: "آيفون 14 بلس",
            chip: "Apple A15 Bionic (5-Core GPU)",
            ram: 6,
            vram: 2.5,
            cpuScore: 6.8,
            gpuScore: 6.5,
            explanation: "جودة لعب ممتازة ومستمرة بفضل الشاشة الكبيرة واستقرار استهلاك البطارية.",
            explanation_en: "Excellent display and continuous gaming experience featuring wide pixel rendering and great battery thermal efficiency."
          },
          pro: {
            id: "iphone-14-pro",
            name: "iPhone 14 Pro",
            name_ar: "آيفون 14 برو",
            chip: "Apple A16 Bionic (5-Core GPU)",
            ram: 6,
            vram: 3,
            cpuScore: 7.2,
            gpuScore: 7.0,
            explanation: "شريحة A16 تمنح معالجة رسومية ممتازة وثباتاً هائلاً في معدلات الإطارات للألعاب التنافسية.",
            explanation_en: "A16 Bionic chip delivers brilliant graphics compute and highly competitive locked framerates on heavy 3D mobile games."
          },
          promax: {
            id: "iphone-14-pro-max",
            name: "iPhone 14 Pro Max",
            name_ar: "آيفون 14 برو ماكس",
            chip: "Apple A16 Bionic (5-Core GPU)",
            ram: 6,
            vram: 3,
            cpuScore: 7.2,
            gpuScore: 7.0,
            explanation: "أكبر هواتف جيل 14، تشغيل ممتاز جداً بدقة عالية مع معالجة رصينة تمنع تراجع الإطارات.",
            explanation_en: "Excellent 14-series flagship. Renders games beautifully without rapid battery drains or frame degradation."
          }
        }
      },
      "iphone-13": {
        name_ar: "سلسلة آيفون 13",
        name_en: "iPhone 13 Series",
        tiers: {
          base: {
            id: "iphone-13-base",
            name: "iPhone 13",
            name_ar: "آيفون 13 (الأساسي)",
            chip: "Apple A15 Bionic (4-Core GPU)",
            ram: 4,
            vram: 1.8,
            cpuScore: 6.0,
            gpuScore: 5.8,
            explanation: "معالج A15 غني عن التعريف، تشغيل ممتاز لكافة الألعاب المتوسطة ولكن حجم الرام 4 جيجا قد يغلق التطبيقات الخلفية.",
            explanation_en: "Widely capable A15 chip. Runs all regular games with fast processing, but 4GB RAM causes app reloads in background."
          },
          mini: {
            id: "iphone-13-mini",
            name: "iPhone 13 mini",
            name_ar: "آيفون 13 ميني",
            chip: "Apple A15 Bionic (4-Core GPU)",
            ram: 4,
            vram: 1.5,
            cpuScore: 6.0,
            gpuScore: 5.5,
            explanation: "هاتف ألعاب مدمج ومريح جداً باليد، بالرغم من صغر البطارية التي قد تقلل فترات اللعب المتواصل.",
            explanation_en: "Super compact model. Very ergonomic for casual games, though lower battery capacity limits marathon play."
          },
          pro: {
            id: "iphone-13-pro",
            name: "iPhone 13 Pro",
            name_ar: "آيفون 13 برو",
            chip: "Apple A15 Bionic (5-Core GPU)",
            ram: 6,
            vram: 2.2,
            cpuScore: 6.8,
            gpuScore: 6.5,
            explanation: "أول هاتف آيفون يدعم شاشة ProMotion 120Hz، يقدم تجربة ناعمة للغاية للألعاب التنافسية المحمولة بمعدل إطارات فائق.",
            explanation_en: "First iPhone with ProMotion 120Hz. Delivers high refresh fluid rendering for competitive mobile combat games."
          },
          promax: {
            id: "iphone-13-pro-max",
            name: "iPhone 13 Pro Max",
            name_ar: "آيفون 13 برو ماكس",
            chip: "Apple A15 Bionic (5-Core GPU)",
            ram: 6,
            vram: 2.5,
            cpuScore: 6.8,
            gpuScore: 6.5,
            explanation: "أسطورة عمر البطارية واللعب المستقر دون عنق زجاجة ملحوظ.",
            explanation_en: "Legendary battery device. Phenomenal for mobile gaming with high framerates and zero stutters."
          }
        }
      },
      "iphone-12": {
        name_ar: "سلسلة آيفون 12",
        name_en: "iPhone 12 Series",
        tiers: {
          base: {
            id: "iphone-12-base",
            name: "iPhone 12",
            name_ar: "آيفون 12 (الأساسي)",
            chip: "Apple A14 Bionic",
            ram: 4,
            vram: 1.5,
            cpuScore: 5.5,
            gpuScore: 5.2,
            explanation: "تشغيل ممتاز للألعاب العادية بدقة ممتازة، ترتفع حرارة الهاتف قليلاً تحت الضغوط الطويلة.",
            explanation_en: "Good performance with A14 chip. Heavy sustained 3D games may heat up the device slightly."
          },
          mini: {
            id: "iphone-12-mini",
            name: "iPhone 12 mini",
            name_ar: "آيفون 12 ميني",
            chip: "Apple A14 Bionic",
            ram: 4,
            vram: 1.2,
            cpuScore: 5.5,
            gpuScore: 5.0,
            explanation: "سريعة الاستجابة ولكن حجم البطارية صغير جداً ومناسب فقط لجولات اللعب السريعة والقصيرة.",
            explanation_en: "Very fast but restricted by compact battery. Best suited for quick, casual gaming sessions."
          },
          pro: {
            id: "iphone-12-pro",
            name: "iPhone 12 Pro",
            name_ar: "آيفون 12 برو",
            chip: "Apple A14 Bionic",
            ram: 6,
            vram: 2.0,
            cpuScore: 6.0,
            gpuScore: 5.8,
            explanation: "ذاكرة RAM بحجم 6 جيجا تدعم بشكل كامل تشغيل ألعاب ويندوز بوضعية المحاكاة بكفاءة وثبات.",
            explanation_en: "6GB RAM improves high-spec mobile capabilities with consistent loading and low crashes."
          },
          promax: {
            id: "iphone-12-pro-max",
            name: "iPhone 12 Pro Max",
            name_ar: "آيفون 12 برو ماكس",
            chip: "Apple A14 Bionic",
            ram: 6,
            vram: 2.2,
            cpuScore: 6.0,
            gpuScore: 5.8,
            explanation: "استقرار ممتاز وحجم شاشة عملاق يعطي مساحة عرض وتحكم مريحة للأصابع.",
            explanation_en: "Extremely immersive gaming canvas. Extra screen real-estate provides pristine control mapping comfort."
          }
        }
      },
      "iphone-11": {
        name_ar: "سلسلة آيفون 11",
        name_en: "iPhone 11 Series",
        tiers: {
          base: {
            id: "iphone-11-base",
            name: "iPhone 11",
            name_ar: "آيفون 11 (الأساسي)",
            chip: "Apple A13 Bionic",
            ram: 4,
            vram: 1.5,
            cpuScore: 4.8,
            gpuScore: 4.5,
            explanation: "أداء مقبول جداً للجيل الماضي، يدعم تشغيل Pubg و Genshin Impact على إعدادات منخفضة ومتوسطة مقنعة.",
            explanation_en: "Respectable performance. Still handles major mobile esports titles on medium settings with stable framerates."
          },
          pro: {
            id: "iphone-11-pro",
            name: "iPhone 11 Pro",
            name_ar: "آيفون 11 برو",
            chip: "Apple A13 Bionic",
            ram: 4,
            vram: 1.5,
            cpuScore: 5.0,
            gpuScore: 4.8,
            explanation: "شاشة OLED ممتازة وتوزيع طاقة جيد يحافظ على سلاسة الحركة والتحكم بشكل لائق.",
            explanation_en: "Beautiful OLED screen. A13 chip powers smooth gameplay on standard graphics presets."
          },
          promax: {
            id: "iphone-11-pro-max",
            name: "iPhone 11 Pro Max",
            name_ar: "آيفون 11 برو ماكس",
            chip: "Apple A13 Bionic",
            ram: 4,
            vram: 1.8,
            cpuScore: 5.2,
            gpuScore: 4.8,
            explanation: "بطارية ممتازة جداً وهيكل مريح للعب المتواصل في ألعاب الأركيد وإصدارات المتجر الكلاسيكية.",
            explanation_en: "Incredible battery life in its generation. Great for mobile arcade and standard multiplayer releases."
          }
        }
      },
      "iphone-se": {
        name_ar: "سلسلة آيفون SE الاقتصادية",
        name_en: "iPhone SE Series",
        tiers: {
          gen1: {
            id: "iphone-se-gen1",
            name: "iPhone SE (Gen 1)",
            name_ar: "آيفون SE الجيل الأول (2016)",
            chip: "Apple A9 Dual-Core",
            ram: 2,
            vram: 0.5,
            cpuScore: 1.5,
            gpuScore: 1.2,
            explanation: "عتاد كلاسيكي عتيق للغاية. مناسب فقط للألعاب الكرتونية ثنائية الأبعاد الخفيفة ومحاكاة الألعاب القديمة (Retro Emulation).",
            explanation_en: "Retro scale device. Best limited to simple 2D indie titles, catalog classics, and vintage platform emulators."
          },
          gen2: {
            id: "iphone-se-gen2",
            name: "iPhone SE (Gen 2)",
            name_ar: "آيفون SE الجيل الثاني (2020)",
            chip: "Apple A13 Bionic",
            ram: 3,
            vram: 1.0,
            cpuScore: 4.5,
            gpuScore: 4.2,
            explanation: "يحمل معالج آيفون 11 القوي، لكن يعوقه صغر حجم البطارية الشديد والتحكم على الشاشة البالغة 4.7 بوصة فقط.",
            explanation_en: "Features same A13 processor as iPhone 11, but restricted by low physical battery size and tight 4.7-inch screen canvas."
          },
          gen3: {
            id: "iphone-se-gen3",
            name: "iPhone SE (Gen 3)",
            name_ar: "آيفون SE الجيل الثالث (2022)",
            chip: "Apple A15 Bionic",
            ram: 4,
            vram: 1.5,
            cpuScore: 6.0,
            gpuScore: 5.5,
            explanation: "يحمل معالج آيفون 13 السريع، يدير كافة الألعاب الحديثة بسرعة خارقة لكن في تصميم وهاتف كلاسيكي صغير.",
            explanation_en: "Packed with powerful A15 processor (iPhone 13). Blazing fast gameplay, but layout space is small for fingers."
          }
        }
      }
    }
  },
  macbook_pro: {
    name_ar: "ماك بوك برو (MacBook Pro)",
    name_en: "MacBook Pro Family",
    generations: {
      "m4-chipsets": {
        name_ar: "رقاقات Apple M4",
        name_en: "M4 Chipsets",
        tiers: {
          base: {
            id: "mbp-m4-base",
            name: "MacBook Pro M4 (Base)",
            name_ar: "ماك بوك برو M4 الأساسي",
            chip: "Apple M4 (10-Core CPU, 10-Core GPU)",
            ram: 16,
            vram: 8,
            cpuScore: 8.8,
            gpuScore: 8.0,
            explanation: "جهاز خارق النظارة يدير الألعاب الأصلية (Native) بدقة 1080p بمعدل إطارات يتخطى 80 إطار بالثانية بسهولة تامة بفضل معمارية الرندرة الحديثة.",
            explanation_en: "Incredible modern computing. Plays native titles at medium-high settings above 80FPS using hardware-accelerated mesh shading."
          },
          pro: {
            id: "mbp-m4-pro",
            name: "MacBook Pro M4 Pro",
            name_ar: "ماك بوك برو M4 برو",
            chip: "Apple M4 Pro (12-Core CPU, 16-Core GPU)",
            ram: 24,
            vram: 12,
            cpuScore: 9.5,
            gpuScore: 9.0,
            explanation: "قوة ألعاب ممتازة تضاهي الحواسب المحمولة للألعاب، تدير ألعاباً مثل Cyberpunk 2077 عبر المترجم بمستويات إطارات فائقة السلاسة والدقة.",
            explanation_en: "Excellent dynamic scaling. Rivals traditional heavy specs; runs translated Cyberpunk 2077 with remarkable fluency on high parameters."
          },
          max: {
            id: "mbp-m4-max",
            name: "MacBook Pro M4 Max",
            name_ar: "ماك بوك برو M4 ماكس",
            chip: "Apple M4 Max (16-Core CPU, 40-Core GPU)",
            ram: 48,
            vram: 24,
            cpuScore: 10.0,
            gpuScore: 10.0,
            explanation: "وحش كاسر حقيقي! أقوى شريحة سيليكون محمولة من شركة آبل، تشغيل الألعاب الثقيلة بدقة 4K مع تشغيل تتبع الأشعة بكفاءة مذهلة.",
            explanation_en: "Monster of graphics processing. Most powerful Apple mobile silicon chip; runs heavy AAA blockbusters in full 4K and native ray tracing."
          }
        }
      },
      "m3-chipsets": {
        name_ar: "رقاقات Apple M3",
        name_en: "M3 Chipsets",
        tiers: {
          base: {
            id: "mbp-m3-base",
            name: "MacBook Pro M3 (Base)",
            name_ar: "ماك بوك برو M3 الأساسي",
            chip: "Apple M3 (8-Core CPU, 10-Core GPU)",
            ram: 8,
            vram: 4,
            cpuScore: 8.0,
            gpuScore: 7.2,
            explanation: "تشغيل رائد للألعاب الداعمة لمعمارية آبل، لكن سعة 8 جيجا للرام قد تتسبب ببعض التباطؤ في ألعاب محاكاة الحاسوب المترجمة.",
            explanation_en: "Highly capable setup for native titles, though 8GB RAM restricts heavy emulation containers or extreme textures."
          },
          pro: {
            id: "mbp-m3-pro",
            name: "MacBook Pro M3 Pro",
            name_ar: "ماك بوك برو M3 برو",
            chip: "Apple M3 Pro (12-Core CPU, 18-Core GPU)",
            ram: 18,
            vram: 8,
            cpuScore: 8.8,
            gpuScore: 8.0,
            explanation: "أداء مذهل ومتكامل للعب بدقة 1440p ناعمة مع تبريد نشط ممتاز يمنع أي خنق حراري للقطع.",
            explanation_en: "Outstanding 1440p option. Dual cooling fans keep rendering benchmarks stable without dropping GPU clock speeds."
          },
          max: {
            id: "mbp-m3-max",
            name: "MacBook Pro M3 Max",
            name_ar: "ماك بوك برو M3 ماكس",
            chip: "Apple M3 Max (16-Core CPU, 40-Core GPU)",
            ram: 36,
            vram: 16,
            cpuScore: 9.8,
            gpuScore: 9.8,
            explanation: "قوة قريبة جداً من منصات سطح المكتب الاحترافية لألعاب الفيديو والتحريك ثلاثي الأبعاد.",
            explanation_en: "Extreme processing powerhouse. Destroys translation bottlenecks to render heavy current-gen simulation environments easily."
          }
        }
      },
      "m2-chipsets": {
        name_ar: "رقاقات Apple M2",
        name_en: "M2 Chipsets",
        tiers: {
          base: {
            id: "mbp-m2-base",
            name: "MacBook Pro M2 (Base)",
            name_ar: "ماك بوك برو M2 الأساسي",
            chip: "Apple M2 (8-Core CPU, 10-Core GPU)",
            ram: 8,
            vram: 4,
            cpuScore: 7.5,
            gpuScore: 6.8,
            explanation: "جهاز ممتاز ومستقر، يعطي إطارات جيدة جداً في الألعاب المتوسطة مثل Resident Evil Village.",
            explanation_en: "Very stable. Delivers high framerates on native macOS releases like Resident Evil Village."
          },
          pro: {
            id: "mbp-m2-pro",
            name: "MacBook Pro M2 Pro",
            name_ar: "ماك بوك برو M2 برو",
            chip: "Apple M2 Pro (12-Core CPU, 19-Core GPU)",
            ram: 16,
            vram: 8,
            cpuScore: 8.4,
            gpuScore: 7.8,
            explanation: "ذاكرة RAM بحجم 16 جيجا تدعم بشكل كامل تشغيل ألعاب ويندوز بوضعية المحاكاة بكفاءة وثبات.",
            explanation_en: "16GB configuration easily bridges translation frameworks to yield smooth emulation metrics on older PC ports."
          },
          max: {
            id: "mbp-m2-max",
            name: "MacBook Pro M2 Max",
            name_ar: "ماك بوك برو M2 ماكس",
            chip: "Apple M2 Max (12-Core CPU, 38-Core GPU)",
            ram: 32,
            vram: 16,
            cpuScore: 9.0,
            gpuScore: 8.8,
            explanation: "قوة هائلة وعرض عريض للنطاق الترددي للذاكرة لتقليل عنق زجاجة الإرساء والتحميل الرسومي.",
            explanation_en: "Supreme unified memory capacity. High memory bandwidth completely neutralizes assets injection delays for flawless gameplay."
          }
        }
      },
      "m1-chipsets": {
        name_ar: "رقاقات Apple M1",
        name_en: "M1 Chipsets",
        tiers: {
          base: {
            id: "mbp-m1-base",
            name: "MacBook Pro M1 (Base)",
            name_ar: "ماك بوك برو M1 الأساسي",
            chip: "Apple M1 (8-Core CPU, 8-Core GPU)",
            ram: 8,
            vram: 4,
            cpuScore: 6.8,
            gpuScore: 6.0,
            explanation: "الشريحة الثورية التي بدأت نهضة آبل، قوية جداً للألعاب الخفيفة والألعاب الأصلية على إعدادات منخفضة - متوسطة.",
            explanation_en: "The historic M1 chip. Remains a competent entry-level option for native titles on low-medium settings."
          },
          pro: {
            id: "mbp-m1-pro",
            name: "MacBook Pro M1 Pro",
            name_ar: "ماك بوك برو M1 برو",
            chip: "Apple M1 Pro (10-Core CPU, 16-Core GPU)",
            ram: 16,
            vram: 8,
            cpuScore: 8.0,
            gpuScore: 7.2,
            explanation: "عتاد قوي ومحترم تشغل ألعاباً عديدة وتتميز بمستوى حرارة واستقرار رائع بفضل قوة الأنوية.",
            explanation_en: "Extremely resilient. 16-core GPU delivers smooth performance with solid cooling support."
          },
          max: {
            id: "mbp-m1-max",
            name: "MacBook Pro M1 Max",
            name_ar: "ماك بوك برو M1 ماكس",
            chip: "Apple M1 Max (10-Core CPU, 32-Core GPU)",
            ram: 32,
            vram: 16,
            cpuScore: 8.5,
            gpuScore: 8.2,
            explanation: "قوة هائلة لجيل M1، تنافس في مجالات الألعاب الرسومية المعقدة دون صعوبات.",
            explanation_en: "Huge visual bandwidth. Smooth performance across emulation tiers and heavy visual outputs."
          }
        }
      },
      "intel-legacy": {
        name_ar: "معالجات إنتل جيل قديم (Intel Legacy)",
        name_en: "Intel Legacy Models",
        tiers: {
          i5: {
            id: "mbp-intel-i5",
            name: "MacBook Pro Intel i5",
            name_ar: "ماك بوك برو Intel Core i5",
            chip: "Intel Core i5 (Quad-Core Legacy)",
            ram: 16,
            vram: 2.0,
            cpuScore: 4.0,
            gpuScore: 3.5,
            explanation: "منصة قديمة ذات تبريد صاخب وعنق زجاجة معالج رسومي مدمج بطيء. مناسب للألعاب القديمة وإعدادات رسومية متدنية جداً.",
            explanation_en: "Loud cooling and slow integrated graphics. Only capable of older game catalogs and minimal resolution settings."
          },
          i7: {
            id: "mbp-intel-i7",
            name: "MacBook Pro Intel i7",
            name_ar: "ماك بوك برو Intel Core i7",
            chip: "Intel Core i7 (6-Core Core architecture)",
            ram: 16,
            vram: 4.0,
            cpuScore: 4.8,
            gpuScore: 4.0,
            explanation: "يقدم أداء أفضل بفضل الأنوية الإضافية، لكن يعاني من سخونة شديدة وخنق حراري يقفز بالفريمات للأسفل.",
            explanation_en: "Better multi-core processing, but gets very hot quickly, causing heavy thermal throttling during extended sessions."
          },
          i9: {
            id: "mbp-intel-i9",
            name: "MacBook Pro Intel i9",
            name_ar: "ماك بوك برو Intel Core i9",
            chip: "Intel Core i9 (8-Core Custom)",
            ram: 32,
            vram: 8.0,
            cpuScore: 5.5,
            gpuScore: 4.8,
            explanation: "معالج قوي لكن مروحة الماك بوك لا تكفي لردع حرارته الخرافية. تشغيل الألعاب بطاقة جيدة في الغرف الباردة فقط.",
            explanation_en: "Decent mobile performance but plagued by heavy thermal limitations. Requires active cooling stands or cold environments."
          }
        }
      }
    }
  },
  macbook_air: {
    name_ar: "ماك بوك إير (MacBook Air)",
    name_en: "MacBook Air Family",
    generations: {
      "m3-chipsets": {
        name_ar: "رقاقات Apple M3",
        name_en: "M3 Chipsets",
        tiers: {
          base: {
            id: "mba-m3-base",
            name: "MacBook Air M3 (8GB)",
            name_ar: "ماك بوك إير M3 (8 جيجا رام)",
            chip: "Apple M3 (8-Core CPU, 8-Core GPU)",
            ram: 8,
            vram: 3,
            cpuScore: 7.6,
            gpuScore: 6.5,
            explanation: "أداء فائق السرعة لكافة العناوين، لكن تصميم الجهاز بدون مراوح (Fanless) يجعله يخفض قوته حرارياً بنسبة 15% بعد نصف ساعة من اللعب المتواصل.",
            explanation_en: "Excellent entry performance. Fanless architecture leads to 15% performance thermal drops after 30 minutes of continuous gaming."
          },
          enhanced: {
            id: "mba-m3-enhanced",
            name: "MacBook Air M3 (16GB)",
            name_ar: "ماك بوك إير M3 (16 جيجا رام)",
            chip: "Apple M3 (8-Core CPU, 10-Core GPU)",
            ram: 16,
            vram: 4,
            cpuScore: 7.8,
            gpuScore: 6.8,
            explanation: "سعة الرام الإضافية والأنوية الرسومية تفتح المجال للعب ألعاب أكبر وأقوى بمستويات استقرار هائلة بدقة 1080p.",
            explanation_en: "Highly capable for medium-profile 1080p gaming. Additional RAM keeps background overhead down."
          }
        }
      },
      "m2-chipsets": {
        name_ar: "رقاقات Apple M2",
        name_en: "M2 Chipsets",
        tiers: {
          base: {
            id: "mba-m2-base",
            name: "MacBook Air M2 (8GB)",
            name_ar: "ماك بوك إير M2 (8 جيجا رام)",
            chip: "Apple M2 (8-Core CPU, 8-Core GPU)",
            ram: 8,
            vram: 3,
            cpuScore: 7.0,
            gpuScore: 6.0,
            explanation: "جيّد لتجربة ألعاب خفيفة، لكن احذر من الضغط المتواصل على الرام وسخونة هيكل الجهاز المعدني السفلي.",
            explanation_en: "Good for light desktop-scale indie gaming, but limited by thermal thresholds under extensive 3D load."
          },
          enhanced: {
            id: "mba-m2-enhanced",
            name: "MacBook Air M2 (16GB)",
            name_ar: "ماك بوك إير M2 (16 جيجا رام)",
            chip: "Apple M2 (8-Core CPU, 10-Core GPU)",
            ram: 16,
            vram: 4,
            cpuScore: 7.2,
            gpuScore: 6.3,
            explanation: "أداء رسومي محترم للغاية وتجاوز مريح لعنق زجاجة الذاكرة عند تشغيل ألعاب أركيد ممتعة.",
            explanation_en: "Highly recommended 16GB RAM prevents memory swapping lags on casual and medium titles."
          }
        }
      },
      "m1-chipsets": {
        name_ar: "رقاقات Apple M1",
        name_en: "M1 Chipsets",
        tiers: {
          base: {
            id: "mba-m1-base",
            name: "MacBook Air M1 (8GB)",
            name_ar: "ماك بوك إير M1 (8 جيجا رام)",
            chip: "Apple M1 (8-Core CPU, 7-Core GPU)",
            ram: 8,
            vram: 2,
            cpuScore: 6.5,
            gpuScore: 5.5,
            explanation: "الجهاز الأسطوري الخفيف، ممتاز لتشغيل World of Warcraft أو League of Legends بسلاسة وإعدادات منخفضة وتبريد صامت تماماً.",
            explanation_en: "Legendary silent laptop. Easily handles esports mainstays like League of Legends with perfect silent operation."
          },
          enhanced: {
            id: "mba-m1-enhanced",
            name: "MacBook Air M1 (16GB)",
            name_ar: "ماك بوك إير M1 (16 جيجا رام)",
            chip: "Apple M1 (8-Core CPU, 8-Core GPU)",
            ram: 16,
            vram: 3,
            cpuScore: 6.7,
            gpuScore: 5.8,
            explanation: "أفضل دمج اقتصادي للألعاب والتصفح، تشغيل ثابت ومسار ذاكرة ناعم.",
            explanation_en: "Superb budget productivity and gaming combo. 16GB RAM prevents standard memory bottlenecks."
          }
        }
      },
      "intel-legacy": {
        name_ar: "رقاقات إنتل جيل قديم (Intel Core i5)",
        name_en: "Intel Legacy Models",
        tiers: {
          base: {
            id: "mba-intel-base",
            name: "MacBook Air Intel i5",
            name_ar: "ماك بوك إير Intel i5 القديم",
            chip: "Intel Core i5 (Dual-Core 1.6GHz)",
            ram: 8,
            vram: 1.5,
            cpuScore: 3.0,
            gpuScore: 2.5,
            explanation: "جهاز قديم تسبب له الألعاب البسيطة سخونة عالية وصوتاً مرتفعاً جداً للمروحة الوحيدة. مخصص للمهام المكتبية فقط.",
            explanation_en: "Outdated dual-core unit. Heavy thermal strain and fan noise under load. Suitable only for legacy 2D games and offices."
          }
        }
      }
    }
  },
  mac_studio_mini: {
    name_ar: "ماك ستوديو وماك ميني (Mac Studio & Mac mini)",
    name_en: "Mac Studio & Mac mini Families",
    generations: {
      "base-m-chips": {
        name_ar: "رقاقات الفئة الأساسية (Base M-Chips)",
        name_en: "Base M-Chips",
        tiers: {
          m1_mini: {
            id: "mini-m1",
            name: "Mac mini M1",
            name_ar: "ماك ميني M1 (الأساسي)",
            chip: "Apple M1 (8-Core System)",
            ram: 8,
            vram: 4,
            cpuScore: 6.8,
            gpuScore: 6.0,
            explanation: "جهاز مكتب اقتصادي صامت وسريع الاستجابة. يشغل جل الألعاب الصادرة لنظام ماك بإعدادات منخفضة - متوسطة.",
            explanation_en: "Affordable desktop, entirely silent and responsive. Playable on low-medium settings for macOS native games."
          },
          m2_mini: {
            id: "mini-m2",
            name: "Mac mini M2",
            name_ar: "ماك ميني M2",
            chip: "Apple M2 (8-Core CPU, 10-Core GPU)",
            ram: 16,
            vram: 6,
            cpuScore: 7.5,
            gpuScore: 6.8,
            explanation: "معالج تنجيز ممتاز وتبريد رائع يعزز فترات اللعب دون انخفاض الفريمات.",
            explanation_en: "Excellent desktop cooling allows continuous gaming with consistent non-throttling frame delivery."
          },
          m4_mini: {
            id: "mini-m4",
            name: "Mac mini M4",
            name_ar: "ماك ميني M4 (الجيل الأحدث)",
            chip: "Apple M4 (10-Core CPU, 10-Core GPU)",
            ram: 16,
            vram: 8,
            cpuScore: 8.8,
            gpuScore: 8.0,
            explanation: "أحدث طفرة أداء وتصميم للماك ميني! سعة الرام الأساسية 16 جيجا تدير كافة الألعاب الرسومية بأريحية وثبات.",
            explanation_en: "Outstanding redesign. 16GB base RAM handles modern visual workloads and native macOS gaming beautifully."
          }
        }
      },
      "max-ultra-tiers": {
        name_ar: "رقاقات الفئة الفائقة والألترا (Max / Ultra Tiers)",
        name_en: "Max / Ultra Tiers",
        tiers: {
          m1_max_studio: {
            id: "studio-m1-max",
            name: "Mac Studio M1 Max",
            name_ar: "ماك ستوديو M1 ماكس",
            chip: "Apple M1 Max (32-Core GPU)",
            ram: 32,
            vram: 16,
            cpuScore: 8.5,
            gpuScore: 8.2,
            explanation: "قوة سطح مكتب مذهلة تضاهي الحواسب الاحترافية، أوقات تحميل شبه معدومة ومعدلات فريم ناعمة.",
            explanation_en: "Excellent workstation performance. Heavy emulation runtimes execute with pristine frame consistency."
          },
          m1_ultra_studio: {
            id: "studio-m1-ultra",
            name: "Mac Studio M1 Ultra",
            name_ar: "ماك ستوديو M1 ألترا",
            chip: "Apple M1 Ultra (64-Core GPU)",
            ram: 64,
            vram: 32,
            cpuScore: 9.5,
            gpuScore: 9.0,
            explanation: "عملاق التحريك وصنع الألعاب، تشغيل فائق الكفاءة لعدة بيئات محاكاة وألعاب كبرى دون جهد.",
            explanation_en: "Monstrous memory bandwidth and cores pool. Plays emulation apps at extreme settings simultaneously."
          },
          m2_max_studio: {
            id: "studio-m2-max",
            name: "Mac Studio M2 Max",
            name_ar: "ماك ستوديو M2 ماكس",
            chip: "Apple M2 Max (38-Core GPU)",
            ram: 32,
            vram: 16,
            cpuScore: 9.0,
            gpuScore: 8.8,
            explanation: "تأدية جبارة لأقوى ألعاب ماك والويندوز المترجمة بإعدادات رسومية فائقة.",
            explanation_en: "Extremely fast. Powers modern translated Windows game builds on maximum graphics presets easily."
          },
          m2_ultra_studio: {
            id: "studio-m2-ultra",
            name: "Mac Studio M2 Ultra",
            name_ar: "ماك ستوديو M2 ألترا",
            chip: "Apple M2 Ultra (76-Core GPU)",
            ram: 64,
            vram: 32,
            cpuScore: 10.0,
            gpuScore: 9.8,
            explanation: "قمة الهندسة والعتاد من آبل! عرض لا مثيل له يعادل كروت الشاشة المكتبية الضخمة في استهلاك قليل جداً للطاقة.",
            explanation_en: "Top-tier computing architecture. Rivals top PC desktop GPUs with incredible energy efficiency and bandwidth metrics."
          }
        }
      }
    }
  },
  apple_tv: {
    name_ar: "ابل تي في (Apple TV)",
    name_en: "Apple TV Family",
    generations: {
      "4k-generations": {
        name_ar: "أجيال أبل تي في 4K (Apple TV 4K)",
        name_en: "Apple TV 4K Generations",
        tiers: {
          gen1: {
            id: "appletv-4k-gen1",
            name: "Apple TV 4K (Gen 1)",
            name_ar: "ابل تي في 4K (الجيل الأول) A10X",
            chip: "Apple A10X Fusion",
            ram: 3,
            vram: 1.5,
            cpuScore: 3.8,
            gpuScore: 3.5,
            explanation: "معالج A10X يقدم معالجة جيدة لألعاب جيل Arcade الأولى، تراجع بسيط في الإطارات مع الألعاب ثلاثية الأبعاد الثقيلة.",
            explanation_en: "Competent chip for older Arcade releases. Graphic-heavy 1080p gameplay might trigger slight frame pacing drops."
          },
          gen2: {
            id: "appletv-4k-gen2",
            name: "Apple TV 4K (Gen 2)",
            name_ar: "ابل تي في 4K (الجيل الثاني) A12",
            chip: "Apple A12 Bionic",
            ram: 3,
            vram: 1.5,
            cpuScore: 4.5,
            gpuScore: 4.0,
            explanation: "شريحة A12 تدعم الألعاب العائلية ومحاكاة الألعاب الكلاسيكية بدقة 1080p بمعدل إطارات سلس.",
            explanation_en: "Very good for screen mirroring, retro emulation hubs, and standard family Arcade multiplayer setups."
          },
          gen3: {
            id: "appletv-4k-gen3",
            name: "Apple TV 4K (Gen 3)",
            name_ar: "ابل تي في 4K (الجيل الثالث) A15",
            chip: "Apple A15 Bionic (5-Core GPU)",
            ram: 4,
            vram: 2,
            cpuScore: 6.2,
            gpuScore: 5.5,
            explanation: "منصة ترفيهية ممتازة تدعم تشغيل ألعاب Apple Arcade بدقة 4K رصينة واستجابة فائقة لمعالجات التحكم اللاسلكية.",
            explanation_en: "Outstanding TV console. Plays heavy Apple Arcade releases on 4K with stellar wireless gamepad precision."
          }
        }
      },
      "hd-generations": {
        name_ar: "ابل تي في HD الإقتصادي",
        name_en: "Apple TV HD",
        tiers: {
          hd: {
            id: "appletv-hd",
            name: "Apple TV HD (A8)",
            name_ar: "ابل تي في HD (معالج A8)",
            chip: "Apple A8 Dual-Core",
            ram: 2,
            vram: 0.8,
            cpuScore: 2.0,
            gpuScore: 1.8,
            explanation: "جهاز بث كلاسيكي قديم. مناسب فقط للألعاب البسيطة جداً والشاشات التبادلية منخفضة الحركة.",
            explanation_en: "Older streaming box. Best limited to lightweight 2D games and children titles."
          }
        }
      }
    }
  }
};
