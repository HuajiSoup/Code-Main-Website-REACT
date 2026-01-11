// REMOVED

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_APIKEY,
});

export default async function handler(req, res) {
  try {
    const response = await notion.dataSources.query({
      page_size: 50,
      data_source_id: process.env.BLOGS_DBSOURCE_ID,
      filter: {
        property: "released",
        checkbox: {
          equals: true,
        }
      }
    });

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(response);
  } catch (error) {
    console.error("Failed to fetch content, error: \n", error);
    res.status(500).json({ error: error.message });
  }
}