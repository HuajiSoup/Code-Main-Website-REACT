import React from "react";
import ToyRedirect from "./components/ToyRedirect";

type PageToyRedirectProps = {
    params: Promise<{
        slug: string;
    }>;
}

const PageToy: React.FC<PageToyRedirectProps> = async ({ params }) => {
    const { slug } = await params;

    return <ToyRedirect slug={slug} />;
}

export default PageToy;