import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log incoming requests for dev visibility
  app.use((req, res, next) => {
    console.log(`[ROUTE] ${req.method} ${req.url}`);
    next();
  });

  // API 1: Search RAWG Game API securely
  app.post("/api/search", async (req, res) => {
    try {
      const { gameName } = req.body;
      if (!gameName) {
        return res.status(400).json({ error: "gameName is required" });
      }

      console.log(`Searching RAWG game database: "${gameName}"`);
      const rawgKey = "7e6a930df60d41f4b4dd7b124d6c13e5";
      const rawgUrl = `https://api.rawg.io/api/games?key=${rawgKey}&search=${encodeURIComponent(gameName)}`;
      
      const response = await fetch(rawgUrl);
      if (!response.ok) {
        console.error(`RAWG API responded with status ${response.status}`);
        return res.status(response.status).json({ error: "Failed to search RAWG database." });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("RAWG API search error:", err);
      res.status(500).json({ error: err.message || "Failed to search RAWG" });
    }
  });

  // API 1.5: Get Trending/Popular games from RAWG
  app.get("/api/trending", async (req, res) => {
    try {
      console.log("Fetching trending/popular games from RAWG...");
      const rawgKey = "7e6a930df60d41f4b4dd7b124d6c13e5";
      // Fetch games that are most added (popular in general database)
      const rawgUrl = `https://api.rawg.io/api/games?key=${rawgKey}&page_size=6&ordering=-added`;
      const response = await fetch(rawgUrl);
      if (!response.ok) {
        console.error(`RAWG trending source responded with status ${response.status}`);
        return res.status(response.status).json({ error: "Failed to fetch trending games." });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("RAWG trending error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch trending" });
    }
  });

  // API 2: Analyze system specifications with Gemini
  app.post("/api/analyze", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
        return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
      }

      console.log("Initializing Gemini Client using named parameters...");
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      console.log("Querying gemini-3.5-flash with system specification prompt...");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text || "No response received from Gemini.";
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini AI API execution error:", err);
      res.status(500).json({ error: err.message || "Gemini execution failed" });
    }
  });

  // Handle serving frontend static files or mounting Vite development server middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on port ${PORT}`);
  });
}

startServer();
