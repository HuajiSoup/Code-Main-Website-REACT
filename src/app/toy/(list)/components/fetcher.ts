import { apiBaseUrl } from "@/constants/storage";
import { ToyData } from "../page";

export default async function fetchToyList() {
    const listResp = await fetch(
        `${apiBaseUrl}/toy`,
        { next: { revalidate: 86400 } }
    );

    if (!listResp.ok) { throw new Error(`Failed to fetch toy list! Status: ${listResp.status}`); }
    const res: { toys: ToyData[] } = (await listResp.json()).data;

    return res.toys;
}