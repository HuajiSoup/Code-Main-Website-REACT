import React from "react";
import { Variants } from "motion/react";
import * as motion from "motion/react-m";

export type AnimatedPanelProps = {
    className?: string;
    children?: React.ReactNode;
};

const defaultAnimation: Variants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            ease: "easeOut",
            duration: 0.25,
        }
    },
    hidden: {
        opacity: 0,
        y: 150,
        transition: {
            ease: "easeOut",
            duration: 0.25,
        }
    },
};

const AnimatedPanel: React.FC<AnimatedPanelProps> = ({
    className = "",
    children = <></>,
}) => {
    return (
        <motion.div
            className={className}
            variants={defaultAnimation}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPanel;
