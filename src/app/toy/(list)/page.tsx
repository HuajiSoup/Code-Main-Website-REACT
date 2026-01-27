import React from "react";

import { Metadata } from "next";
import ToyLister from "./components/ToyLister";
import fetchMetadatas from "./components/fetcher";
import { storageToysUrl } from "@/constants/storage";

type ToyData = {
    title: string;
    desc: string;
    slug: string;
    url: string;
    icon?: string;
}

type rawToyData = {
    title?: string;
    desc?: string;
    slug: string;
    icon?: string;
}

const rawToToyData = (meta: rawToyData): ToyData => {
    return {
        title: meta.title ?? "[无题]",
        desc: meta.desc ?? "",
        slug: meta.slug,
        url: `${storageToysUrl}/${meta.slug}`,
        icon: meta.icon ? `${storageToysUrl}/${meta.slug}/${meta.icon}` : undefined,
    }
}

const getToyList = async () => {
    const datas: rawToyData[] = await fetchMetadatas();
    const toys = datas.map(rawToToyData);
    
    return toys;
}

const PageToyList: React.FC = async () => {
    const datas = await getToyList();

    return <ToyLister toys={datas} />;
}

export type { ToyData, rawToyData };
export { rawToToyData };
export default PageToyList;
export const metadata: Metadata = {
    title: "稽之玩具 | Huaji Toys",
    description: "这里陈列着从滑稽文明的遗址中出土的文物，经过悉心修复现已向公众开放。\
        这些遗物记录着一个文明的辉煌时刻，触摸它们、感受他们，也是一种别样的美感。",
    openGraph: {
        title: "稽之玩具 | Huaji Toys",
        description: "稽之宇宙玩具页：\n\
            这里陈列着从滑稽文明的遗址中出土的文物，经过悉心修复现已向公众开放。\
            这些遗物记录着一个文明的辉煌时刻，触摸它们、感受他们，也是一种别样的美感。",
    }
}