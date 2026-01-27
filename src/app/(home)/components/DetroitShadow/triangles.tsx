import { rand, clamp } from "@/utils/math";

type Ctx2D = CanvasRenderingContext2D;
type Canva = HTMLCanvasElement;

export enum DIRECTION {
    HORIZONAL,
    VERTICAL,
};

export class DetroitTriangle {
    public size: number;
    public x: number;
    public y: number;
    public timeFactorK: number;
    public timeFactorB: number;

    private path: Path2D | null;

    constructor(
        size: number,
        x: number,
        y: number,
        isUp: boolean,
        direction: DIRECTION,
    ) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.timeFactorK = rand(0.2, 1.2);
        this.timeFactorB = rand(0, 1000);

        // baking path to minimize calc
        try {
            const p = new Path2D();
            if (direction === DIRECTION.HORIZONAL) {
                if (isUp) {
                    p.moveTo(x, y - 0.433 * size);
                    p.lineTo(x - 0.5 * size, y + 0.433 * size);
                    p.lineTo(x + 0.5 * size, y + 0.433 * size);
                } else {
                    p.moveTo(x, y + 0.433 * size);
                    p.lineTo(x + 0.5 * size, y - 0.433 * size);
                    p.lineTo(x - 0.5 * size, y - 0.433 * size);
                }
            } else {
                if (isUp) {
                    p.moveTo(x - 0.433 * size, y - 0.5 * size);
                    p.lineTo(x - 0.433 * size, y + 0.5 * size);
                    p.lineTo(x + 0.433 * size, y);
                } else {
                    p.moveTo(x + 0.433 * size, y - 0.5 * size);
                    p.lineTo(x + 0.433 * size, y + 0.5 * size);
                    p.lineTo(x - 0.433 * size, y);
                }
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

export function spawnTriangles(
    canvas: Canva,
    direction: DIRECTION,
    coverage = 0.5,
    size = 100,
) {
    // use clientWidth/clientHeight (CSS pixels) so precomputed paths align with scaled context
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const triangleList: DetroitTriangle[] = [];

    if (direction === DIRECTION.HORIZONAL) {
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
                triangleList.push(new DetroitTriangle(size, xpos, ypos, isUp, DIRECTION.HORIZONAL));
            }
        }
    } else {
        const limit = height * coverage;

        let xpos, ypos;
        for (let x = 0; ; x++) {
            xpos = x * size * 0.866;
            if (xpos - size * 0.866 > width) break;

            for (let y = 0; ; y++) {
                ypos = y * size * 0.5;
                if ((ypos > limit && Math.random() > 0.25) || ypos > height) break;
                // 25% chance to expand out of limit
                const isUp = !((x + y) % 2);
                triangleList.push(new DetroitTriangle(size, xpos, ypos, isUp, DIRECTION.VERTICAL));
            }
        }
    }
    return triangleList;
}

export class DetroitDrawer {
    public ctx: Ctx2D;
    public triangleList: DetroitTriangle[];
    public width: number;
    public height: number;
    public direction: DIRECTION;

    constructor(
        ctx: Ctx2D,
        triangleList: DetroitTriangle[],
        canvas: Canva,
        direction: DIRECTION = DIRECTION.HORIZONAL
    ) {
        this.ctx = ctx;
        this.triangleList = triangleList;
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
        this.direction = direction;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    draw(progress: number, time: number) {
        this.clearCanvas();
        if (this.direction === DIRECTION.HORIZONAL) {
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
        } else {
            const stableLimit = progress * this.height;
            for (const triangle of this.triangleList) {
                if (triangle.y < stableLimit) {
                    const thisTime = (time * triangle.timeFactorK + triangle.timeFactorB) / 1000 % 1;
                    const timeFactor = thisTime * (1 - thisTime); // <= 0.25
                    const alphaBase = 1 - triangle.y * triangle.y / stableLimit / stableLimit;
                    this.ctx.globalAlpha = clamp(0, alphaBase - timeFactor, 0.63);
                    triangle.draw(this.ctx);
                } else if (Math.random() < 0.5 - (triangle.y - stableLimit) / 400) {
                    // random blinking when strentch
                    this.ctx.globalAlpha = 0.63;
                    triangle.draw(this.ctx);
                }
            }
        }
    }
}