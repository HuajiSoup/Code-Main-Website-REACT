import { storageToysUrl } from "@/constants/storage";
import { rawToyData } from "../page";

export default async function fetchMetadatas() {
    const listRes = await fetch(`${storageToysUrl}/list.json`);
    const slugList: {toys: string[]} = await listRes.json();

    const toys: rawToyData[] = await Promise.all(
        slugList.toys.map(slug => 
            fetch(
                `${storageToysUrl}/${slug}/metadata.json`,
                { next: { revalidate: 86400 } }
            )
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch toy "${slug}"! Status: ${res.status}`);
                return res.json();
            })
        )
    );

    return toys;
}