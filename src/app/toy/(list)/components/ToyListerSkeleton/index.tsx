import React from "react";

import "./index.scss";

const ToyListerSkeleton: React.FC = () => {
    return (<>
        <div className="toyer-skeleton-root">
            {[1, 2, 3].map((_, index) => (
                <div className="toy-card-skeleton" key={index}></div>
            ))}
        </div>
    </>);
}

export default ToyListerSkeleton;