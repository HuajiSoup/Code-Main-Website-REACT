import React from "react";

import { Metadata } from "next";
import BlogLister from "./components/BlogLister";
import fetchBlogList from "./components/fetcher";
import { baseUrl } from "@/constants/storage";

type BlogMeta = {
    id: number,
    slug: string,
    title: string,
    desc: string,
    emoji: string,
    tags: string[],
    createdTime: string,
    updatedTime: string,
    completed: boolean,
    cover: string | null,
}

const rawToBlogMeta = (meta: BlogMeta): BlogMeta => {
    return {
        id: meta.id,
        slug: meta.slug,
        title: meta.title ?? "[无题]",
        emoji: meta.emoji,
        cover: meta.cover ? `${baseUrl}/blogs/${meta.slug}/${meta.cover}` : null,
        desc: meta.desc ?? "[无简介]",
        tags: meta.tags,
        createdTime: meta.createdTime.split(" ")[0], // date part only
        updatedTime: meta.updatedTime.split(" ")[0],
        completed: meta.completed ?? true,
    }
}

const getBlogList = async () => {
    try {
        const metadatas = await fetchBlogList();
        const blogs = metadatas.map(rawToBlogMeta);
        return blogs;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch blog list!");
    }
}

const PageBlogList: React.FC = async () => {
    const blogs = await getBlogList();

    return <BlogLister blogs={blogs} />;
};

export { type BlogMeta, rawToBlogMeta };
export default PageBlogList;

export const metadata: Metadata = {
    title: "稽之博客 | Huaji Blogs",
    description: "阅读散落的滑稽先辈的文字，触摸古老的智慧。\
        经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。",
    openGraph: {
        title: "稽之博客 | Huaji Blogs",
        description: "稽之宇宙博客站：\n\
            阅读散落的滑稽先辈的文字，触摸古老的智慧。\
            经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。",
    }
}