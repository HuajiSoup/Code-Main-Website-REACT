"use client";

import React, { memo, useMemo, useRef, useState } from "react";
import "./index.scss";

import SearchBar, { SearchBarHandle } from "@/components/SearchBar";
import BlogCard from "./BlogCard";
import AnimatedDiv from "@/components/AnimatedDiv";

import { BlogMeta } from "../../page";
import { stagger, Variants } from "motion/react";

const extractTags = (blogs: BlogMeta[]): string[] => {
    const tags: Set<string> = new Set();
    for (const blog of blogs) {
        for (const tag of blog.tags) tags.add(tag);
    }
    return Array.from(tags).sort((sa, sb) => sa < sb ? -1 : 1);
}

type BlogListerProps = {
    blogs: BlogMeta[],
}

const animationBlogList: Variants = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: stagger(0.05, { ease: "easeOut" }),
        }
    },
};

const BlogLister: React.FC<BlogListerProps> = memo(({ blogs }) => {
    const [search, setSearch] = useState<string>("");
    const [tagged, setTagged] = useState<string | null>(null);

    const inputRef = useRef<SearchBarHandle | null>(null);

    const tagToggle = (tag: string) => {
        setTagged(tagged === tag ? null : tag);
    }

    const showBlogs = useMemo(() => {
        const query = search.trim().toUpperCase();
        const taggedBlogs = tagged
            ? blogs.filter((blog) => 
                blog.tags.some(tag => tag.toUpperCase() === tagged.toUpperCase())
            ) : blogs;
        if (!query) return taggedBlogs;
        
        const terms = query.split(" ").filter(Boolean);
        return taggedBlogs.filter(blog => {
            for (const term of terms) {
                if ((blog.title.toUpperCase().indexOf(term) !== -1
                    || blog.desc.toUpperCase().indexOf(term) !== -1)
                    && (!tagged || blog.tags.some(tag => tag.toUpperCase() === tagged.toUpperCase()))
                ) return true;
            }
            return false;
        });
    }, [search, tagged, blogs]);

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

                <div className="menu-tags-wrapper">
                    <p className="menu-title"><b>标签</b></p>
                    <hr />
                    <div className="menu-tags-list">
                        {extractTags(blogs).map((tag, index) => (
                            <div className={`menu-tag-btn ${tagged === tag ? "selected" : ""}`}
                                key={index}
                                onClick={() => tagToggle(tag)}
                            ># {tag}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <AnimatedDiv
            className="blogs-list"
            key={`${search}-${tagged}` || "all"}
            variants={animationBlogList}
        >
            {(showBlogs.length)
                ? showBlogs.map((blog) => <BlogCard key={blog.slug} blog={blog} />) 
                : <div className="blog-status-card loading">没有找到“{search}”相关的博客喵</div>
            }
        </AnimatedDiv>
    </AnimatedDiv>
    </>);
});
BlogLister.displayName = "BlogLister";

export default BlogLister;