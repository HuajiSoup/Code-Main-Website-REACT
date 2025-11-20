import React, { JSX, useRef } from "react";
import "./index.scss";

import SpaceHolder from "@/components/SpaceHolder";
import { motion, useScroll, useTransform } from "motion/react";

type SectionProps = {
    title: string,
    content: JSX.Element[],
    color: string,
    img: string,
    id: number,
};

type SectionWrapperProps = {
    contents: JSX.Element[],
}

const ContentWrapper: React.FC<SectionWrapperProps> = ({ contents }) => {
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
    const { scrollYProgress } = useScroll({
        target: wrapperRef, 
        offset: ["end start", "start end"]
    });
    const titleScroll = useTransform(scrollYProgress, [0, 1], [-750, 750]);

    return (
        <div
            ref={wrapperRef}
            className="section-wrapper"
            style={ {background: `url(${props.img}) center / cover no-repeat`, }}
        >
            <section>
                <motion.div style={{y: titleScroll}}>
                    <motion.h2 className="section-index">{`#00${props.id}`}</motion.h2>
                    <motion.h2 className="section-title">{props.title}</motion.h2>
                </motion.div>

                <SpaceHolder height={"14vh"}></SpaceHolder>

                <ContentWrapper contents={props.content}></ContentWrapper>
            </section>
        </div>
    );
};

export default Section;
export type {SectionProps};