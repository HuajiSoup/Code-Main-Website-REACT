import React, { JSX, useRef } from "react";

import { motion, useTransform } from "motion/react";

import { useScrollValues } from "../SectionList";

import SpaceHolder from "@/components/SpaceHolder";

import "./index.scss";

type SectionProps = {
    title: string,
    content: JSX.Element[],
    color: string,
    img: string,
    id: number,
};

type SectionTextWrapperProps = {
    contents: JSX.Element[],
}

const SectionTextWrapper: React.FC<SectionTextWrapperProps> = ({ contents }) => {
    return (
        <div className="section-content-wrapper">
            {contents.map((content, index) => (
                <motion.div key={index}
                    initial={{
                        x: -150,
                        opacity: 0,
                    }}
                    whileInView={{
                        x: 0,
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5*index,
                        ease: "circOut",
                    }}
                >{content}</motion.div>
            ))}
        </div>
    );
};

const Section: React.FC<SectionProps> = (props) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { scrollY } = useScrollValues();
    const titleScroll = useTransform(scrollY,
        [window.innerHeight * (props.id), window.innerHeight * (props.id + 2)],
        [750, -750],
    );

    return (
        <div
            ref={wrapperRef}
            className="section-wrapper"
            style={ {background: `url(${props.img}) center / cover no-repeat`, }}
        >
            <section>
                <motion.div
                    style={{y: titleScroll}}
                    initial={{visibility: "hidden"}}
                    animate={{visibility: "visible"}}
                >
                    <h2 className="section-index">{`#00${props.id + 1}`}</h2>
                    <h2 className="section-title">{props.title}</h2>
                </motion.div>

                <SpaceHolder height={"8vh"} />

                <SectionTextWrapper contents={props.content} />
            </section>
        </div>
    );
};

export type {SectionProps};
export default Section;