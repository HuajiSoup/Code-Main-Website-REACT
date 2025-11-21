import React, { useEffect, useRef } from "react";

import { useScroll, useSpring, useTime, useMotionValueEvent } from "motion/react";

import "./index.scss";
import { clamp, rand } from "@/utils/math";
import { canvasCtxScaledAsDPR } from "@/utils/canvas";

type Ctx2D = CanvasRenderingContext2D;
type Canva = HTMLCanvasElement;

class DetroitTriangle {
    public size: number;
    public up: boolean;
    public x: number;
    public y: number;
    public timeFactorK: number;
    public timeFactorB: number;

    private path: Path2D | null;

    constructor(
        size: number,
        isUp: boolean,
        x: number,
        y: number,
    ) {
        this.size = size;
        this.up = isUp;
        this.x = x;
        this.y = y;
        this.timeFactorK = rand(0.2, 1.2);
        this.timeFactorB = rand(0, 1000);

        // baking path to minimize calc
        try {
            const p = new Path2D();
            if (isUp) {
                p.moveTo(x, y - 0.433 * size);
                p.lineTo(x - 0.5 * size, y + 0.433 * size);
                p.lineTo(x + 0.5 * size, y + 0.433 * size);
            } else {
                p.moveTo(x, y + 0.433 * size);
                p.lineTo(x + 0.5 * size, y - 0.433 * size);
                p.lineTo(x - 0.5 * size, y - 0.433 * size);
            }
            p.closePath();
            this.path = p;
        } catch (err) {
            console.log("Failed to initializing component <DetroitShadow>, error info:");
            console.error(err);
            this.path = null;
        }
    }
    draw(ctx: Ctx2D) {
        if (this.path) ctx.fill(this.path);
    }
}

function spawnTriangles(
    canvas: Canva,
    horizonal: boolean = true,
    coverage: number = 0.5,
    size: number = 100,
) {
    // use clientWidth/clientHeight (CSS pixels) so precomputed paths align with scaled context
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    let triangleList: DetroitTriangle[] = [];

    if (horizonal) {
        const limit = width * coverage;

        let xpos, ypos;
        for (let y = 0; ; y++) {
            ypos = y * size * 0.866;
            if (ypos - size * 0.866 > height) break;

            for (let x = 0; ; x++) {
                xpos = x * size * 0.5;
                if ((xpos > limit && Math.random() > 0.25) || xpos > width) break;

                // 25% chance to expand out of limit
                const isUp = !((x + y) % 2);
                triangleList.push(new DetroitTriangle(size, isUp, xpos, ypos));
            }
        }
    } else {
        const limit = height * coverage;

        let xpos, ypos;
        for (let x = 0; ; x++) {
            xpos = x * size;
            if (xpos + size > width) break;

            for (let y = 0; ; y++) {
                ypos = y * size * 1.732;
                if ((ypos > limit && Math.random() > 0.25) || ypos > height) break;

                // 25% chance to expand out of limit
                const isUp = !((x + y) % 2);
                triangleList.push(new DetroitTriangle(size, isUp, xpos, ypos));
            }
        }
    }
    return triangleList;
}

class DetroitDrawer {
    public ctx: Ctx2D;
    public triangleList: DetroitTriangle[];
    public width: number;
    public height: number;

    constructor(
        ctx: Ctx2D,
        triangleList: DetroitTriangle[],
        canvas: Canva,
    ) {
        this.ctx = ctx;
        this.triangleList = triangleList;
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawHorizonal(progress: number, time: number) {
        this.clearCanvas();
        const stableLimit = progress * this.width;
        for (const triangle of this.triangleList) {
            if (triangle.x < stableLimit) {
                const thisTime = (time * triangle.timeFactorK + triangle.timeFactorB) / 1000 % 1;
                const timeFactor = thisTime * (1 - thisTime); // <= 0.25
                const alphaBase = 1 - triangle.x * triangle.x / stableLimit / stableLimit;
                this.ctx.globalAlpha = clamp(0, alphaBase - timeFactor, 0.63);
                triangle.draw(this.ctx);
            } else if (Math.random() < 0.5 - (triangle.x - stableLimit) / 400) {
                // random blinking when strentch
                this.ctx.globalAlpha = 0.63;
                triangle.draw(this.ctx);
            }
        }
    }
}

const DetroitShadow: React.FC = () => {
    // keep a ref copy so the animation loop reads latest triangles without re-registering RAF
    const canvasRef = useRef<Canva | null>(null);
    const ctxRef = useRef<Ctx2D | null>(null);
    const drawerRef = useRef<DetroitDrawer | null>(null);
    const rafIDRef = useRef<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: canvasRef,
        offset: ["start end", "start start"],
    });
    const shadowProgress = useSpring(scrollYProgress, {
        bounce: 0,
        visualDuration: 1.5,
    });
    const time = useTime();
    const shadowProgressRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    // subscribe MotionValue changes and keep latest in refs for the RAF loop
    useMotionValueEvent(shadowProgress, 'change', v => { shadowProgressRef.current = v; });
    useMotionValueEvent(time, 'change', v => { timeRef.current = v; });

    // Canvas init
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvasCtxScaledAsDPR(canvas, ctx, window);

        ctxRef.current = ctx;
        ctx.fillStyle = "#FFA600";
        const triangles = spawnTriangles(canvas, true, 0.7, 200);
        drawerRef.current = new DetroitDrawer(ctx, triangles, canvas);

        function animateLoop() {
            if (shadowProgressRef.current > 0.1) {
                drawerRef.current?.drawHorizonal(shadowProgressRef.current, timeRef.current);
            }
            rafIDRef.current = requestAnimationFrame(animateLoop);
        }
        rafIDRef.current = requestAnimationFrame(animateLoop); // start

        // cleanup on unmount
        return () => {
            if (rafIDRef.current != null) {
                cancelAnimationFrame(rafIDRef.current);
                rafIDRef.current = null;
            }
        };
    }, []);

    return (
        <div className="detroit-wrapper">
            <canvas className="detroit" ref={canvasRef}></canvas>
        </div>
    );
};

export default DetroitShadow;