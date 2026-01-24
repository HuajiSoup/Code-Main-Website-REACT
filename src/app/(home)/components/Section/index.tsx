import React, { JSX } from "react";
import * as motion from "motion/react-m";
import { useTransform } from "motion/react";

import { useScrollValues } from "../SectionList";

import { SectionContent } from "../../page";

import "./index.scss";

type SectionProps = SectionContent & {
    listlength: number,
};

type Paragraphs = {
    contents: JSX.Element[],
}

const SectionTextWrapper: React.FC<Paragraphs> = ({ contents }) => {
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
    const { scrollYProgress } = useScrollValues();
    const titleScroll = useTransform(scrollYProgress,
        [props.id / props.listlength, (props.id + 2) / props.listlength],
        [700, -700],
    );

    return (
        <div
            className="section-wrapper"
            style={ {background: `url(${props.img.src}) center / cover no-repeat`, }}
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

                {/* <SpaceHolder height={"8vh"} /> */}

                <SectionTextWrapper contents={props.content} />
            </section>
        </div>
    );
};

export type {SectionProps};
export default Section;