import React, { useEffect, useRef } from "react";
import {
    MotionValue,
    useInView,
    useMotionValueEvent,
    useSpring,
    useTime,
    useTransform,
} from "motion/react";

import { canvasCtxScaledAsDPR } from "@/utils/canvas";
import { throttle } from "@/utils/timer";

import { useScrollValues } from "../SectionList";
import { SectionContent } from "../../page";
import { DetroitDrawer, DIRECTION, spawnTriangles } from "./triangles";

import "./index.scss";

type Ctx2D = CanvasRenderingContext2D;
type CanvasEl = HTMLCanvasElement;
const SPRING_CONFIG = { bounce: 0, visualDuration: 1.8 };

function useColorTransform(scrollYProgress: MotionValue<number>, colorIDMap: SectionContent[]) {
    const rangeY = colorIDMap.map((_, index) => (index + 1) / colorIDMap.length);
    const rangeColor = colorIDMap.map((c) => c.color);
    return useTransform(scrollYProgress, rangeY, rangeColor);
}

const DetroitShadow: React.FC<{ content: SectionContent[] }> = ({ content: colorIDMap }) => {
    // keep refs so the animation loop reads latest state without re-registering RAF
    const canvasRef = useRef<CanvasEl | null>(null);
    const ctxRef    = useRef<Ctx2D | null>(null);
    const drawerRef = useRef<DetroitDrawer | null>(null);
    const rafRef    = useRef<number | null>(null);

    const inView                = useInView(canvasRef, { amount: 0.2 });
    const shadowProgressMV      = useSpring(0, SPRING_CONFIG);
    const timeMV                = useTime();
    const { scrollYProgress }   = useScrollValues();
    const colorMV               = useColorTransform(scrollYProgress, colorIDMap);

    const inViewRef = useRef<boolean>(false);
    useMotionValueEvent(colorMV, "change", (v) => {
        if (ctxRef.current) ctxRef.current.fillStyle = v;
    });

    // Canvas init and resize (shared init function)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctxFromCanvas = canvas.getContext("2d");
        if (!ctxFromCanvas) return;
        ctxRef.current = ctxFromCanvas;

        const initCanvas = () => {
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
                200,
            );

            drawerRef.current = new DetroitDrawer(ctx, triangles, canvas, direction);
            ctx.fillStyle = colorMV.get();
        };

        initCanvas();

        // listen resize (throttled)
        const throttledInit = throttle(initCanvas);
        window.addEventListener("resize", throttledInit);
        window.addEventListener("orientationchange", throttledInit);

        // main loop
        const animateLoop = () => {
            if (inViewRef.current) {
                drawerRef.current?.draw(shadowProgressMV.get(), timeMV.get());
            }
            rafRef.current = requestAnimationFrame(animateLoop);
        };

        rafRef.current = requestAnimationFrame(animateLoop); // start

        // cleanup on unmount
        return () => {
            window.removeEventListener("resize", throttledInit);
            window.removeEventListener("orientationchange", throttledInit);
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [shadowProgressMV, colorMV, timeMV]);

    useEffect(() => {
        shadowProgressMV.set(inView ? 1 : 0);
        inViewRef.current = inView;
    }, [inView, shadowProgressMV]);

    return (
        <div className="detroit-wrapper">
            <canvas className="detroit" ref={canvasRef}></canvas>
        </div>
    );
};

export default DetroitShadow;