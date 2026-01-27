import React from "react";

import { Metadata } from "next";
import BlogViewer from "./components/BlogViewer";
import fetchBlogData from "./components/fetcher";
import { BlogMeta, rawToBlogMeta } from "../(list)/page";

type PageBlogProps = {
    params: Promise<{
        id: string;
    }>
}

type BlogData = {
    meta: BlogMeta;
    content: string;
}

const getBlogData = async (id: string) => {
    const data = await fetchBlogData(id);
    const meta = rawToBlogMeta(data.metadata);
    const content = data.content;
    return { meta, content };
}

const PageBlog: React.FC<PageBlogProps> = async ({ params }) => {
    const { id } = await params;
    const data: BlogData = await getBlogData(id);

    return <BlogViewer data={data} />;
};

export async function generateMetadata({ params }: PageBlogProps): Promise<Metadata> {
    const { id } = await params;
    const { meta }: BlogData = await getBlogData(id);

    return {
        title: `${meta.title} | 稽之博客`,
        description: meta.desc,
        openGraph: {
            title: `${meta.title} | 稽之博客`,
            description: meta.desc,
        }
    }
}

export type { BlogData };
export default PageBlog;