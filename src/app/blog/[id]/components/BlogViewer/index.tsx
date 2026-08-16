"use client";

import React, { memo } from "react";
import "./index.scss";
import 'react-photo-view/dist/react-photo-view.css';

import Link from "next/link";
import MyMarkdown from "@/components/MyMarkdown";
import AnimatedDiv from "@/components/AnimatedDiv";
import { BlogData } from "../../page";

import { LogOut } from "lucide-react";
import { baseUrl } from "@/constants/storage";
import { PhotoProvider } from "react-photo-view";

type ArticleViewerProps = {
    data: BlogData;
}

const BlogViewer: React.FC<ArticleViewerProps> = memo(({ data }) => {
    const meta = data.meta;
    const md = data.content.replaceAll(
        /(!\[.*?\]\()(\.\/)(.*?\))/g,
        `$1${baseUrl}/blogs/${meta.slug}/res/$3`
    );

    const ScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (<>
        <AnimatedDiv className="blogger-article-root">
            <Link href="/blog" className="blog-article-exit" onClick={ScrollToTop}>
                <LogOut />
                返回
            </Link>
            <div className="blog-article-card">
                { meta.cover && <div className="blog-article-cover" style={{
                    backgroundImage: `url(${meta.cover})`
                }}></div> }
                <div className="blog-article-header">
                    <h2 className="blog-article-title">{meta.emoji ?? "🍟"}{meta.title}{meta.emoji ?? "🍟"}</h2>
                    { meta.desc && <p className="blog-article-desc">{meta.desc}</p> }
                    <p className="blog-article-time">
                        {!meta.completed && <b>【连载中】</b>}最后更新于{meta.updatedTime}
                    </p>
                </div>

                <hr />
                <div className="blog-article-body">
                    <PhotoProvider loop={false} maskOpacity={0.7}>
                        <MyMarkdown>{md}</MyMarkdown>
                    </PhotoProvider>
                </div>
                <hr />
            </div>
        </AnimatedDiv>
    </>);
});
BlogViewer.displayName = "BlogViewer";

export default BlogViewer;