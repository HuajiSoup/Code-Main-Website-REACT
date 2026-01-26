import React from "react";

import { Metadata } from "next";
import BlogViewer from "./components/BlogViewer";
import fetchBlogData from "./components/fetcher";
import { BlogMeta, metaToBlogMeta } from "../(list)/page";

type PageBlogProps = {
    params: Promise<{
        id: string;
    }>
}

type BlogData = {
    metadata: BlogMeta;
    content: string;
}

const getBlogData = async (id: string) => {
    const data = await fetchBlogData(id);
    const metadata = metaToBlogMeta(data.metadata);
    const content = data.content;
    return { metadata, content };
}

const PageBlog: React.FC<PageBlogProps> = async ({ params }) => {
    const { id } = await params;
    const data: BlogData = await getBlogData(id);

    return <BlogViewer data={data} />;
};

export type { BlogData };
export default PageBlog;
export const metadata: Metadata = {
    title: "稽之博客 | Huaji Blogs",
    description: "阅读散落的滑稽先辈的文字，触摸古老的智慧。经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。",
}