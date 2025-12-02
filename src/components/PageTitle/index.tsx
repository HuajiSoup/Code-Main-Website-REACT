import React from "react";

import { rand } from "@/utils/math";

import "./index.scss";

type PageTitleProps = {
    title: string;
}

type Cloud = {
    x: number;
    y: number;
    scale: number;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    let clouds: Cloud[] = [];
    while (clouds.length < 5 || Math.random() < 0.3) {
        clouds.push({
            x: rand(0, 80),
            y: rand(-20, 20),
            scale: rand(0.8, 2),
        });
    }

    return (<>
        <div className="page-title">
            <div className="huaji-sun"></div>
            <div className="land"></div>
            {clouds.map((c, i) => (
                <div className="cloud"
                    key={i}
                    style={{
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        scale: c.scale,
                        animationDuration: `${15 * c.scale + rand(-1.2, 1.2)}s`,
                    }}
                >☁️</div>
            ))}
        </div>
    </>);
};

export default PageTitle;