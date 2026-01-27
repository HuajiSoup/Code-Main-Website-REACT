import React from "react";

import { Metadata } from "next";
import BlogViewer from "./components/BlogViewer";
import fetchBlogData from "./components/fetcher";
import { BlogMeta, rawToBlogMeta } from "../(list)/page";
import { notFound } from "next/navigation";

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
    if (!data) return null;

    const meta = rawToBlogMeta(data.metadata);
    const content = data.content;
    return { meta, content };
}

const PageBlog: React.FC<PageBlogProps> = async ({ params }) => {
    const { id } = await params;
    const data = await getBlogData(id);

    if (!data) notFound();

    return <BlogViewer data={data} />;
};

export async function generateMetadata({ params }: PageBlogProps): Promise<Metadata> {
    const { id } = await params;
    const data = await getBlogData(id);

    if (!data) return {};

    return {
        title: `${data.meta.title} | 稽之博客`,
        description: data.meta.desc,
        openGraph: {
            title: `${data.meta.title} | 稽之博客`,
            description: data.meta.desc,
        }
    }
}

export type { BlogData };
export default PageBlog;