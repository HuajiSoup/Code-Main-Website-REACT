"use client";

import Banner from "@/components/Banner";
import Error from "next/error";
import { useEffect } from "react";

const ErrorBlogList = ({
    error,
    reset
}: {
    error: Error & {digest: string},
    reset: () => void,
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (<>
        <main id="blog-main">
            <Banner><b>稽之博客</b></Banner>
            <div className="content-wrapper">
                <div className="blogger-lister-root">
                    <div className="blogs-list">
                        <div className="blog-status-card error">🚫文章列表加载失败！{error.digest}</div>
                    </div>
                </div>
            </div>
        </main>
    </>);
}

export default ErrorBlogList;