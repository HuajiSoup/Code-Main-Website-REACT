import {pixeler, pixeler as pxr} from "../../common/lib/pixeler.js";

var drawGeo = {
    drawHexagon: (ctx, x, y, r) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.moveTo(r, 0);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.rotate(1.047);
            ctx.lineTo(r, 0);
        }
        ctx.fill();
        ctx.restore();
    },
    drawRoundRect: (ctx, x, y, r) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 1.24*r, 0, 6.29);
        ctx.clip();
        ctx.fillRect(-r, -r, 2*r, 2*r);
        ctx.restore();
    },
    draw8angle: (ctx, x, y, r) => {
        ctx.save();
        ctx.translate(x, y);
        let a = 0.707*r;
        ctx.fillRect(-a, -a, 2*a, 2*a);
        ctx.rotate(0.785);
        ctx.fillRect(-a, -a, 2*a, 2*a);
        ctx.restore();
    },
    drawTriangle: (ctx, x, y, r) => {
        ctx.save();
        ctx.translate(x, y + 0.25 * r);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(-0.867 * r, 0.5 * r);
        ctx.lineTo(0.867 * r, 0.5 * r);
        ctx.fill();
        ctx.restore();
    },
    drawClover: (ctx, x, y, r) => {
        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineWidth = 0.506 * r;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.rotate(0.524);
        for (let _ = 0; _ < 3; _++) {
            ctx.moveTo(0, 0);
            ctx.rotate(2.094);
            ctx.lineTo(r, 0);
        }
        ctx.stroke();
        ctx.restore();
    }
}

class WitnessElem {
    index; // Number
    color; // colorGroup Number
    id; // type Str
    constructor(index, colorName = -1) {
        this.index = index;
        this.color = colorName;
    }
    draw(ctx, x, y, r0) {}
}

class Cut extends WitnessElem {
    id = "cut";
    constructor(index) {
        super(index);
    }
    draw(ctx, x, y, r0) {
        ctx.clearRect(x - r0*1.2, y - r0*1.2, r0*2.4, r0*2.4);
    }
}

class Point extends WitnessElem {
    id = "point";
    constructor(index) {
        super(index);
    }
    draw(ctx, x, y, r0) {
        ctx.save();
        ctx.lineWidth = 0;
        drawGeo.drawHexagon(ctx, x, y, r0 * 0.9);
        ctx.restore();
    }
}

class Splitter extends WitnessElem {
    id = "splitter";
    constructor(index, colorName = -1) {
        super(index, colorName);
    }
    draw(ctx, x, y, r0) {
        drawGeo.drawRoundRect(ctx, x, y, r0)
    }
}

class Teamer extends WitnessElem {
    id = "teamer";
    constructor(index, colorName = -1) {
        super(index, colorName);
    }
    draw(ctx, x, y, r0) {
        drawGeo.draw8angle(ctx, x, y, r0);
    }
}

const TETRIS_TYPE = {
    NORMAL: 0,
    ROTATE: 1,
    CLEAR : 2,
    ROTATE_CLEAR: 3
}
class Tetris extends WitnessElem {
    isRotate;
    isClear;
    shape; // pixel
    id = "tetris";
    constructor(index, isRotate, isClear, shape, colorName = -1) {
        super(index, colorName);
        this.isRotate = isRotate;
        this.isClear = isClear;
        this.shape = shape;
        if (this.isClear) {
            pixeler.forEach(this.shape, (x, y) => {
                this.shape[x][y] *= -1;
            });
        }
    }
    draw(ctx, x, y, r0) {
        let r = r0 * 0.75;
        ctx.save();
        ctx.lineWidth = r * 0.133;

        let size = pxr.sizeOf(this.shape);
        ctx.translate(x, y);
        if (this.isRotate) ctx.rotate(-0.4);
        ctx.translate(- r * (size[0]-1) / 2, - r * (size[1]-1) / 2);
        for (let x = 0; x < size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                if (this.shape[x][y]) {
                    ctx.save();
                    ctx.translate(x * r, y * r);
                    if (this.isClear) {
                        ctx.strokeRect(-r * 0.40, -r * 0.40, r * 0.80, r * 0.80);
                    } else {
                        ctx.fillRect(-r * 0.45, -r * 0.45, r * 0.90, r * 0.90);
                    }
                    ctx.restore();
                }
            }
        }
        ctx.restore();
    }
}

class Passer extends WitnessElem {
    passCount; // 1 | 2 | 3
    id = "passer";
    constructor(index, passCount, colorName = -1) {
        super(index, colorName);
        this.passCount = passCount;
    }
    draw(ctx, x, y, r) {
        ctx.save();
        ctx.translate(x - r * (this.passCount - 1) / 2, y);
        for (let i = 0; i < this.passCount; i++) {
            ctx.save();
            ctx.translate(r * i, 0);
            drawGeo.drawTriangle(ctx, 0, 0, r*0.65);
            ctx.restore();
        }
        ctx.restore();
    }
}

class Remover extends WitnessElem {
    id = "remover";
    constructor(index, colorName = -1) {
        super(index, colorName);
    }
    draw = drawGeo.drawClover;
}

export {WitnessElem, Cut, Point, Splitter, Teamer, Tetris, Passer, Remover}
export {TETRIS_TYPE}