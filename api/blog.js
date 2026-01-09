export default async function handler(req, res) {
  try {
    const blogID = req.query.id;
    const url = `https://storage.huaji-universe.top/blogs/blog-${blogID}`

    const [metadata, content] = await Promise.all([
      fetch(`${url}/metadata.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch blog metadata: ${blogID}!\n`, response.status);
          }
          return response.json();
        }),

      fetch(`${url}/blog.md`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch blog content: ${blogID}!\n`, response.status);
          }
          return response.text();
        })
    ]);

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({
      metadata,
      content,
    });
  } catch (error) {
    console.error("Failed to fetch blog, error:\n", error);
    res.status(500).json({ error: error.message });
  }
}