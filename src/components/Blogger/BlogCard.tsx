import React from "react";
import { useNavigate } from "react-router-dom";

import { BlogInfo } from "src/utils/blog";

const sectionColor: {[key : string] : string} = {
    "学术": "#ffaa00",
    "技术": "#0083d0",
    "生活": "#0c9300",
}

const BlogCard: React.FC<{blog: BlogInfo}> = ({ blog }) => {
    const navigate = useNavigate();
    const nav = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
        navigate(`/blog/${blog.blogID}`);
    }

    return (<>
        <div className="blog-content-card">
            <div className="blog-card-text-wrapper">
                <div className="blog-title-wrapper">
                    <h2 className="blog-title" onClick={nav}>
                        {blog.emoji ?? "🍟"}{blog.title ?? "无题"}
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
                    `url('${blog.cover}')`
                } : {} }
            ></div>
        </div>
    </>);
};

export { sectionColor };
export default BlogCard;