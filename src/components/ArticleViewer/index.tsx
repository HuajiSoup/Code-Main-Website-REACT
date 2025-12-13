import React, { memo, useEffect, useState } from "react";
import "./index.scss";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { BlogInfo } from "src/utils/notion";
import { postToBlogInfo } from "src/utils/notion";
import { replaceAllWith } from "src/utils/string";

type ArticleViewerProps = {
    blogID: string;
}

const imgUrl = /https:\/\/prod-files-secure\.s3\.us-west-2\.amazonaws\.com\/\S+?x-id=GetObject/;
const strUrlToProxy = (str: string) => `/api/notionImageProxy?url=${encodeURIComponent(str)}`;

const ArticleViewer: React.FC<ArticleViewerProps> = memo(({ blogID }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blog, setBlog] = useState<BlogInfo | null>(null);
    const [md, setMd] = useState<string>("");

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);

            try {
                const res = await fetch(`/api/notionArticle?id=${blogID}`);
                const data = await res.json();
                data.markdown = replaceAllWith(data.markdown, imgUrl, strUrlToProxy);
                setMd(data.markdown);
                setBlog(postToBlogInfo(data.raw));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        
        fetchArticle();
    }, [blogID]);

    return (<>
        <div className="blog-article-card">
            { loading && <p>▶️文章绝赞加载中...</p> }
            { loading && error && <p>🚫文章加载失败！</p> }
            { !loading && !error && blog &&
            <>
                <div className="blog-article-header">
                    <h2 className="blog-article-title">{blog.emoji ?? "🍟"}{blog.title}{blog.emoji ?? "🍟"}</h2>
                    { blog.desc && <p className="blog-article-desc">{blog.desc}</p> }
                    { blog.lastEdit && <p className="blog-article-time">最后更新于 {blog.lastEdit}</p> }
                </div>

                <hr />

                <div className="blog-article-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
                </div>
            </>
            }
        </div>
    </>);
})

export default ArticleViewer;