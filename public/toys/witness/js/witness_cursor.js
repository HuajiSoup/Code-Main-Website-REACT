import { clamp, offsetEq, arrayEq } from "../../common/lib/huaji-query.js";
import { i2pExt, i2p, routeCompleted } from "./witness_public.js";

var touchDirect;
var lineCut;
var pzlCut;
var cutList;

const CROSSING  = -1;
const HORIZONAL = 0;
const VERTICAL  = 1;

var size, compOrig, compSize, compStep, compEndOffset;
var route, touch, endPos;

function posListToCutList(posList) {
    return posList.reduce((res, pos) => {
        if (Number.isInteger(pos[0])) {
            res[VERTICAL][pos[0]].push(pos[1]*compStep);
        }
        if (Number.isInteger(pos[1])) {
            res[HORIZONAL][pos[1]].push(pos[0]*compStep);
        }
        return res;
    }, [new Array(size[1]).fill(0).map(() => []), new Array(size[0]).fill(0).map(() => [])]);
}
function cutClamp(attempt, ranger, cutList, offset=15) {
    let res = attempt;
    for (const cut of cutList) {
        if (ranger > cut) {
            res = Math.max(res, cut + offset);
        } else {
            res = Math.min(res, cut - offset);
        }
    }
    return res;
}
export function cursorInit(puzzle, touchPos, routeCurPos) {
    let elems;
    ({size, compOrig, compSize, compStep, compEndOffset, elems: elems} = puzzle);
    route = routeCurPos; // message transfer
    touch = touchPos;
    touchDirect = HORIZONAL; // random default :)
    pzlCut = elems.cut.map(cut => i2pExt(cut.index, ...size));
    endPos = i2p(elems.route.at(-1), size[0]);
    cutList = posListToCutList([]);
    // console.log(cutList);
}
export function cursorMove(ex, ey) {
    // triggered only when moved.
    let touchXposNear = Math.round(touch[0] / compStep);
    let touchYposNear = Math.round(touch[1] / compStep);
    let offsetX, offsetY;
    if (touchXposNear == endPos[0] && touchYposNear == endPos[1]) {
        offsetX = clamp(-compEndOffset, ex-compOrig[0], compSize[0]+compEndOffset);
        offsetY = clamp(-compEndOffset, ey-compOrig[1], compSize[1]+compEndOffset);
    } else {
        offsetX = clamp(0, ex-compOrig[0], compSize[0]);
        offsetY = clamp(0, ey-compOrig[1], compSize[1]);
    }
    offsetX = cutClamp(offsetX, touch[0], cutList[HORIZONAL][touchYposNear]);
    offsetY = cutClamp(offsetY, touch[1], cutList[VERTICAL][touchXposNear]);

    let touchDirectLast = touchDirect;
    if ((touchDirect == HORIZONAL && offsetEq(offsetX, touchXposNear*compStep, 7)) ||
        (touchDirect == VERTICAL && offsetEq(offsetY, touchYposNear*compStep, 7)) ) {
        touchDirect = CROSSING;
        if (touchDirectLast != CROSSING) {
            touch[0] = touchXposNear * compStep;
            touch[1] = touchYposNear * compStep;
            let newPos = [touchXposNear, touchYposNear];
            if (!arrayEq(newPos, route.at(-1))) {
                route.push([touchXposNear, touchYposNear]);
            }
        }
    } else if (touchDirect == CROSSING) {
        touchDirect = undefined; // wait for a direction
    }
    
    if (touchDirectLast == CROSSING && touchDirect != CROSSING) {
        if (Math.abs(offsetX - touchXposNear * compStep) > Math.abs(offsetY - touchYposNear * compStep)) {
            touchDirect = HORIZONAL;
        } else {
            touchDirect = VERTICAL;
        }

        if (route.length > 1 && (
            (touchDirect == HORIZONAL && route.at(-1)[1] == route.at(-2)[1]) || 
            (touchDirect == VERTICAL  && route.at(-1)[0] == route.at(-2)[0])
        )) {
            // same direct
            route.pop();
        }
        lineCut = routeCompleted(route.slice(0, -1));
        cutList = posListToCutList([].concat(lineCut, pzlCut));
        return;
    }
    if (touchDirect == VERTICAL) {
        touch[1] = offsetY;
    } else if (touchDirect == HORIZONAL) {
        touch[0] = offsetX;
    }
}