import React, { memo, useEffect, useState } from "react";
import "./index.scss";

import { Link, useNavigate } from "react-router-dom";

import ArticleViewer from "../ArticleViewer";

import { BlogInfo, postToBlogInfo } from "src/utils/notion";

type BloggerProps = {
    blogID?: string;
}

type NameColorPair = {
    [key : string] : string;
}

const sectionColor: NameColorPair = {
    "学术": "#ffaa00",
    "技术": "#0083d0",
    "生活": "#0c9300",
}

const BlogCard: React.FC<{blog: BlogInfo}> = ({ blog }) => {
    const navigate = useNavigate();
    const nav = () => navigate(`/blog/${blog.pageID}`);

    return (<>
        <div className="blog-content-card">
            <div className="blog-card-text-wrapper">
                <div className="blog-title-wrapper">
                    <h2 className="blog-title" onClick={nav}>
                        {blog.emoji ?? "🍟"}◇{blog.title ?? "无题"}
                    </h2>
                    <p className="blog-time">{blog.lastEdit}</p>
                </div>

                <hr />
                
                <div className="blog-detail-wrapper">
                    <p className="blog-desc">
                        <span className="blog-section"
                            style={{backgroundColor: sectionColor[blog.section] ?? "#3d3d3d"}}
                        >{blog.section}</span>
                        {blog.desc ?? <i>没写简介喵</i>}
                    </p>

                    <div className="blog-tags-list">
                        {blog.tags.map((tag, index) => (
                            <span key={index} className="blog-tag"># {tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="blog-card-cover-image"
                onClick={nav}
                style={ blog.cover ? { backgroundImage: 
                    `url('api/notionImageProxy?url=${encodeURIComponent(blog.cover)}')`
                } : {} }
            ></div>
        </div>
    </>);
};

const Blogger: React.FC<BloggerProps> = memo((props) => {
    const [blogs, setBlogs] = useState<BlogInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/notion");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                
                const data = await res.json();
                const posts = data.results.map(postToBlogInfo);
                setBlogs(posts);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();

        // const testBlogs: BlogInfo[] = [
        //     {
        //         id: 0,
        //         title: "How to suck a duck",
        //         icon: "🌻",
        //         cover: "https://www.huaji-universe.top/res/huaji.png",
        //         desc: "I AM A GAY",
        //         section: "技术",
        //         tags: ["tech", "animals"],
        //         lastEdit: "2007-01-30",
        //         show: true,
        //     },
        //     {
        //         id: 1,
        //         title: "Minecraft Player",

        
        //         icon: "🍓",
        //         cover: null,
        //         desc: "Mojang 我喜欢你",
        //         section: "学术",
        //         tags: ["games"],
        //         lastEdit: "2007-01-30",
        //         show: true,
        //     },
        // ];
        // setBlogs(testBlogs);
        // setLoading(false);
    }, []);

    return (<>
        <div className="blogger-root">
            { props.blogID
                ? <ArticleViewer blogID={props.blogID} />
                : <div className="blogs-list">
                    { loading && <div className="blog-status-card loading">▶️内容绝赞加载中...</div> }
                    { !loading && error && <div className="blog-status-card error">🚫文章加载失败！{error}</div> }
                    { !loading && !error && blogs.map((blog, index) => (
                        <BlogCard key={index} blog={blog} />
                    ))}
                </div>
            }
        </div>
    </>);
});

export default Blogger;