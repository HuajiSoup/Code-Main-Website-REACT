import { apiBaseUrl, baseUrl } from "@/constants/storage";

export default async function fetchBlogData(slug: string) {
    const [metadata, content] = await Promise.all([
        fetch(
            `${apiBaseUrl}/blog/${slug}`,
            { next: { revalidate: 86400 } }
        )
        .then(res => {
            if (!res.ok) {
                return null;
                // throw new Error(`Failed to fetch metadata of blog "${id}"!\n Status: ${res.status}`);
            }
            return res.json();
        }),

        fetch(
            `${baseUrl}/blogs/${slug}/blog.md`,
            { next: { revalidate: 86400 } }
        )
        .then(res => {
            if (!res.ok) {
                return null;
                // throw new Error(`Failed to fetch content of blog "${id}"!\n Status: ${res.status}`);
            }
            return res.text();
        })
    ]);

    if (!metadata || !content) return null;

    return {
        metadata: metadata.data.blog,
        content
    };
}