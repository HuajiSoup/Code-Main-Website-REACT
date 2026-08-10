"use client";

import React, { createContext, useContext, useRef } from "react";
import { MotionValue, useScroll, useTransform } from "motion/react";

import DetroitShadow from "../DetroitShadow";
import { SectionContent } from "../../page";
import Section from "../Section";

import "./index.scss";

type ScrollContextValue = {
    scrollY: MotionValue<number>,
    scrollYProgress: MotionValue<number>,
    scrollAt: MotionValue<number>,
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

const SectionList: React.FC<SectionListProps> = ({ content }) => {
    const sectionListRef = useRef(null);
    const { scrollY, scrollYProgress } = useScroll({
        target: sectionListRef,
        offset: ["start end", "end end"],
    });
    
    const scrollValues = {
        scrollY,
        scrollYProgress,
        scrollAt: useTransform(scrollYProgress, v => v * content.length)
    }

    return (
        <scrollContext.Provider value={scrollValues}>
            <div className="sectionlist" ref={sectionListRef}>
                <DetroitShadow content={content} />
                <div className="sections-wrapper">
                    {content.map(section => 
                        <Section key={section.id} content={section}></Section>
                    )}
                </div>
            </div>
        </scrollContext.Provider>
    );
};

export { useScrollValues };
export default SectionList;