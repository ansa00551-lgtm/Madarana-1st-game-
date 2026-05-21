export interface GameRequirements {
  cpu: string;
  gpu: string;
  ram: number; // in GB
  storage: number; // in GB
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  background_image?: string;
  released?: string;
  description_raw?: string;
  genres?: { name: string }[];
  minimum_requirements?: GameRequirements;
  recommended_requirements?: GameRequirements;
}

export interface SystemSpecs {
  cpuName: string;
  cpuScore: number; // For basic local validation (1-10 scale)
  gpuName: string;
  gpuScore: number; // For basic local validation (1-10 scale)
  ramGB: number;
  vramGB: number;
  storageGB: number;
  isSSD: boolean;
  os: string;
}

export interface ApplePreset {
  id: string;
  name: string;
  chip: string;
  ram: number;
  vram: number;
  cpuScore: number;
  gpuScore: number;
  compatibleGamesExplanation: string;
}

export interface AnalysisResult {
  overallScore: number; // 0 - 100
  cpuStatus: "pass" | "warn" | "fail";
  gpuStatus: "pass" | "warn" | "fail";
  ramStatus: "pass" | "warn" | "fail";
  storageStatus: "pass" | "warn" | "fail";
  estFps: number;
  recommendedResolution: string;
  bottleneck: string;
  verdict: string;
}
