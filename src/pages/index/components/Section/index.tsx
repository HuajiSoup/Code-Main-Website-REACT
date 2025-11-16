import React, { JSX } from "react";

import SpaceHolder from "@/components/SpaceHolder";
import "./index.scss";

type SectionProps = {
    title: string,
    content: JSX.Element[],
    color: string,
    img: string,
};

const Section: React.FC<SectionProps> = (props) => {
    return (
        <div
            className="section-wrapper"
            style={ {background: `url(${props.img}) center / cover no-repeat`, }}
        >
            <section>
                <h2>{props.title}</h2>
                <SpaceHolder height={"20vh"}></SpaceHolder>
                <div className="section-content-wrapper">
                    {props.content}
                </div>
            </section>
        </div>
    );
};

export default Section;