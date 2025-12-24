import React, { useRef, useState } from "react";
import { motion } from "motion/react";

import "./index.scss";

import PlanetBox from "./PlanetBox";
import { pageInfo } from "src/constants/pages";

import svgHome from "src/assets/menu/icon-home.svg";
import svgBlog from "src/assets/menu/icon-newspaper.svg";
import CubeCursor from "./Cursor";

import StarCanvas from "./StarCanvas";

type PlanetInfo = pageInfo & {
    desc: React.ReactNode;
    color: string;
    pos: { 
        // percentage
        x: number;
        y: number;
    },
    id: number,
};

const planets: PlanetInfo[] = [
    {
        title: "主页",
        desc: (
            <p>
                原地tp——<br />
                欢迎回来！这里是<b>稽之宇宙的中心</b>，<b>滑稽能量导航区</b>。<br />
                祝您今天依旧保持滑稽，一览众稽小！
            </p>),
        color: "lime",
        icon: svgHome,
        href: "/",
        pos: {
            x: 0.2,
            y: 0.65,
        },
        id: 0,
    },
    {
        title: "博客",
        desc: (<p>
                <b>稽之宇宙总图书馆！</b><br />
                阅读散落的滑稽先辈的文字，触摸古老的智慧。<br />
                经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。
            </p>),
        color: "#ffaa00",
        icon: svgBlog,
        href: "/blog",
        pos: {
            x: 0.8,
            y: 0.5,
        },
        id: 1,
    }
];

const planetCount = planets.length;

const SunBox: React.FC = () => {
    return (<>
        <motion.div className="huaji-sun"
            initial={{
                y: 300,
            }}
            animate={{
                y: 0,
                transition: {
                    ease: [0.0, 0.0, 0.0, 1.0],
                    duration: 1.75,
                    delay: 1,
                },
            }}
        />
    </>)
};

const Menu: React.FC = () => {
    const [inView, setInView] = useState<boolean>(false); // for animation

    const refParent = useRef<HTMLDivElement | null>(null);
    const refCursor = useRef<HTMLDivElement | null>(null);
    const refCanvas = useRef<HTMLCanvasElement | null>(null);

    const handleCursor: React.MouseEventHandler = (event) => {
        if (!refCursor.current || !refCanvas.current) return;

        const mx = event.clientX / window.innerWidth;
        const my = event.clientY / window.innerHeight;

        // move backgrounds
        refCanvas.current.style.left = `${-mx * 5}vw`;
        refCanvas.current.style.top  = `${-my * 5}vh`;

        // navigate planets
        for (let i = 0; i < planetCount; i++) {
            const pos = planets[i].pos;
            if (mx > pos.x - 0.05 && mx < pos.x + 0.05
                && my > pos.y - 0.1 && my < pos.y + 0.1)
            {
                refCursor.current.style.left = `${pos.x * 100}vw`;
                refCursor.current.style.top  = `${pos.y * 100}vh`;
                refCursor.current.classList.add("active");
                return;
            }
        }
        refCursor.current.style.left = `${mx * 100}vw`;
        refCursor.current.style.top  = `${my * 100}vh`;
        refCursor.current.classList.remove("active");
    }
    
    return (<>
        <motion.div className="index-menu-wrapper" 
            ref={refParent}
            onMouseMove={handleCursor}
            onViewportEnter={() => inView || setInView(true)}
            viewport={{
                once: true,
                amount: 0.3,
            }}
        >
            <h2 className="menu-title">欢迎来到稽之宇宙</h2>
            
            {inView && <>
                <StarCanvas ref={refCanvas} />
                <SunBox />
                <PlanetBox planets={planets} />
                <CubeCursor ref={refCursor} />
            </>}
        </motion.div>
    </>);
}

export type { PlanetInfo };
export default Menu;