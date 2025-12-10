import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_APIKEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function handler(req, res) {
  const pageId = req.query.id;

  if (!pageId) {
    return res.status(400).json({ error: "Missing pageId" });
  }

  try {
    // convert page → MD blocks
    const mdBlocks = await n2m.pageToMarkdown(pageId);

    // convert MD blocks → markdown string
    const markdown = n2m.toMarkdownString(mdBlocks);

    // fetch page metadata (title, icon, cover)
    const page = await notion.pages.retrieve({ page_id: pageId });

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({
      markdown: markdown.parent,
      raw: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
