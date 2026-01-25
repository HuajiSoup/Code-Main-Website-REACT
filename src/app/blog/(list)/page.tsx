import React from "react";
import "./index.scss";

import Banner from "../../../components/Banner";
import { Metadata } from "next";
import { storageBlogsUrl } from "@/constants/storage";
import fetchMetadatas from "./components/fetcher";
import BlogLister from "./components/BlogLister";

type BlogMeta = {
    title: string | undefined;
    blogID: string | undefined;
    emoji: string | undefined;
    cover: string | undefined;
    desc: string | undefined;
    section: string | undefined;
    tags: string[];
    lastEdit: string | undefined;
    completed: boolean;
}

type FetchedMeta = {
    title?: string;
    blogID?: string;
    emoji?: string;
    cover?: string;
    desc?: string;
    section?: string;
    tags?: string[];
    lastEdit?: number;
    completed?: boolean;
}

// AliyunOSS
const metaToBlogMeta = (meta: FetchedMeta): BlogMeta => {
    const date = new Date(Number(meta?.lastEdit ?? 0));

    return {
        title: meta?.title,
        blogID: meta?.blogID,
        emoji: meta?.emoji,
        cover: meta?.cover ? `${storageBlogsUrl}/blog-${meta.blogID}/${meta.cover}` : undefined,
        desc: meta?.desc,
        section: meta?.section,
        tags: meta?.tags ?? [],
        lastEdit: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        completed: meta?.completed ?? true,
    }
}

const getBlogList = async () => {
    try {
        const metadatas = await fetchMetadatas();
        const blogs = metadatas.map(metaToBlogMeta);
        return blogs;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch blog list!");
    }
}

const PageBlogList: React.FC = async () => {
    const blogs = await getBlogList();

    return (<>
        <main id="blog-main">
            <Banner><b>稽之博客</b></Banner>
            <div className="content-wrapper">
                <BlogLister blogs={blogs} />
            </div>
        </main>
    </>);
};

export { metaToBlogMeta };
export type { FetchedMeta, BlogMeta };
export default PageBlogList;
export const metadata: Metadata = {
    title: "稽之博客 | Huaji Blogs",
    description: "阅读散落的滑稽先辈的文字，触摸古老的智慧。经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。",
}