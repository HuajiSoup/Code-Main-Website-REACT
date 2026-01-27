"use client";

import React, { createContext, useContext, useRef } from "react";
import { MotionValue, useScroll } from "motion/react";

import DetroitShadow from "../DetroitShadow";
import { SectionContent } from "../../page";
import Section from "../Section";

import "./index.scss";

type ScrollContextValue = {
    scrollY: MotionValue<number>,
    scrollYProgress: MotionValue<number>,
}

const scrollContext = createContext<ScrollContextValue | null>(null);

function useScrollValues(): ScrollContextValue {
    const res = useContext(scrollContext);
    if (!res) throw new Error("useScrollValues can only be called in <SectionList>.");
    return res;
}


type SectionListProps = {
    content: SectionContent[],
};

const SectionList: React.FC<SectionListProps> = ({content}) => {
    const sectionListRef = useRef(null);
    const { scrollY, scrollYProgress } = useScroll({
        target: sectionListRef,
        offset: ["start end", "end end"],
    });

    return (
        <scrollContext.Provider value={{ scrollY, scrollYProgress }}>
            <div className="sectionlist" ref={sectionListRef}>
                <DetroitShadow content={content} />
                <div className="sections-wrapper">
                    {content.map(section => 
                        <Section key={section.id} listlength={content.length} {...section}></Section>
                    )}
                </div>
            </div>
        </scrollContext.Provider>
    );
};

export { useScrollValues };
export default SectionList;