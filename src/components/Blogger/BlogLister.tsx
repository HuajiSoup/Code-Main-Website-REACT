import React, { memo, useEffect, useRef, useState } from "react";

import SearchBar, { SearchBarHandle } from "../SearchBar";
import BlogCard, { sectionColor } from "./BlogCard";

import { storageBlogsUrl } from "src/constants/storage";

type BlogInfo = {
    title: string | null;
    blogID: string | null;
    emoji: string | null;
    cover: string | null;
    desc: string | null;
    section: string;
    tags: string[];
    lastEdit: string | null;
    completed: boolean;
}

// AliyunOSS
const metaToBlogInfo = (meta: any): BlogInfo => {
    const date = new Date(Number(meta?.lastEdit ?? 0));

    return {
        title: meta?.title,
        blogID: meta?.blogID,
        emoji: meta?.emoji,
        cover: meta?.cover ? `${storageBlogsUrl}/blog-${meta.blogID}/${meta.cover}` : null,
        desc: meta?.desc,
        section: meta?.section,
        tags: meta?.tags,
        lastEdit: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        completed: meta?.completed ?? true,
    }
}

const extractTags = (blogs: BlogInfo[]): string[] => {
    let tags: Set<string> = new Set();
    for (const blog of blogs) {
        for (const tag of blog.tags) tags.add(tag);
    }
    return Array.from(tags);
}

const BlogLister: React.FC = memo(() => {
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
            setLoading(true);
            try {
                const res = await fetch("/api/bloglist");
                const metadatas: any[] = await res.json();
                const blogs = metadatas.map(metaToBlogInfo);
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
    }, []);

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
        <div className="blog-menu-wrapper">
            <div className="menu-profile-wrapper">
                <div className="menu-profile-photo"></div>
                <p><b>🍟一只神秘的滑稽哦🍟</b></p>
            </div>

            <div className="menu-sticky-cards">
                <div className="menu-search-wrapper">
                    <SearchBar setTermCallback={setSearch} changeInterval={250} ref={inputRef} />
                </div>

                <div className="menu-sections-wrapper">
                    <p className="menu-title">📚分类</p>
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
                    <p className="menu-title">🏷️标签</p>
                    <hr />
                    <div className="menu-tags-list">
                        { extractTags(showBlogs).map((tag, index) => (
                            <div className="menu-tag-btn" key={index}
                                onClick={() => searchAdd(tag)}
                            ># {tag}</div>
                        )) }
                    </div>
                </div>
            </div>
        </div>

        <div className="blogs-list">
            { loading && <div className="blog-status-card loading">▶️博客绝赞加载中...</div> }
            { (!loading && error) && <div className="blog-status-card error">🚫文章列表加载失败！{error}</div> }
            { (!loading && !error && showBlogs.length !== 0) &&
                showBlogs.map((blog, index) => (
                    <BlogCard key={index} blog={blog} />
                ))
            }
            { (!loading && !error && showBlogs.length === 0) && 
                <div className="blog-status-card error">🔍未搜索到匹配“{search}”的结果！</div>
            }
        </div>
    </>);
})

export type { BlogInfo };
export { metaToBlogInfo };
export default BlogLister;