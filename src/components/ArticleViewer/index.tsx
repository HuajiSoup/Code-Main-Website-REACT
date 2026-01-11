import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { BlogInfo, metaToBlogInfo } from "../Blogger/BlogLister";

type ArticleViewerProps = {
    blogID: string;
}

const ArticleViewer: React.FC<ArticleViewerProps> = memo(({ blogID }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blog, setBlog] = useState<BlogInfo | null>(null);
    const [md, setMd] = useState<string>("");

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            
            try {
                const response = await fetch(`/api/blog?id=${blogID}`);
                const data = await response.json();
                setMd(data.content);
                setBlog(metaToBlogInfo(data.metadata));
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [blogID]);

    const navigate = useNavigate();
    const backToList = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
        navigate("/blog");
    }

    return (<>
        <div className="blog-article-exit" onClick={backToList}>返回</div>
        <div className="blog-article-card">
            { loading && <p>▶️文章绝赞加载中...</p> }
            { !loading && error && <p>🚫文章加载失败！{error}</p> }
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