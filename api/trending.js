export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&ordering=-rating&page_size=6&page=1`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "RAWG API error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
