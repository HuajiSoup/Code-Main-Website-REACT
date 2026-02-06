import React from "react";

import "./index.scss";

const BlogViewerSkeleton: React.FC = () => {
    return (<>
        <div className="blogger-article-skeleton-root">
            <div className="article-card-skeleton"></div>
        </div>
    </>);
}

export default BlogViewerSkeleton;