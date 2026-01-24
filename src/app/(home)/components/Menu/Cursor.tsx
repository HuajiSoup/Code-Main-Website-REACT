import React from "react";
import "./cursor.scss";

type DivRef = React.RefObject<HTMLDivElement | null>;

const CubeCursor: React.FC<{ref: DivRef}> = ({ ref }) => {
    return (<>
        <div className="cursor" ref={ref}>
            <div className="cube">
                <div className="surface front"></div>
                <div className="surface behind"></div>
                <div className="surface top"></div>
                <div className="surface bottom"></div>
                <div className="surface left"></div>
                <div className="surface right"></div>
            </div>
        </div>
    </>);
}

export default CubeCursor;