import React from "react";
import ToyRedirect from "./components/ToyRedirect";
import { Metadata } from "next";
import fetchToyData from "./components/fetcher";
import { rawToToyData } from "../(list)/page";

type PageToyRedirectProps = {
    params: Promise<{
        slug: string;
    }>;
}

const getToyData = async (slug: string) => {
    const raw = await fetchToyData(slug);
    return rawToToyData(raw);
}

const PageToy: React.FC<PageToyRedirectProps> = async ({ params }) => {
    const { slug } = await params;

    return <ToyRedirect slug={slug} />;
}

export async function generateMetadata({ params }: PageToyRedirectProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await getToyData(slug);

    return {
        title: `${slug} | 稽之玩具`,
        description: data.desc,
        openGraph: {
            title: `${slug} | 稽之玩具`,
            description: data.desc,
        }
    }
}

export default PageToy;