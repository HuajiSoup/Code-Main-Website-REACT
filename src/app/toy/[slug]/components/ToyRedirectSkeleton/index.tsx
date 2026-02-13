import React from "react";
import "./index.scss";

const ToyRedirectSkeleton: React.FC = () => {
    return (<>
        <div className="toy-redirect-skeleton-root">
            <div className="toy-redirect-skeleton-card">
                正在跳转中...
            </div>
        </div>
    </>);
}

export default ToyRedirectSkeleton;