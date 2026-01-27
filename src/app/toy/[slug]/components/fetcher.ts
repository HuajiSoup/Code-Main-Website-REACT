import { storageToysUrl } from "@/constants/storage";
import { rawToyData } from "../../(list)/page";

export default async function fetchToyData(slug: string) {
    const metaRes = await fetch(
        `${storageToysUrl}/${slug}/metadata.json`,
        { next: { revalidate: 86400 } }
    );

    if (!metaRes.ok) {
        return null;
        // throw new Error(`Failed to fetch toy "${slug}"! Status: ${metaRes.status}`);
    };
    const metadata: rawToyData = await metaRes.json();
    return metadata;
}