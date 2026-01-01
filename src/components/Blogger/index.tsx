import React, { memo, useEffect, useRef, useState } from "react";
import "./index.scss";

import { AnimatePresence } from "motion/react";

import ArticleViewer from "../ArticleViewer";
import AnimatedPanel from "./AnimatedPanel";
import BlogCard from "./BlogCard";

import { BlogInfo, postToBlogInfo } from "src/utils/notion";
import { sectionColor } from "./BlogCard";
import SearchBar, { SearchBarHandle } from "../SearchBar";

type BloggerProps = {
    blogID?: string;
}

const Blogger: React.FC<BloggerProps> = memo((props) => {
    const [blogs, setBlogs] = useState<BlogInfo[]>([]);
    const [showBlogs, setShowBlogs] = useState<BlogInfo[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");

    const inputRef = useRef<SearchBarHandle | null>(null);
    const searchAdd = (v: string) => {
        inputRef.current?.setInput(search ? `${search} ${v}` : v);
    }
    
    // internet
    useEffect(() => {
        const fetchBlogs = async () => {
            if (blogs.length) return;

            setLoading(true);
            try {
                const res = await fetch("/api/notion");
                const data = await res.json();
                const blogs: BlogInfo[] = data.results.map(postToBlogInfo);
                setBlogs(blogs);
                setShowBlogs(blogs);
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
    }, [blogs]);

    // search
    useEffect(() => {
        if (search === "") {
            setShowBlogs(blogs);
            return;
        }
        
        const terms = search.split(" ");
        setShowBlogs(blogs.filter(blog => {
            for (const term of terms) {
                if (!term) continue;
                if (blog.title?.indexOf(term) !== -1
                    || blog.desc?.indexOf(term) !== -1
                    || blog.section === term
                    || blog.tags.includes(term)
                ) return true;
            }
            return false;
        }));
    }, [search, blogs]);

    return (<>
        <div className="blogger-root">
            <div className="blog-menu-wrapper">
                <div className="menu-search-wrapper">
                    <SearchBar setTermCallback={setSearch} changeInterval={250} ref={inputRef} />
                </div>

                <div className="menu-sections-wrapper">
                    <p>📚分类</p>
                    <hr />
                    <div className="menu-sections-list">
                        { Object.keys(sectionColor).map((section, index) => (
                            <div className="menu-section-btn" key={index}
                                onClick={() => searchAdd(section)}
                            >{section}</div>
                        )) }
                    </div>
                </div>

                <div className="menu-tags-wrapper">
                    <p>🏷️标签</p>
                    <hr />
                    <div className="menu-tags-list">
                        { ([] as string[]).concat( ...blogs.map(blog => blog.tags) ).map((tag, index) => (
                            <div className="menu-tag-btn" key={index}
                                onClick={() => searchAdd(tag)}
                            ># {tag}</div>
                        )) }
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                { props.blogID
                ? <AnimatedPanel className="blog-article-wrapper" key="article">
                    <ArticleViewer blogID={props.blogID} />
                </AnimatedPanel>

                : <AnimatedPanel className="blogs-list" key="list">
                    { loading && <div className="blog-status-card loading">▶️博客绝赞加载中...</div> }
                    { !loading && error && <div className="blog-status-card error">🚫文章列表加载失败！{error}</div> }
                    { !loading && !error && (
                        showBlogs.length
                            ? showBlogs.map((blog, index) => (
                                <BlogCard key={index} blog={blog} />
                            ))
                            : <div className="blog-status-card error">🔍未搜索到匹配“{search}”的结果！</div>
                        )
                    }
                </AnimatedPanel>
                }
            </AnimatePresence>
        </div>
    </>);
});

export default Blogger;