import React from "react";

import { BlogMeta } from "../../page";
import Link from "next/link";
import * as motion from "motion/react-m";
import { Variants } from "motion";
import { ArrowRight } from "lucide-react";

const sectionColor: {[key : string] : string} = {
    "学术": "#ffaa00",
    "技术": "#0083d0",
    "生活": "#0c9300",
}

const animationBlogCard: Variants = {
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            ease: "circOut",
            duration: 0.3,
        }
    },
    hidden: {
        opacity: 0,
        x: 75,
        transition: {
            ease: "circOut",
            duration: 0.3,
        }
    },
};

const BlogCard: React.FC<{blog: BlogMeta}> = ({ blog }) => {
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    return (<>
        <motion.div className="blog-content-card" variants={animationBlogCard}>
            <div className="blog-card-text-wrapper">
                <Link href={`/blog/${blog.blogID}`}>
                    <div className="blog-title-wrapper">
                        <h2 className="blog-title" onClick={scrollToTop}>
                            {blog.title}
                        </h2>
                        <ArrowRight className="blog-title-arrow" />
                    </div>
                    <p className="blog-time">{!blog.completed && <b>【连载中】</b>}{blog.lastEdit}</p>
                </Link>

                <hr />
                
                <div className="blog-detail-wrapper">
                    <p className="blog-desc">
                        {blog.section && <span className="blog-section"
                            style={{backgroundColor: sectionColor[blog.section] ?? "#3d3d3d"}}
                        >{blog.section}</span>}
                        {blog.emoji}{blog.desc}
                    </p>

                    <div className="blog-tags-list">
                        {blog.tags.map((tag, index) => (
                            <span key={index} className="blog-tag"># {tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <Link className="blog-card-cover-image"
                href={`/blog/${blog.blogID}`}
                onClick={scrollToTop}
                style={ blog.cover ? { backgroundImage: 
                    `url('${blog.cover}')`
                } : {} }
            />
        </motion.div>
    </>);
};

export { sectionColor };
export default BlogCard;