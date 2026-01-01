import { randint, randElem, arrayEq, arrayFilled, deepCopy, removeFrom, ease } from "../../common/lib/huaji-query.js";

function i2p(n, w) {
    return [n % w, Math.floor(n / w)];
}
function i2pExt(n, w, h) {
    // just for graphing points
    let en = n - w*h;
    if (en < 0) {
        return i2p(n, w);
    } else if (en % (w*2 - 1) < w - 1) {
        return [en % (w*2 - 1) + 0.5, Math.floor(en / (w*2 - 1))];
    } else {
        return [en % (w*2 - 1) - w + 1, Math.floor((en - w + 1) / (w*2 - 1)) + 0.5];
    }
}
function p2i(pos, w) {
    return pos[1]*w + pos[0];
}
function p2iExt(pos, w, h) {
    // also just for graphing points
    let xf = Math.floor(pos[0]);
    let xc = Math.ceil(pos[0]);
    let yf = Math.floor(pos[1]);
    let yc = Math.ceil(pos[1]);
    return (xf == xc && yf == yc) ? p2i(pos, w) : indexBtw(p2i([xf, yf], w), p2i([xc, yc], w), w, h);
}
function gridToBlock(gridIndex, w) {
    // right down block. grid[w]
    return gridIndex - Math.floor(gridIndex / w);
}
function blockToGrid(blockIndex, w) {
    // left top grid. block[w]
    return blockIndex + Math.floor(blockIndex / w);
}
function includesPos(array, pos) {
    for (let i = 0; i < array.length; i++) {
        if (pos[0] == array[i][0] && pos[1] == array[i][1]) return true;
    }
    return false;
}
function pointsOfArea(area, w, h) {
    // grid[w, h]
    // Points that has blocks around in area are filtered
    // points on route are also included
    let points = new Set();
    for (const b of area) {
        let n = blockToGrid(b, w-1);
        let toInclude = [n, n+1, n+w, n+w+1,
            indexBtw(n, n+1, w, h), indexBtw(n, n+w, w, h), indexBtw(n+w, n+w+1, w, h), indexBtw(n+1, n+w+1, w, h)];
        toInclude.forEach(point => points.add(point));
    }
    return points;
}
function indexBtw(a, b ,w, h) {
    return a > b ? indexBtw(b, a, w, h) : w * h + a + b - b % w - Math.floor(b / w);
}
function getBoundIndex(size) {
    let [w, h] = [...size];
    let bound = [];
    for (let i = 0; i < w; i++) {
        bound.push(i, w * h - 1 - i);
    }
    for (let i = 1; i < h-1; i++) {
        bound.push(w * i, w * (i + 1) - 1);
    }
    return bound;
}
function routeCompleted(route) {
    // route = [[x1, y1], [x1, y2], [x2, y2]...]
    if (route.length == 0) return [];
    let res = [[...route[0]], ];
    for (let i = 0; i < route.length-1; i++) {
        if (route[i][0] == route[i+1][0]) {
            if (route[i][1] < route[i+1][1]) {
                for (let y = route[i][1]+1; y <= route[i+1][1]; y++) {
                    res.push([route[i][0], y]);
                }
            } else {
                for (let y = route[i][1]-1; y >= route[i+1][1]; y--) {
                    res.push([route[i][0], y]);
                }
            }
        } else {
            if (route[i][0] < route[i+1][0]) {
                for (let x = route[i][0]+1; x <= route[i+1][0]; x++) {
                    res.push([x, route[i][1]]);
                }
            } else {
                for (let x = route[i][0]-1; x >= route[i+1][0]; x--) {
                    res.push([x, route[i][1]]);
                }
            }
        }
    }
    return res;
}
function routeGrow(route, size, routeMinLen) {
    // grid[w, h]
    routeMinLen ||= 0;
    let [w, h] = size;
    let growFrom = route.length;
    for (let _ = 0 ; _ < 256 ; _++) { // standard route
        let lastStep = route[route.length-1];
        let newStep;
        let avlSteps = []; // null*4

        if (lastStep % (w) != 0) { // left
            newStep = lastStep - 1;
            if (!route.includes(newStep)) { avlSteps.push(newStep); }
        } else { avlSteps.push(-1); }

        if ((lastStep + 1) % (w) != 0) { // right
            newStep = lastStep + 1;
            if (!route.includes(newStep)) { avlSteps.push(newStep); }
        } else { avlSteps.push(-1); }

        if (lastStep > w) { // up
            newStep = lastStep - w;
            if (!route.includes(newStep)) { avlSteps.push(newStep); }
        } else { avlSteps.push(-1); }

        if (lastStep < w*(h - 1)) { // down
            newStep = lastStep + w;
            if (!route.includes(newStep)) { avlSteps.push(newStep); }
        } else { avlSteps.push(-1); }

        // select direct from `avlSteps`
        if (avlSteps.length > 0) {
            let newStep = randElem(avlSteps);
            if (newStep >= 0) {
                route.push(newStep);
            } else if (route.length >= routeMinLen) {
                break;
            }
        } else {
            route.splice(growFrom); // si hu tong
        }
    }
}
function getAreasSplitByRoute(size, route) {
    // grid[w, h]
    let [w, h] = size;
    let leftRouted = [];
    let topRouted = [];
    for (let i = 0; i < route.length-1; i++) {
        const stepCur = route[i];
        const stepNext = route[i+1];
        let stepPos = i2pExt(indexBtw(stepCur, stepNext, w, h), w, h);
        if (Number.isInteger(stepPos[0])) {
            if (stepPos[0] != w-1) leftRouted.push( p2i( [stepPos[0], Math.floor(stepPos[1])] , w-1) );
        } else {
            if (stepPos[1] != h-1) topRouted.push( p2i( [Math.floor(stepPos[0]), stepPos[1]] , w-1) );
        }
    }
    
    // Two ways search
    let areas = [];
    let areaOf = new Array((w-1)*(h-1));
    let appendTo = 0;
    for (let y = 0; y < h-1; y++) {
        for (let x = 0; x < w-1; x++) {
            // block[x,y]
            let block = y*(w-1) + x;
            if (x == 0 || leftRouted.includes(block)) {
                // new area
                appendTo = areas.length; // appendTo++
                areas.push([]);
            }
            areas[appendTo].push(block);
            areaOf[block] = appendTo;

            // Combine areas
            if (y > 0 && !topRouted.includes(block) && appendTo != areaOf[block - w + 1]) {
                let oldArea = areas.splice(appendTo, 1, [])[0];
                appendTo = areaOf[block - w + 1];
                oldArea.forEach(n => (areaOf[n] = appendTo));
                areas[appendTo] = areas[appendTo].concat(oldArea);
            }
        }
    }
    return areas.filter(a => a.length > 0);
}

let themes = [];
fetch("./js/themes.json")
// fetch("/toys/witness/js/themes.json")
    .then(response => response.json())
    .then(data => {
        let defaultTheme = data["default"];
        for (const theme in data) {
            if (theme === "default") continue;
            themes.push(data[theme]);
        }
        for (let i = 0; i < themes.length; i++) {
            themes[i].bgInner ??= themes[i].bg; // for those do not has diff
            for (const item in defaultTheme) {
                themes[i][item] ??= defaultTheme[item];
            }
        }
    }).catch(err => console.error(err));

export {i2p, i2pExt, p2i, p2iExt, gridToBlock, blockToGrid, includesPos, pointsOfArea, indexBtw, getBoundIndex, routeCompleted, routeGrow, getAreasSplitByRoute}
export {themes}