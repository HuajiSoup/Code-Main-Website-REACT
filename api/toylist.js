export default async function handler(req, res) {
  try {
    const listRes = await fetch("https://storage.huaji-universe.top/toys/list.json");
    if (!listRes.ok) {
      throw new Error("Failed to fetch blog list!\n", listRes.status);
    }
    const toysList = await listRes.json();

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(toysList.toys);
  } catch (error) {
    console.error("Failed to fetch content, error: \n", error);
    res.status(500).json({ error: error.message });
  }
}