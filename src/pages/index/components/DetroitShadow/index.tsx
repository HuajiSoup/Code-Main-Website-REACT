import React, { useEffect, useRef } from "react";
import { MotionValue, useInView, useMotionValueEvent, useSpring, useTime, useTransform } from "motion/react";

import { canvasCtxScaledAsDPR } from "src/utils/canvas";
import { clamp, rand } from "src/utils/math";
import { throttle } from "src/utils/timer";

import { useScrollValues } from "../SectionList";
import { SectionContent } from "../..";
import { DetroitDrawer, DIRECTION, spawnTriangles } from "./triangles";

import "./index.scss";

type Ctx2D = CanvasRenderingContext2D;
type Canva = HTMLCanvasElement;

function useColorTransform(scrollYProgress: MotionValue<number>, colorIDMap: SectionContent[]) {
    const rangeY     = colorIDMap.map((content, index) => (index+1) / colorIDMap.length);
    const rangeColor = colorIDMap.map(content => content.color);
    return useTransform(scrollYProgress, rangeY, rangeColor);
}

const DetroitShadow: React.FC<{content: SectionContent[]}> = ({content: colorIDMap}) => {
    // keep a ref copy so the animation loop reads latest triangles without re-registering RAF
    const canvasRef = useRef<Canva | null>(null);
    const ctxRef = useRef<Ctx2D | null>(null);
    const drawerRef = useRef<DetroitDrawer | null>(null);
    const rafIDRef = useRef<number | null>(null);

    const SPRING_CONFIG = { bounce: 0, visualDuration: 1.8 };
    const inView = useInView(canvasRef, { amount: 0.2 });
    const shadowProgressMV = useSpring(0, SPRING_CONFIG);
    const timeMV = useTime();
    const { scrollYProgress } = useScrollValues();
    const colorMV = useColorTransform(scrollYProgress, colorIDMap);

    const shadowProgressRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    useMotionValueEvent(shadowProgressMV, 'change', v => { shadowProgressRef.current = v; });
    useMotionValueEvent(timeMV, 'change', v => { timeRef.current = v; });
    useMotionValueEvent(colorMV, 'change', v => {
        if (ctxRef.current) ctxRef.current.fillStyle = v;
    });

    // Canvas init and resize (shared init function)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctxFromCanvas = canvas.getContext("2d");
        if (!ctxFromCanvas) return;
        ctxRef.current = ctxFromCanvas;

        function initCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = ctxRef.current ?? canvas.getContext("2d");
            if (!ctx) return;
            canvasCtxScaledAsDPR(canvas, ctx, window);

            const direction = window.innerWidth > 900 ? DIRECTION.HORIZONAL : DIRECTION.VERTICAL;
            const triangles = spawnTriangles(
                canvas, 
                direction, 
                direction === DIRECTION.HORIZONAL ? 0.6 : 0.9, 
                200
            );
            drawerRef.current = new DetroitDrawer(ctx, triangles, canvas, direction);
            ctx.fillStyle = colorMV.get();
        }
        initCanvas();

        // listen resize (throttled)
        const throtInit = throttle(initCanvas);
        window.addEventListener('resize', throtInit);
        window.addEventListener('orientationchange', throtInit);

        function animateLoop() {
            if (shadowProgressRef.current > 0.05) {
                drawerRef.current?.draw(shadowProgressRef.current, timeRef.current);
            }
            rafIDRef.current = requestAnimationFrame(animateLoop);
        }
        rafIDRef.current = requestAnimationFrame(animateLoop); // start

        // cleanup on unmount
        return () => {
            window.removeEventListener('resize', throtInit);
            window.removeEventListener('orientationchange', throtInit);
            if (rafIDRef.current != null) {
                cancelAnimationFrame(rafIDRef.current);
                rafIDRef.current = null;
            }
        };
    }, [colorMV]);

    useEffect(() => {
        shadowProgressMV.set(inView ? 1 : 0);
    }, [inView, shadowProgressMV]);

    return (
        <div className="detroit-wrapper">
            <canvas className="detroit" ref={canvasRef}></canvas>
        </div>
    );
};

export default DetroitShadow;