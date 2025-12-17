export default async function handler(req, res) {
  const url = req.query.url;

  try { 
    const imgRes = await fetch(url);

    // cache.
    res.setHeader("Content-Type", imgRes.headers.get("Content-Type"));
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=604800, immutable"
    );
  
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Proxy error in ${url}.`)
  }

}
