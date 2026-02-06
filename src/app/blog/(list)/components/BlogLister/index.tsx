"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import "./index.scss";

import SearchBar, { SearchBarHandle } from "@/components/SearchBar";
import BlogCard, { sectionColor } from "./BlogCard";
import AnimatedDiv from "@/components/AnimatedDiv";

import { BlogMeta } from "../../page";

const extractTags = (blogs: BlogMeta[]): string[] => {
    const tags: Set<string> = new Set();
    for (const blog of blogs) {
        for (const tag of blog.tags) tags.add(tag);
    }
    return Array.from(tags);
}

type BlogListerProps = {
    blogs: BlogMeta[],
}

const BlogLister: React.FC<BlogListerProps> = memo(({ blogs }) => {
    const [showBlogs, setShowBlogs] = useState<BlogMeta[]>(blogs);
    const [search, setSearch] = useState<string>("");

    const inputRef = useRef<SearchBarHandle | null>(null);
    const searchAdd = (v: string) => {
        inputRef.current?.setInput(search ? `${search} ${v}` : v);
    }

    // search
    useEffect(() => {
        const query = search.trim().toUpperCase();
        if (!query) {
            setShowBlogs(blogs);
            return;
        }
        
        const terms = query.split(" ").filter(term => term);
        setShowBlogs(blogs.filter(blog => {
            for (const term of terms) {
                if (blog.title?.toUpperCase().indexOf(term) !== -1
                    || blog.desc?.toUpperCase().indexOf(term) !== -1
                    || blog.section === term
                    || blog.tags.some(tag => tag.toUpperCase().indexOf(term) !== -1)
                ) return true;
            }
            return false;
        }));
    }, [search, blogs]);

    return (<>
    <AnimatedDiv className="blogger-lister-root">
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
                            <div className="menu-section-btn"
                                key={index}
                                onClick={() => searchAdd(section)}
                            >{section}</div>
                        )) }
                    </div>
                </div>

                <div className="menu-tags-wrapper">
                    <p className="menu-title">🏷️标签</p>
                    <hr />
                    <div className="menu-tags-list">
                        { extractTags(blogs).map((tag, index) => (
                            <div className="menu-tag-btn"
                                key={index}
                                onClick={() => searchAdd(tag)}
                            ># {tag}</div>
                        )) }
                    </div>
                </div>
            </div>
        </div>

        <div className="blogs-list">
            { showBlogs.map((blog) => <BlogCard key={blog.blogID} blog={blog} />) }
        </div>
    </AnimatedDiv>
    </>);
});
BlogLister.displayName = "BlogLister";

export default BlogLister;