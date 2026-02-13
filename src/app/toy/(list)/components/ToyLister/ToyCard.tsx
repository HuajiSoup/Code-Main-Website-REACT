import React from "react";
import * as motion from "motion/react-m";
import { Variants } from "motion/react";

import Link from "next/link";
import { ToyData } from "../../page";
import { ArrowRight } from "lucide-react";

const animationToyCard: Variants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            ease: "circOut",
            duration: 0.25,
        }
    },
    hidden: {
        opacity: 0,
        y: 100,
        transition: {
            ease: "circOut",
            duration: 0.25,
        }
    },
};

const ToyCard: React.FC<{toy: ToyData}> = ({ toy }) => {
    return (<>
        <motion.div className="toy-card" variants={animationToyCard}>
            <Link href={toy.url} target="_blank" rel="noreferrer">
                <div className="toy-card-title-wrapper">
                    <div className="toy-card-cover" style={{
                        backgroundImage: `url(${toy.icon})`
                    }}></div>
                    <h2 className="toy-card-title">{toy.title}</h2>
                    <ArrowRight className="toy-card-arrow" />
                </div>
            </Link>

            <hr />
            
            <div className="toy-card-desc">
                <p>{toy.desc}</p>
            </div>
        </motion.div>
    </>);
}

export default ToyCard;