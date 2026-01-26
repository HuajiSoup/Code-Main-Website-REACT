import React from "react";
import { Variants } from "motion/react";
import * as motion from "motion/react-m";

export type AnimatedPanelProps = React.ComponentProps<typeof motion.div>;

const defaultAnimation: Variants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            ease: "circOut",
            duration: 0.25,
        }
    },
    hidden: {
        opacity: 0.15,
        y: 300,
        transition: {
            ease: "circOut",
            duration: 0.25,
        }
    },
};

const AnimatedDiv: React.FC<AnimatedPanelProps> = ({
    children,
    ...props
}) => {
    return (
        <motion.div
            variants={defaultAnimation}
            initial="hidden"
            animate="visible"
            exit="hidden"
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedDiv;
