// i believe that (x, y) and (y, x) are the same MATHMATICALLY :)
// So if u wanna see (x, y) visually, use method `stringed`, or else it confuse u a LOT.
var pixeler = {
    create: (xh, yh) => {
        let pixels = new Array(xh);
        for (let i = 0; i < xh; i++) {
            pixels[i] = (new Array(yh)).fill(0);
        }
        return pixels;
    },
    createRandom: (xh, yh, p) => { // thats something fun to do
        let pixels = new Array(xh);
        for (let i = 0; i < xh; i++) {
            pixels[i] = (new Array(yh)).map(() => (Math.random() < p));
        }
        return pixels;
    },
    sizeOf: (pixels) => {
        return [pixels.length, pixels[0].length];
    },
    forEach: (pixels, func) => {
        let [xh, yh] = pixeler.sizeOf(pixels);
        for (let x = 0; x < xh; x++) {
            for (let y = 0; y < yh; y++) {
                func(x, y, pixels[x][y]);
            }
        }
    },
    get: (pixels, xFrom, xTo, yFrom, yTo) => {
        xFrom ??= 0;
        xTo ??= pixels.length;
        yFrom ??= 0;
        yTo ??= pixels[0].length;
        let [oxh, oyh] = pixeler.sizeOf(pixels);
        let [xh, yh] = [xTo - xFrom, yTo - yFrom];
        let res = pixeler.create(xh, yh); // pure false
        for (let x = Math.max(xFrom, 0); x < Math.min(xTo, oxh); x++) {
            for (let y = Math.max(yFrom, 0); y < Math.min(yTo, oyh); y++) {
                res[x-xFrom][y-yFrom] = pixels[x][y];
            }
        }
        return res;
    },
    move: (pixels, dx, dy, overflowDelete = true) => {
        let [xh, yh] = pixeler.sizeOf(pixels);
        return overflowDelete ? pixeler.get(pixels, -dx, xh-dx, -dy, yh-dy)
            : pixeler.get(pixels, -dx, xh, -dy, yh);
    },
    copy: (pixels) => pixeler.get(pixels),
    minized: (pixels) => {
        let [xh, yh] = pixeler.sizeOf(pixels);
        let xFrom = xh, xTo = 0, yFrom = yh, yTo = 0;
        pixeler.forEach(pixels, (x, y) => {
            if (pixels[x][y]) {
                if (x <= xFrom) xFrom = x;
                if (x >= xTo  ) xTo = x+1;
                if (y <= yFrom) yFrom = y;
                if (y >= yTo  ) yTo = y+1;
            }
        });
        if (xFrom > xTo) return []; // xFrom as a representative
        return pixeler.get(pixels, xFrom, xTo, yFrom, yTo);
    },
    count: (pixels) => {
        let total = 0;
        pixeler.forEach(pixels, (x, y, value) => {
            total += value;
        });
        return total;
    },
    not: (pixels) => {
        let [xh, yh] = pixeler.sizeOf(pixels);
        let res = pixeler.create(xh, yh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = pixels[x][y];
        });
        return res;
    },
    add: (pixels1, pixels2) => {
        let [xh1, yh1] = pixeler.sizeOf(pixels1);
        let [xh2, yh2] = pixeler.sizeOf(pixels2);
        let mxh = Math.max(xh1, xh2);
        let myh = Math.max(yh1, yh2);
        let res = pixeler.create(mxh, myh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = (x < xh1 ? pixels1[x][y] : 0) + (x < xh2 ? pixels2[x][y] : 0);
        }); // for that undefined[y] cause error, but [][y] does not.
        return res;
    },
    minus: (pixels1, pixels2) => {
        let [xh1, yh1] = pixeler.sizeOf(pixels1);
        let [xh2, yh2] = pixeler.sizeOf(pixels2);
        let mxh = Math.max(xh1, xh2);
        let myh = Math.max(yh1, yh2);
        let res = pixeler.create(mxh, myh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = (x < xh1 ? pixels1[x][y] : 0) - (x < xh2 ? pixels2[x][y] : 0);
        }); // for that undefined[y] cause error, but [][y] does not.
        return res;
    },
    and: (pixels1, pixels2) => {
        // pixels1 is main.
        // let mxh = Math.min(pixels1.length, pixels2.length);
        // let myh = Math.min(pixels1[0].length, pixels2[0].length);
        // let res = pixeler.create(mxh, myh);
        // pixeler.forEach(res, (x, y) => {
        //     res[x][y] = pixels1[x][y] && pixels2[x][y];
        // });
        // let [xh1, yh1] = pixeler.sizeOf(pixels1);
        // return pixeler.get(res, 0, xh1, 0, yh1);

        let [xh1, yh1] = pixeler.sizeOf(pixels1);
        let [xh2, yh2] = pixeler.sizeOf(pixels2);
        let mxh = Math.min(xh1, xh2);
        let myh = Math.min(yh1, yh2);
        let res = pixeler.create(mxh, myh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = pixels1[x][y] && pixels2[x][y];
        });
        return res;
    },
    or: (pixels1, pixels2) => {
        let [xh1, yh1] = pixeler.sizeOf(pixels1);
        let [xh2, yh2] = pixeler.sizeOf(pixels2);
        let mxh = Math.max(xh1, xh2);
        let myh = Math.max(yh1, yh2);
        let res = pixeler.create(mxh, myh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = (x < xh1 ? pixels1[x][y] : 0) || (x < xh2 ? pixels2[x][y] : 0);
        }); // for that undefined[y] cause error, but [][y] does not.
        return res;
    },
    xor: (pixels1, pixels2) => {
        let [xh1, yh1] = pixeler.sizeOf(pixels1);
        let [xh2, yh2] = pixeler.sizeOf(pixels2);
        let mxh = Math.max(xh1, xh2);
        let myh = Math.max(yh1, yh2);
        let res = pixeler.create(mxh, myh);
        pixeler.forEach(res, (x, y) => {
            res[x][y] = (x < xh1 ? pixels1[x][y] : 0) ^ (x < xh2 ? pixels2[x][y] : 0);
        });
        return res;
    },
    isolated: (pixels) => {
        let [xh, yh] = pixeler.sizeOf(pixels);
        let areas = []; // [[x,y],[x,y],...]
        let areaOf = new Array(xh * yh); // [i, i, i, ...]

        let appendTo = 0;
        for (let y = 0; y < yh; y++) {
            for (let x = 0; x < xh; x++) {
                if (!pixels[x][y]) continue;
                let index = x + y * xh;
                if (x == 0 || !pixels[x-1][y]) {
                    areas.push([]);
                    appendTo = areas.length - 1;
                }
                areas[appendTo].push([x, y]);
                areaOf[index] = appendTo;
                // combine areas
                if (y > 0 && pixels[x][y-1] && (appendTo != areaOf[index - xh])) {
                    let oldArea = areas.splice(appendTo, 1, [])[0];
                    appendTo = areaOf[index - xh];
                    oldArea.forEach((pos) => {
                        let i = pos[1] * xh + pos[0];
                        areaOf[i] = appendTo;
                    });
                    areas[appendTo] = areas[appendTo].concat(oldArea);
                }
            }
        }
        areas = areas.filter((area) => area.length > 0);
        let res = [];
        for (const area of areas) {
            let areaPixels = pixeler.create(xh, yh);
            for (const pos of area) {
                areaPixels[pos[0]][pos[1]] = 1;
            }
            res.push(areaPixels);
        }
        return res;
    },
    rotate90: (pixels) => {
        let copy = pixeler.copy(pixels);
        let [xh, yh] = pixeler.sizeOf(pixels);
        let [rxh, ryh] = [yh, xh];
        
        pixels.length = rxh;
        for (let x = 0; x < rxh; x++) {
            pixels[x] = new Array(ryh).fill(0);
        }
        pixeler.forEach(copy, (x, y, value) => {
            pixels[y][xh-x-1] = value;
        });
        
    },
    rotate: (pixels, deg90s) => {
        deg90s %= 4;
        for (let _ = 0; _ < deg90s; _++) pixeler.rotate90(pixels);
    },
    rotated90: (pixels) => {
        let res = pixeler.copy(pixels);
        pixeler.rotate90(res);
        return res;
    },
    rotated: (pixels, deg90s) => {
        let res = pixeler.copy(pixels);
        pixeler.rotate(res, deg90s);
        return res;
    },
    stringed: (pixels) => {
        let str = "";
        let [xh, yh] = pixeler.sizeOf(pixels);
        for (let y = 0; y < yh; y++) {
            for (let x = 0; x < xh; x++) {
                str += (pixels[x][y] ? 1 : 0) + " ";
            }
            str += "\n";
        }
        return str;
    },
}

export {pixeler};