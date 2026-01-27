import { storageBlogsUrl } from "@/constants/storage";

export default async function fetchBlogData(id: string) {
    const url = `${storageBlogsUrl}/blog-${id}`;
    const [metadata, content] = await Promise.all([
        fetch(
            `${url}/metadata.json`,
            { next: { revalidate: 86400 } }
        )
        .then(res => {
            if (!res.ok) { throw new Error(`Failed to fetch metadata of blog "${id}"!\n Status: ${res.status}`); }
            return res.json();
        }),

        fetch(
            `${url}/blog.md`,
            { next: { revalidate: 86400 } }
        )
        .then(res => {
            if (!res.ok) { throw new Error(`Failed to fetch content of blog "${id}"!\n Status: ${res.status}`); }
            return res.text();
        })
    ]);

    return { metadata, content };
}