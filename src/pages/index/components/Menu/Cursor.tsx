import React from "react";
import { motion } from "motion/react";
import "./cursor.scss";

type DivRef = React.RefObject<HTMLDivElement | null>;

const CubeCursor: React.FC<{ref: DivRef}> = ({ ref }) => {
    return (<>
        <motion.div className="cursor" ref={ref}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                transition: {
                    ease: [0.0, 0.0, 0.0, 1.0],
                    duration: 0.3,
                    delay: 2.5,
                }
            }}
        >
            <div className="cube">
                <div className="surface front"></div>
                <div className="surface behind"></div>
                <div className="surface top"></div>
                <div className="surface bottom"></div>
                <div className="surface left"></div>
                <div className="surface right"></div>
            </div>
        </motion.div>
    </>);
}

export default CubeCursor;