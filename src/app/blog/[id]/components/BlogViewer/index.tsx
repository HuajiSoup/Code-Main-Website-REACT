"use client";

import React, { memo } from "react";
import "./index.scss";

import Link from "next/link";
import MyMarkdown from "@/components/MyMarkdown";
import AnimatedDiv from "@/components/AnimatedDiv";
import { BlogData } from "../../page";

import { storageBlogsUrl } from "@/constants/storage";

type ArticleViewerProps = {
    data: BlogData;
}

const BlogViewer: React.FC<ArticleViewerProps> = memo(({ data }) => {
    const meta = data.metadata;
    const md = data.content.replaceAll(
        /(!\[.*?\]\()(\.\/)(.*?\))/g,
        `$1${storageBlogsUrl}/blog-${meta.blogID}/$3`
    );

    const ScrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    return (<>
        <AnimatedDiv className="blogger-article-root">
            <Link href="/blog" className="blog-article-exit" onClick={ScrollToTop}>返回</Link>
            <div className="blog-article-card">
                { meta.cover && <div className="blog-article-cover" style={{
                    backgroundImage: `url(${meta.cover})`
                }}></div> }
                <div className="blog-article-header">
                    <h2 className="blog-article-title">{meta.emoji ?? "🍟"}{meta.title}{meta.emoji ?? "🍟"}</h2>
                    { meta.desc && <p className="blog-article-desc">{meta.desc}</p> }
                    { meta.lastEdit && <p className="blog-article-time">
                        {!meta.completed && <b>【连载中】</b>}最后更新于{meta.lastEdit}
                    </p> }
                </div>

                <hr />
                <div className="blog-article-body">
                    <MyMarkdown>{md}</MyMarkdown>
                </div>
                <hr />
            </div>
        </AnimatedDiv>
    </>);
});
BlogViewer.displayName = "BlogViewer";

export default BlogViewer;