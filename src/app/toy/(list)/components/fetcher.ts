import { storageToysUrl } from "@/constants/storage";
import { rawToyData } from "../page";

export default async function fetchMetadatas() {
    const listRes = await fetch(`${storageToysUrl}/list.json`);
    const datas: {toys: rawToyData[]} = await listRes.json();

    return datas.toys;
}