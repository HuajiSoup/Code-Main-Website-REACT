import React, { memo } from "react";
import "./index.scss";

import { AnimatePresence } from "motion/react";

import BlogViewer from "../../pages/blog/components/BlogViewer";
import AnimatedPanel from "./AnimatedPanel";
import BlogLister from "./BlogLister";

type BloggerProps = {
    blogID?: string;
}

const Blogger: React.FC<BloggerProps> = memo(({ blogID }) => {
    return (<>
        <div className="blogger-root">
            <AnimatePresence mode="wait">
                { !blogID && <AnimatedPanel className="blogger-lister-root" key="blog-list">
                    <BlogLister />
                </AnimatedPanel> }
                { blogID && <AnimatedPanel className="blogger-article-root" key="article">
                    <BlogViewer blogID={blogID} />
                </AnimatedPanel> }
            </AnimatePresence>
        </div>
    </>);
});

export default Blogger;