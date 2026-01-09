export default async function handler(req, res) {
  try {
    // filelist
    const listRes = await fetch("https://storage.huaji-universe.top/blogs/list.json");
    if (!listRes.ok) {
      throw new Error("Failed to fetch blog list!\n", listRes.status);
    }
    const blogList = await listRes.json();

    // metadatas
    const metadatas = await Promise.all(blogList.map(id =>
      fetch(`https://storage.huaji-universe.top/blogs/${id}/metadata.json`)
        .then(metadataRes => {
          if (!metadataRes.ok) {
            throw new Error(`Failed to fetch blog metadata: ${id}!`, metadataRes.status);
          }
          return metadataRes.json();
        })
    ));

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(metadatas);
  } catch (error) {
    console.error("Failed to fetch content, error: \n", error);
    res.status(500).json({ error: error.message });
  }
}