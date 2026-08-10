"use client";

import React, { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-m";

import "./index.scss";

import PlanetBox from "./PlanetBox";
import StarCanvas from "./StarCanvas";
import { PageInfo } from "@/constants/pages";
import CubeCursor from "./Cursor";

import { Home, Newspaper, Hammer } from "lucide-react";


type PlanetInfo = PageInfo & {
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
            </p>
        ),
        color: "lime",
        icon: Home,
        href: "/",
        pos: {
            x: 0.2,
            y: 0.65,
        },
        id: 0,
    },
    {
        title: "博客",
        desc: (
            <p>
                <b>稽之宇宙总图书馆！</b><br />
                阅读散落的滑稽先辈的文字，触摸古老的智慧。<br />
                经历████个春秋，这些文字虽古老，在今天细细品味却仍饶有价值。
            </p>
        ),
        color: "#ffaa00",
        icon: Newspaper,
        href: "/blog",
        pos: {
            x: 0.8,
            y: 0.5,
        },
        id: 1,
    },
    {
        title: "文物",
        desc: (
            <p>
                <b>稽之宇宙出土文物陈列馆！</b><br />
                这里陈列着从滑稽文明的遗址中出土的文物，经过悉心修复现已向公众开放。<br />
                这些遗物记录着一个文明的辉煌时刻，触摸它们、感受他们，也是一种别样的美感。
            </p>
        ),
        color: "#ee82ee",
        icon: Hammer,
        href: "/toy",
        pos: {
            x: 0.4,
            y: 0.32,
        },
        id: 2,
    }
];

const planetCount = planets.length;

const Menu: React.FC = () => {
    const [inView, setInView] = useState<boolean>(false); // for animation

    const refParent = useRef<HTMLDivElement | null>(null);
    const refCursor = useRef<HTMLDivElement | null>(null);
    const refCanvas = useRef<HTMLCanvasElement | null>(null);

    // perf: cache viewport size + RAF scheduling + active state dedup
    const refVw = useRef(0);
    const refVh = useRef(0);
    const refRafId = useRef<number | null>(null);
    const refMouse = useRef({ x: 0, y: 0 });
    const refActiveId = useRef(-1);

    useEffect(() => {
        const updateViewport = () => {
            refVw.current = window.innerWidth;
            refVh.current = window.innerHeight;
        };
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => {
            window.removeEventListener("resize", updateViewport);
            if (refRafId.current !== null) {
                cancelAnimationFrame(refRafId.current);
                refRafId.current = null;
            }
        };
    }, []);

    const handleCursor: React.MouseEventHandler = (event) => {
        // store latest mouse pos, schedule DOM writes in next frame
        refMouse.current.x = event.clientX;
        refMouse.current.y = event.clientY;
        if (refRafId.current !== null) return;
        refRafId.current = requestAnimationFrame(() => {
            refRafId.current = null;
            const cursor = refCursor.current;
            const canvas = refCanvas.current;
            if (!cursor || !canvas) return;

            const vw = refVw.current || window.innerWidth;
            const vh = refVh.current || window.innerHeight;
            const mx = refMouse.current.x / vw;
            const my = refMouse.current.y / vh;

            // move backgrounds (GPU-composited via transform)
            canvas.style.setProperty("--x", `${-mx * 5}vw`);
            canvas.style.setProperty("--y", `${-my * 5}vh`);

            // navigate planets
            let hitId = -1;
            for (let i = 0; i < planetCount; i++) {
                const pos = planets[i].pos;
                if (mx > pos.x - 0.05 && mx < pos.x + 0.05
                    && my > pos.y - 0.1 && my < pos.y + 0.1)
                {
                    hitId = i;
                    cursor.style.setProperty("--x", `${pos.x * 100}vw`);
                    cursor.style.setProperty("--y", `${pos.y * 100}vh`);
                    break;
                }
            }
            if (hitId === -1) {
                cursor.style.setProperty("--x", `${mx * 100}vw`);
                cursor.style.setProperty("--y", `${my * 100}vh`);
            }
            // dedup classList writes
            if (hitId >= 0 && refActiveId.current !== hitId) {
                cursor.classList.add("active");
                refActiveId.current = hitId;
            } else if (hitId === -1 && refActiveId.current !== -1) {
                cursor.classList.remove("active");
                refActiveId.current = -1;
            }
        });
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
            <h2 className="menu-title">欢迎造访<br />稽之宇宙</h2>
            
            {inView && <>
                <StarCanvas ref={refCanvas} />
                <div className="huaji-sun"></div>
                <PlanetBox planets={planets} />
                <CubeCursor ref={refCursor} />
            </>}
        </motion.div>
    </>);
}

export type { PlanetInfo };
export default Menu;