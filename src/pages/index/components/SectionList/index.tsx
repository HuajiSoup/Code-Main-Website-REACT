import React, { createContext, useContext, useRef } from "react";
import "./index.scss";

import Section from "../Section";
import { SectionProps } from "../Section";
import DetroitShadow from "../DetroitShadow";

import { MotionValue, useScroll } from "motion/react";

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
    content: SectionProps[],
};

const SectionList: React.FC<SectionListProps> = ({content}) => {
    const sectionListRef = useRef(null);
    const { scrollY, scrollYProgress } = useScroll({
        target: sectionListRef,
        offset: ["start end", "end end"],
    });
    const valueRef = useRef<ScrollContextValue>(
        { scrollY, scrollYProgress }
    );
    
    // useMotionValueEvent(scrollY, "change", latest => console.log(latest));

    return (
        <scrollContext.Provider value={valueRef.current}>
            <div className="sectionlist" ref={sectionListRef}>
                <DetroitShadow content={content} />
                {content.map(section => 
                    <Section key={section.id} {...section}></Section>
                )}
            </div>
        </scrollContext.Provider>
    );
};

export { useScrollValues };
export default SectionList;