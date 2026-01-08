import { Client } from "@notionhq/client";

const storageUrl = "https://storage.huaji-universe.top/blogs";
const notion = new Client({
  auth: process.env.NOTION_APIKEY,
});

export default async function handler(req, res) {
  const pageId = req.query.id;
  
  const notionQuery = {
    page_size: 50,
    data_source_id: process.env.BLOGS_DBSOURCE_ID,
    filter: {
      and: [
        {
          property: "released",
          checkbox: {
            equals: true,
          }
        },
        {
          property: "id",
          number: {
            equals: Number(pageId),
          }
        }
      ]
    }
  }

  if (!pageId) {
    return res.status(400).json({ error: "Missing pageId" });
  }

  try {
    // fetch meta datas from NOTION
    // fetch contents from AliyunOSS
    const [responseNotion, responseOSS] = await Promise.all([
      notion.dataSources.query(notionQuery),
      fetch(`${storageUrl}/blog-${pageId}/blog.md`),
    ]);

    if (!responseOSS.ok) {
      throw new Error(`OSS fetch failed! ${responseOSS.status}`);
    }

    const metadata = responseNotion.results?.[0] ?? null;
    const content = await responseOSS.text();

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({
      metadata,
      content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
