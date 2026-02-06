import React from "react";

import "./index.scss";

const BlogListerSkeleton: React.FC = () => {
    return (<>
        <div className="blogger-list-skeleton-root">
            <div className="blogs-menu-skeleton"></div>
            <div className="blogs-list-skeleton">
                {[1, 2, 3].map((_, index) => (
                    <div className="blog-card-skeleton" key={index}></div>
                ))}
            </div>
        </div>
    </>);
}

export default BlogListerSkeleton;