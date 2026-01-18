import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";

import { BlogInfo, metaToBlogInfo } from "../../../../components/Blogger/BlogLister";
import { storageBlogsUrl } from "src/constants/storage";
import MyMarkdown from "src/components/MyMarkdown";

type ArticleViewerProps = {
    blogID: string;
}

const BlogViewer: React.FC<ArticleViewerProps> = memo(({ blogID }) => {
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

                const blog = metaToBlogInfo(data.metadata);
                const markdown = (data.content as string).replaceAll(
                    /(!\[.*?\]\()(\.\/)(.*?\))/g,
                    `$1${storageBlogsUrl}/blog-${blog.blogID}/$3`
                ); // image path relative to storage
                setMd(markdown);
                setBlog(blog);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [blogID]);

    const ScrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    return (<>
        <Link to={"/blog"} className="blog-article-exit" onClick={ScrollToTop}>返回</Link>
        <div className="blog-article-card">
            { loading && <p className="blog-article-status">▶️文章绝赞加载中...</p> }
            { !loading && error && <p className="blog-article-status">🚫文章加载失败或不存在！{error}</p> }
            { !loading && !error && blog &&
            <>
                { blog.cover && <div className="blog-article-cover" style={{
                    backgroundImage: `url(${blog.cover})`
                }}></div> }
                <div className="blog-article-header">
                    <h2 className="blog-article-title">{blog.emoji ?? "🍟"}{blog.title}{blog.emoji ?? "🍟"}</h2>
                    { blog.desc && <p className="blog-article-desc">{blog.desc}</p> }
                    { blog.lastEdit && <p className="blog-article-time">
                        {!blog.completed && <b>【连载中】</b>}最后更新于{blog.lastEdit}
                    </p> }
                </div>

                <hr />
                <div className="blog-article-body">
                    <MyMarkdown>{md}</MyMarkdown>
                </div>
                <hr />
            </>
            }
        </div>
    </>);
})

export default BlogViewer;