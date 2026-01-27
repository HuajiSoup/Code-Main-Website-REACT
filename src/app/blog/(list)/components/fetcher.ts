import { storageBlogsUrl } from "@/constants/storage";

export default async function fetchMetadatas() {
    // list
    const listRes = await fetch(
        `${storageBlogsUrl}/list.json`,
        { next: { revalidate: 86400 } }
    );
    if (!listRes.ok) { throw new Error(`Failed to fetch blog list! Status: ${listRes.status}`); }
    const idList = await listRes.json();

    // each
    const blogs = await Promise.all(
        idList.blogs.map((id: string) => 
            fetch(
                `${storageBlogsUrl}/${id}/metadata.json`, 
                { next: { revalidate: 86400 } }
            )
            .then(metaRes => {
                if (!metaRes.ok) { throw new Error(`Failed to fetch blog "${id}"! Status: ${metaRes.status}`); }
                return metaRes.json();
            })
        )
    );
    return blogs;
}