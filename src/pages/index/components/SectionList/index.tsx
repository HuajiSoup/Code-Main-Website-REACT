import React from "react";
import "./index.scss";

import Section from "../Section";
import { SectionProps } from "../Section";
import DetroitShadow from "../DetroitShadow";

type SectionListProps = {
    children: SectionProps[],
};

const SectionList: React.FC<SectionListProps> = ({children}) => {
    return (
        <div className="sectionlist">
            <DetroitShadow></DetroitShadow>
            {children.map(section => 
                <Section key={section.id} {...section}></Section>
            )}
        </div>
    );
};

export default SectionList;