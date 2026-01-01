import { 
    rand, randint, randElem, randElems, arrayEq, arrayFilled, deepCopy, removeFrom, ease 
} from "../../common/lib/huaji-query.js";
import {pixeler as pxr} from "../../common/lib/pixeler.js";

import { 
    i2p, i2pExt, p2i, gridToBlock, blockToGrid, pointsOfArea, indexBtw, getBoundIndex, routeGrow, getAreasSplitByRoute,
    themes
} from "./witness_public.js";
import { Cut, Point, Splitter, Teamer, Tetris, Passer, Remover, TETRIS_TYPE } from "./witness_class_elems.js";
import { touchX, touchY, sliding, puzzleState, frame, routeCurPos} from "./witness.js"; // global changing

const UNCOMPLETED = -2;
const NEARCOMPLETED = -1;
const FAILURE = 0;
const SUCCESS = 1;

function getRoutePass(size, route) {
    // grid [w, h]
    let [w, h] = [...size];
    let routePass = (new Array((w-1)*(h-1))).fill(0);
    for (let i = 0; i < route.length-1; i++) {
        let stepPos = i2pExt(indexBtw(route[i], route[i+1], w, h), w, h);
        let cornerPos = [Math.floor(stepPos[0]), Math.floor(stepPos[1])];
        if (Number.isInteger(stepPos[0])) {
            if (stepPos[0] !== 0) routePass[p2i([cornerPos[0]-1, cornerPos[1]], w-1)] += 1; // left
            if (stepPos[0] !== w-1) routePass[p2i(cornerPos, w-1)] += 1; // right
        } else {
            if (stepPos[1] !== 0) routePass[p2i([cornerPos[0], cornerPos[1]-1], w-1)] += 1; // up
            if (stepPos[1] !== h-1) routePass[p2i(cornerPos, w-1)] += 1; // down
        }
    }
    return routePass;
}
function tetrisFit(_pixel, tetrisList) {
    // Judge fragsCount yourself. In avoid of repeated judgement.
    // Minize frags yourself, or face bugs.
    if (pxr.count(_pixel) === 0 && tetrisList.length === 0) return true;

    // if there is minus frags, the bound needs to be expanded.
    let pixel = pxr.copy(_pixel);
    let pixelSize = pxr.sizeOf(pixel);
    let pixelSizeExpand = [0, 0];
    for (let frag of tetrisList) {
        if (pxr.forEach(frag, (x, y, value) => (value < 0))) {
            let fragSize = pxr.sizeOf(frag);
            pixelSizeExpand[0] += fragSize[0];
            pixelSizeExpand[1] += fragSize[1];
        }
    }
    pixel = pxr.get(pixel,
        -pixelSizeExpand[0], pixelSize[0]+pixelSizeExpand[0], -pixelSizeExpand[1], pixelSize[1]+pixelSizeExpand[1]);
    let cur = pxr.copy(tetrisList[0]);
    let curSize = pxr.sizeOf(cur);

    for (let x = 0; x <= pixelSize[0]-curSize[0]; x++) {
        for (let y = 0; y <= pixelSize[1]-curSize[1]; y++) {
            let testPlacement = pxr.move(cur, x, y, false);
            let testResult = pxr.xor(pixel, testPlacement);
            if (tetrisFit(pxr.minized(testResult), tetrisList.slice(1))) return true;
        }
    }
    return false;
}
function option(name) {
    return document.querySelector(`.pzl-options input[name="pzl-${name}"]`);
}

class PuzzleManager {
    size;
    route;
    extRoute;
    areas;
    areaOf;
    routePass;
    constructor(size, route) {
        this.size = size;
        if (route) {
            this.route = [...route];
        } else {
            // create random route as default
            let begin = p2i([randint(0, size[0]-1), randint(0, size[1]-1)], size[0]);
            this.route = [begin];
            let routeMinLen = Math.min(5 + randint(-3, 3), size[0] + size[1] - 1);
            routeGrow(this.route, size, routeMinLen);
            routeGrow(this.route.reverse(), size);
            let endPos = i2p(this.route.at(-1), size[0]);
            if (endPos[0] !== 0 && endPos[0] !== size[0]-1 && endPos[1] !== 0 && endPos[1] !== size[1]-1) this.route.reverse();
        }
        this.extRoute = [...this.route];
        for (let i = this.extRoute.length-1; i > 0; i--) {
            this.extRoute.splice(i, 0, indexBtw(this.extRoute[i], this.extRoute[i-1], size[0], size[1]));
        }
        this.areas = getAreasSplitByRoute(this.size, this.route);
        this.areaOf = new Array((size[0]-1)*(size[1]-1));
        for (let a = 0; a < this.areas.length; a++) {
            for (const n of this.areas[a]) this.areaOf[n] = a;
        }
        this.routePass = getRoutePass(this.size, this.route);
    }
    createPuzzleElems() {
        const {size, route, extRoute, areas, areaOf, routePass} = this; // convenient
        const [w, h] = [...size];
        let elems = {
            route: route, // n
            cut: [], // n(ext)
            point: [], // n(ext) -> Point
            splitter: [], // b, color#max3 -> Splitter
            teamer: [], // b, color#max2 -> Teamer
            tetris: [], // b, tetris([][]), type(0=norm, 1=rotated, 2=clear) -> Tetris
            passer: [], // b, times -> Passer
            remover: [], // b -> Remover
        };
        function regElem(elem) {
            // DO NOT ACCEPT POINTS
            elems[elem.id].push(elem);
            avlBlocksOfArea[areaOf[elem.index]].delete(elem.index);
            elemOfBlock[elem.index] = elem;
        }
    
        let numAvlElems = 0;
        let avlElemsList = [];
        for (const rule of document.querySelectorAll(".pzl-options#pzl-elems input[type='checkbox']")) {
            if (!rule.disabled && rule.checked) {
                avlElemsList.push(rule.getAttribute("name"));
                numAvlElems++;
            }
        }
        let avlBlocksOfArea = areas.map(area => new Set(area));

        let elemOfBlock = (new Array((w - 1)*(h - 1))).fill(undefined);
        let areaIndexList = [];
        for (let i = 0; i < areas.length; i++) areaIndexList.push(i);
    
        let maxIndex = w * h * 3 - w - h; // Norm + Ext
        // cut
        if (option("cut").checked) {
            let numCut = randint(0, Math.min(12, (maxIndex - w * h - extRoute.length)/2));
            for (let _ = 0; _ < numCut; _++) {
                let cutAt = randint(w * h, maxIndex-1);
                if (!extRoute.includes(cutAt)) elems.cut.push(new Cut(cutAt));
            }
        }
        // point REFIXED
        if (option("point").checked) {
            let numPoints = randint(1, Math.min(w + h - 2, route.length / 3));
            let pointsAt = randElems(extRoute, numPoints);
            for (const n of pointsAt) { elems.point.push(new Point(n)); }
        }
        // tetris REFIXED
        if (option("tetris").checked) {
            let ttrRotateEnabled = option("tetris-rotate").checked;
            let ttrClearEnabled = option("tetris-clear").checked;

            // normal tetris
            let ttrArea = areas.reduce((preIndex, curArea, curIndex) => 
                (Math.abs(curArea.length - 7) < (Math.abs(areas[preIndex].length - 7)) ? curIndex : preIndex
            ), 0); // find the 7est area
            let ttrBlocks = areas[ttrArea];
            let ttrPxs = pxr.create(w-1, h-1);
            for (const b of ttrBlocks) {
                let p = i2p(b, w-1);
                ttrPxs[p[0]][p[1]] = true;
            }
            ttrPxs = pxr.minized(ttrPxs);
            let ttrSize = pxr.sizeOf(ttrPxs);
            let ttrCount = pxr.count(ttrPxs);
            let ttrFrags = [ttrPxs, ];

            // split tetris grid (biggest first)
            for (let _ = 0; _ < 16; _++) {
                if (ttrFrags.length * 5 > ttrCount) break;

                let maxCountIndex, maxCount = 0;
                for (let i = 0; i < ttrFrags.length; i++) {
                    let count = pxr.count(ttrFrags[i]);
                    if (count > maxCount) {
                        maxCount = count;
                        maxCountIndex = i;
                    }
                }
                let ttrCurPxs = ttrFrags[maxCountIndex];
                let ttrCurFrags = [];

                let ttrCurSize = pxr.sizeOf(ttrCurPxs);
                let ttrCurGridSize = [ttrCurSize[0]+1, ttrCurSize[1]+1];
                let splitRouteBegin = randint(0, maxIndex);
                let splitRoute = [splitRouteBegin, ];
                routeGrow(splitRoute, ttrCurGridSize, Math.min(ttrCurSize[0]+ttrCurSize[1], 5));
                routeGrow(splitRoute.reverse(), ttrCurGridSize);
                let ttrAreas = getAreasSplitByRoute(ttrCurGridSize, splitRoute);
                for (const area of ttrAreas) {
                    let partPxs = pxr.create(ttrCurSize[0], ttrCurSize[1]);
                    for (const b of area) {
                        let [bx, by] = i2p(b, ttrCurSize[0]);
                        if (ttrCurPxs[bx][by]) partPxs[bx][by] = true;
                    }
                    let ttrIsoParts = pxr.isolated(partPxs);
                    for (const part of ttrIsoParts) {
                        ttrCurFrags.push(pxr.minized(part));
                    }
                }
                ttrFrags.splice(maxCountIndex, 1, ...ttrCurFrags);
            }
            
            if (avlBlocksOfArea[ttrArea].size >= ttrFrags.length) {
                for (const frag of ttrFrags) {
                    let ttrAt = randElem(Array.from(avlBlocksOfArea[ttrArea]));
                    let newTetris;
                    if (ttrRotateEnabled && Math.random() < 0.35) {
                        newTetris = new Tetris(ttrAt, true, false, pxr.rotated(frag, randint(0, 3)) );
                    } else {
                        newTetris = new Tetris(ttrAt, false, false, frag);
                    }
                    regElem(newTetris);
                }
            }
        }
        // passer REFIXED
        if (option("passer").checked) {
            let numPassers = randint(1, route.length / 4);
            let passedBlocks = [];
            for (let i = 0; i < routePass.length; i++) {
                if (routePass[i] > 0) passedBlocks.push(i);
            }
            for (let _ = 0; _ < numPassers; _++) {
                const passerAt = randElem(passedBlocks);
                const passerAtArea = areaOf[passerAt]; // bridge
                if (!elemOfBlock[passerAt]) {
                    regElem(new Passer(passerAt, routePass[passerAt]));
                }
            }
        }
        // splitter
        let colorOfArea = new Array(areas.length).fill(-1); // if splitter is not enabled, then theres no restriction.
        if (option("splitter").checked) {
            let randomColorConfusor = randint(0, 2);
            colorOfArea = areaIndexList.map((value, index) => (index + randomColorConfusor) % 3);

            let numSplitters = randint(3, (w-1)*(h-1)/5);
            for (let _ = 0; _ < numSplitters; _++) {
                const splitterAt = randint(0, (w-1)*(h-1) - 1);
                const splitterAtArea = areaOf[splitterAt];
                if (!elemOfBlock[splitterAt]) {
                    regElem(new Splitter(splitterAt, colorOfArea[splitterAtArea]));
                }
            }
        }
        // teamer REFIXED RULE CORRECTED
        if (option("teamer").checked) {
            let numTeamersAtAreas = randint(0, Math.ceil(areas.length * 0.8));
            let teamersAtAreas = randElems(areaIndexList, numTeamersAtAreas);
            for (const area of teamersAtAreas) {
                let numTeamerPairs = Math.min(randint(1, 3), randint(0, Math.floor(avlBlocksOfArea[area].size/2)));
                for (let i = 0; i < numTeamerPairs; i++) {
                    if (i == colorOfArea[area]) continue;
                    if (areas[area].size < 2) break; // no any more
                    let teamersAt = randElems(areas[area], 2);
                    if (teamersAt.some(b => (elemOfBlock[b]?.id == "teamer" || elemOfBlock[b]?.id == "splitter"))) continue;

                    for (let j = 0; j < 2; j++) {
                        const teamerAt = teamersAt[j];
                        if (!elemOfBlock[teamerAt]) {
                            regElem(new Teamer(teamerAt, i));
                        } else {
                            elemOfBlock[teamerAt].color = i;
                        }
                    }
                }
            }
        }
        // remover FOLLOWING ALL BELOW
        if (option("remover").checked && avlElemsList.length >= 2) {
            let removerAtArea = randElem(areaIndexList);
            if (avlBlocksOfArea[removerAtArea].size >= 2) {
                let removedElemName = randElem(avlElemsList).slice(4); // pzl-xxx
                let [removerAt, removedAt] = randElems(Array.from(avlBlocksOfArea[removerAtArea]), 2); // positions are decided earlier
                let newRemover = new Remover(removerAt);
                avlBlocksOfArea[removerAtArea].delete(removerAt);
                avlBlocksOfArea[removerAtArea].delete(removedAt); // delete or not, no difference.
                switch (removedElemName) {
                    case "point":
                        let avlPoints = pointsOfArea(areas[removerAtArea], w, h);
                        extRoute.forEach(point => avlPoints.delete(point));
                        elems.cut.forEach(cut => avlPoints.delete(cut.index));
                        if (avlPoints.size > 0) {
                            elems.point.push(new Point(randElem(Array.from(avlPoints))));
                            regElem(newRemover);
                        }
                        break;
                    case "splitter":
                        for (let i = 0; i < areas[removerAtArea].length; i++) {
                            const block = areas[removerAtArea][i];
                            if (elemOfBlock[block]?.id == "splitter") {
                                // when detect a Splitter, add another one that surely conflicts.
                                let color = elemOfBlock[block].color;
                                regElem(new Splitter(removedAt, (color + randint(1, 2)) % 3 ));
                                regElem(newRemover);
                                break;
                            }
                        }
                        break;
                    case "teamer":
                        regElem(new Teamer(removedAt, randint(0, 2)));
                        regElem(newRemover);
                        break;
                    case "passer":
                        let newPass;
                        do {newPass = randint(1, 3); } while (newPass == routePass[removedAt]);
                        regElem(new Passer(removedAt, newPass));
                        regElem(newRemover);
                        break;
                    case "tetris":
                    case "tetris-rotate":
                    case "tetris-clear":
                        // let newTtrFrag = pxr.createRandom(randint(1, 3), randint(1, 3), rand(0.1, 0.75));
                        // if (pxr.count(newTtrFrag) > 0) {
                        //     newTtrFrag = pxr.minized(pxr.isolated(newTtrFrag)[0]);
                        // } else {
                        //     newTtrFrag = [[true]];
                        // }
                        // let tetrisType = (removedElemName == "tetris-rotate" && Math.random() < 0.4) ? TETRIS_TYPE.ROTATE : TETRIS_TYPE.NORMAL;
                        // regElem(new Tetris(removedAt, tetrisType, newTtrFrag));
                        // regElem(newRemover);
                        break;
                    case "remover":
                    default:
                        break; // I dont like this rule.
                }
            }
        }
        // console.log("elems of pzl: %o", elems);
        return elems;
    }
    checkAns(elems) {
        const {areas, areaOf, route, extRoute} = this;
        const [w, h] = [...this.size];
        const areaIndexList = areas.map((value, index) => index);

        // remover stops normal answer checking.
        // NOTICE: Be careful when operating mmr address.
        if (elems.remover.length > 0) {
            // Recursion: Judge remover[0] only is ok
            let area = areaOf[elems.remover[0].index];
            let editedElems = deepCopy(elems);
            editedElems.remover.splice(0, 1);
            if (this.checkAns(editedElems)) return FAILURE;

            let elemsOfArea = [];
            let removablePoints = Array.from(pointsOfArea(areas[area], w, h)).filter(n => !extRoute.includes(n));
            elemsOfArea.push(...(editedElems.point.filter(pt => removablePoints.includes(pt.index)) ));
            for (const pzlName in editedElems) {
                if (pzlName == "point" || pzlName == "cut" || pzlName == "route") continue;
                for (const d of editedElems[pzlName]) {
                    if (areaOf[d.index] == area) {
                        elemsOfArea.push(d);
                    }
                }
            }
            
            for (const elem of elemsOfArea) {
                removeFrom(editedElems[elem.id], elem);
                if (this.checkAns(editedElems)) return SUCCESS;
                editedElems[elem.id].push(elem); // restore it
            }
            return FAILURE;
        }

        // point
        if (elems.point.some(d => !extRoute.includes(d.index))) {
            return FAILURE;
        }
        // splitter
        let splitColorsOfArea = new Array(areas.length).fill(0).map(() => new Set());
        for (const d of elems.splitter) {
            const area = areaOf[d.index];
            splitColorsOfArea[area].add(d.color);
        }
        if (splitColorsOfArea.some(colorSet => colorSet.size > 1)) {
            return FAILURE;
        }
        // teamer
        let blockedElems = [].concat(
            elems.splitter,
            elems.teamer,
            elems.tetris,
            elems.passer,
        );

        let teamColorsOfArea = new Array(areas.length).fill(0).map(() => new Object());
        for (const obj of teamColorsOfArea) {
            for (let i = 0; i <= 2; i++) obj[i] = 0;
        }
        for (const d of blockedElems) {
            if (d.color == -1) continue;
            const area = areaOf[d.index];
            teamColorsOfArea[area][d.color]++;
        }
        for (const d of elems.teamer) {
            const area = areaOf[d.index];
            if (teamColorsOfArea[area][d.color] !== 2) {
                return FAILURE;
            }
        }
        // passer
        if (elems.passer.some(d => (d.passCount !== this.routePass[d.index]) )) {
            return FAILURE;
        }
        // tetris FIXME
        let ttrsOfArea = new Array(areas.length).fill(0).map(() => []);
        for (const d of elems.tetris) {
            const area = areaOf[d.index];
            ttrsOfArea[area].push(d);
        }

        for (const area of areaIndexList) {
            let ttrList = ttrsOfArea[area];
            if (ttrList.length == 0) continue;

            let areaShape = pxr.create(w-1, h-1);
            for (const b of areas[area]) {
                const [x, y] = i2p(b, w-1);
                areaShape[x][y] = true;
            }
            areaShape = pxr.minized(areaShape);

            ttrList = ttrList.sort((ttrA, ttrB) => pxr.count(ttrB.shape) - pxr.count(ttrA.shape));
            ttrList.forEach(ttr => ttr.shape = pxr.minized(ttr.shape));
            let rotList   = ttrList.filter(ttr => ttr.isRotate).map(ttr => ttr.shape);
            let usedFrags = ttrList.map(ttr => ttr.shape);

            let fragsCount = usedFrags.reduce((sum, frag) => (sum + pxr.count(frag)), 0);
            if (fragsCount !== pxr.count(areaShape)) {
                return FAILURE;
            }

            if (rotList.length == 0) {
                if (!tetrisFit(areaShape, usedFrags)) {
                    return FAILURE;
                }
            } else {
                let rotState = new Array(rotList.length).fill(0);
                let areaResult = (() => {
                    while (rotState.at(-1) < 4) {
                        if (tetrisFit(areaShape, usedFrags)) {
                            return SUCCESS;
                        }
                        
                        // n-for (4)
                        rotState[0]++;
                        pxr.rotate90(rotList[0]);
                        for (let i = 0; i < rotState.length-1; i++) {
                            if (rotState[i] == 4) {
                                rotState[i] = 0;
                                rotState[i+1]++;
                                pxr.rotate90(rotList[i+1]);
                            }
                        }
                    }
                    return FAILURE;
                })();
                if (!areaResult) {
                    return FAILURE;
                }
            }
        }
        
        return SUCCESS;
    }
}

class Puzzle {
    size;   // grid[w, h]
    elems;  // {}
    theme;
    compPnlSize;
    compStep;
    compSize;
    compWidth;
    compOrig;
    compEndPos;
    compEndOffset;
    constructor(size, elems, themeId) {
        this.size = size;
        this.elems = elems;
        this.theme = themes[themeId];
    }
    resize(panel) {
        this.compPnlSize = panel.clientWidth; // = panel.clientHeight (square)
        this.compStep = Math.floor(Math.min(this.compPnlSize / (this.size[0]-1), this.compPnlSize / (this.size[1]-1)) * 0.8);
        this.compSize = [(this.size[0]-1) * this.compStep, (this.size[1]-1) * this.compStep];
        this.compWidth = Math.floor(Math.min(this.compStep * 0.25, this.compPnlSize * 0.033));
        this.compOrig = [Math.ceil((this.compPnlSize - this.compSize[0]) / 2), Math.ceil((this.compPnlSize - this.compSize[1]) / 2)];
        let endPos = i2p(this.elems.route.at(-1), this.size[0]);
        this.compEndPos = [endPos[0]*this.compStep, endPos[1]*this.compStep];
        this.compEndOffset = Math.min(this.compPnlSize*0.041, (this.compStep-this.compWidth)*0.82);
        if (endPos[0] == 0) {
            this.compEndPos[0] -= this.compEndOffset;
        } else if (endPos[0] == this.size[0]-1) {
            this.compEndPos[0] += this.compEndOffset;
        } else if (endPos[1] == 0) {
            this.compEndPos[1] -= this.compEndOffset;
        } else if (endPos[1] == this.size[1]-1) {
            this.compEndPos[1] += this.compEndOffset;
        }
    }
    check(route) {
        if (arrayEq(route, this.elems.route)) return SUCCESS;
        let checker = new PuzzleManager(this.size, route);
        return checker.checkAns(this.elems);
    }
    drawPuzzle(ctx) {
        let beginPos = i2p(this.elems.route[0], this.size[0]);
        let endPos = i2p(this.elems.route.at(-1), this.size[0]);

        let layerBg = document.querySelector(".canvas-layers .layer-bg");
        layerBg.style["background-color"] = this.theme.bgInner;
        layerBg.style["border-color"] = this.theme.bg;
        layerBg.style["border-width"] = `${(this.compPnlSize - this.compSize[1])/2}px ${(this.compPnlSize - this.compSize[0])/2}px`;

        ctx.save();
        ctx.clearRect(0, 0, this.compPnlSize, this.compPnlSize);
        ctx.translate(this.compOrig[0], this.compOrig[1]);
        ctx.strokeStyle = this.theme.lnBg;
        ctx.lineWidth = this.compWidth;
        ctx.lineCap = "round";
        
        // grid
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < this.size[0]; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.compSize[1]);
            ctx.translate(this.compStep, 0);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath()
        for (let i = 0; i < this.size[1]; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(this.compSize[0], 0);
            ctx.translate(0, this.compStep);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(beginPos[0] * this.compStep, beginPos[1] * this.compStep, this.compWidth*1.4, 0, 6.29);
        ctx.fill();
        ctx.beginPath();
        ctx.translate(endPos[0] * this.compStep, endPos[1] * this.compStep);
        if (endPos[0] == 0 || endPos[0] == this.size[0] - 1) {
            ctx.moveTo(-this.compEndOffset, 0);
            ctx.lineTo(this.compEndOffset, 0);
        } else {
            ctx.moveTo(0, -this.compEndOffset);
            ctx.lineTo(0, this.compEndOffset);
        }
        ctx.stroke();
        ctx.restore();

        // point & cut
        let allLineElems = [].concat(
            this.elems.point,
            this.elems.cut
        );
        ctx.lineWidth = 0;
        ctx.fillStyle = this.theme.point;
        for (const elem of allLineElems) {
            let p = i2pExt(elem.index, ...this.size);
            elem.draw(ctx, p[0]*this.compStep, p[1]*this.compStep, this.compWidth*0.5);
        }

        ctx.save();
        ctx.translate(this.compStep * 0.5, this.compStep * 0.5);
        // others
        let allBlockElems = [].concat(
            this.elems.splitter,
            this.elems.teamer,
            this.elems.passer,
            this.elems.tetris,
            this.elems.remover
        );
        let elemRad = Math.min(this.compPnlSize*0.03, (this.compStep-this.compWidth)*0.48);
        for (const elem of allBlockElems) {
            const pos = i2p(elem.index, this.size[0] - 1);
            ctx.fillStyle = ctx.strokeStyle = (elem.color == -1 ? this.theme[elem.id] : this.theme.splitter[elem.color]);
            elem.draw(ctx, pos[0] * this.compStep, pos[1] * this.compStep, elemRad);
        }

        ctx.restore();
        ctx.restore();
    }
    drawLines(ctx) {
        ctx.clearRect(0, 0, this.compPnlSize, this.compPnlSize);
        if (routeCurPos.length == 0) return;

        ctx.save();
        let colorCur;
        if (!sliding && puzzleState !== SUCCESS) {
            ctx.globalAlpha = (120-frame)/120;
            colorCur = (puzzleState == FAILURE) ? "#000" : this.theme.ln;
        }
        ctx.strokeStyle = ctx.fillStyle = colorCur || this.theme.ln;
        ctx.lineWidth = this.compWidth;
        ctx.lineCap = ctx.lineJoin = "round";

        ctx.translate(this.compOrig[0], this.compOrig[1]);
        ctx.beginPath();
        routeCurPos.forEach(pos => ctx.lineTo(pos[0] * this.compStep, pos[1] * this.compStep));
        ctx.lineTo(touchX, touchY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(routeCurPos[0][0] * this.compStep, routeCurPos[0][1] * this.compStep, this.compWidth * 1.4, 0, 6.29);
        ctx.fill();
        ctx.beginPath();
        // ctx.arc(touchX, touchY, this.compWidth * 1.4, 0, 6.29);
        // ctx.fill();
        if (sliding) {
            if (frame < 60) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${(60-frame)/60})`;
                ctx.lineWidth = 2;
                ctx.arc(this.compEndPos[0], this.compEndPos[1], frame * 0.4, 0, 6.29);
                ctx.stroke();
            }
            ctx.globalCompositeOperation = "source-atop";
            if (puzzleState == UNCOMPLETED) {
                ctx.fillStyle = "#fff3";
            } else { // NEARCOMPLETED
                ctx.fillStyle = `rgba(255, 255, 255, ${ease.quadBack((frame%60)/60)*0.5 + 0.1})`;
            }
            ctx.fillRect(-35, -35, this.compSize[0]+70, this.compSize[1]+70);
        }
        ctx.restore();
    }
}

export {PuzzleManager, Puzzle};