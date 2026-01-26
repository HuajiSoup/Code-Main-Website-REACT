import React from "react";
import Banner from "@/components/Banner";

import "./layout.scss";

export default function BlogPagesLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (<>
        <main id="blog-main">
            <Banner><b>稽之博客</b></Banner>
            <div className="content-wrapper">
                {children}
            </div>
        </main>
    </>);
}