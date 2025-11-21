/**
 *  DPR-aware sizing: set pixel buffer and CSS size, then scale context
    scale so drawing coordinates use CSS pixels.
 * @param canvas 
 * @param ctx 
 * @param window 
 */
export function canvasCtxScaledAsDPR(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    window: Window
) {
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    ctx.scale(dpr, dpr);
}