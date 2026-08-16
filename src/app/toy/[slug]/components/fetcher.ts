import { apiBaseUrl } from "@/constants/storage";

export default async function fetchToyData(slug: string) {
    const metaRes = await fetch(
        `${apiBaseUrl}/toy/${slug}`,
        { next: { revalidate: 86400 } }
    );

    if (!metaRes.ok) {
        return null;
        // throw new Error(`Failed to fetch toy "${slug}"! Status: ${metaRes.status}`);
    };
    const metadata = await metaRes.json();
    return metadata.data.toy;
}