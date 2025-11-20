import React, { JSX } from "react";
import "./index.scss";

import SpaceHolder from "@/components/SpaceHolder";
import { motion } from "motion/react";

type SectionProps = {
    title: string,
    content: JSX.Element[],
    color: string,
    img: string,
    id: number,
};

const Section: React.FC<SectionProps> = (props) => {
    return (
        <div
            className="section-wrapper"
            style={ {background: `url(${props.img}) center / cover no-repeat`, }}
        >
            <section>
                <h2 className="section-index">{`#00${props.id}`}</h2>
                <h2 className="section-title">{props.title}</h2>

                <SpaceHolder height={"14vh"}></SpaceHolder>

                <div className="section-content-wrapper">
                    {props.content.map((content, index) => (
                        <React.Fragment key={index}>{content}</React.Fragment>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Section;
export type {SectionProps};