import React, { useEffect, useRef } from "react";

import { motion, useMotionValueEvent, useScroll } from "motion/react";

import "./index.scss";

const DetroitShadow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const { scrollYProgress } = useScroll();

    // Size init
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctxRef.current = canvas.getContext("2d");
        }
    }, []);

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        console.log(progress);
    });

    return (
        <canvas className="detroit" ref={canvasRef}></canvas>
    );
};

export default DetroitShadow;