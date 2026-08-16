import { apiBaseUrl } from "@/constants/storage";
import { BlogMeta } from "../page";

export default async function fetchBlogList(query: string = "", tag: string = "") {
    const listResp = await fetch(
        `${apiBaseUrl}/blog?q=${query}&tag=${tag}`,
        { next: { revalidate: 86400 } }
    );
    
    if (!listResp.ok) { throw new Error(`Failed to fetch blog list! Status: ${listResp.status}`); }
    const res: { blogs: BlogMeta[] } = (await listResp.json()).data;

    return res.blogs;
}