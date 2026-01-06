import React, { useEffect } from "react";

import { canvasCtxScaledAsDPR } from "src/utils/canvas";
import { rand, randint } from "src/utils/math";
import { debounce } from "src/utils/timer";

type CanvasRef = React.RefObject<HTMLCanvasElement | null>;

const StarCanvas: React.FC<{ref: CanvasRef}> = ({ ref }) => {
    useEffect(() => {
        const initStars = () => {
            const canvas = ref.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const width = window.innerWidth * 1.1;
            const height = window.innerHeight * 1.1;
            canvasCtxScaledAsDPR(canvas, ctx, window);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.fillStyle = "#ffffff";

            const total = window.innerWidth > 1000 ? randint(400, 700) : randint(250, 500);
            for (let _ = 0; _ < total; _++) {
                ctx.globalAlpha = rand(0.2, 1);
                ctx.fillRect(randint(0, width), randint(0, height), 3.5, 3.5);
            }
        };
        initStars();

        const debounceInit = debounce(initStars);
        window.addEventListener("resize", debounceInit);

        return () => {
            window.removeEventListener("resize", debounceInit);
        };
    }, [ref]);

    return (<>
        <div className="canvas-wrapper">
            <canvas className="canvas-star" ref={ref}
            ></canvas>
        </div>
    </>)
}

export default StarCanvas;