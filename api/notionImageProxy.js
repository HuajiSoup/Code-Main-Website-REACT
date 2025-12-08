export default async function handler(req, res) {
  const url = req.query.url;

  // Fetch image from Notion
  const imgRes = await fetch(url);

  // Pass through real headers so browser can cache
  res.setHeader("Content-Type", imgRes.headers.get("Content-Type"));
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  res.send(buffer);
}
