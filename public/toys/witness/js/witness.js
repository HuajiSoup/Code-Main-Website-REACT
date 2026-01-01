// main
import {clamp, randint, arrayFilled, offsetEq, arrayEq} from "../../common/lib/huaji-query.js";
import {i2p, i2pExt, p2i, routeCompleted, themes} from "./witness_public.js";
import {PuzzleManager, Puzzle} from "./witness_class_puzzles.js";
import { cursorMove, cursorInit} from "./witness_cursor.js";
import * as elemCoder from "./witness_coder.js";

const CROSSING  = -1;
const HORIZONAL = 0;
const VERTICAL  = 1;

const UNCOMPLETED = -2;
const NEARCOMPLETED = -1;
const FAILURE = 0;
const SUCCESS = 1;

const CREATE_BY_RANDOM = 0;
const CREATE_BY_CODE = 1;
var createBy = CREATE_BY_RANDOM;

var sliding = false;
var routeCurPos = [];
var touchX;
var touchY;
var touch;
var puzzleState = UNCOMPLETED;
var frame = 0;
var puzzles = [];
var puzzleCur = -1;
function getPuzzleSize() {
    let size;
    if (Math.random() < 0.75) {
        size = arrayFilled(2, randint(3, 8));
    } else {
        size = [randint(3, 8), randint(3, 8)];
    }
    if (option("size-width").valueAsNumber > 0) size[0] = option("size-width").valueAsNumber;
    if (option("size-height").valueAsNumber > 0) size[1] = option("size-height").valueAsNumber;
    return size;
}
function option(name) {
    return document.querySelector(`#settings-box input[name="pzl-${name}"]`);
}

// DOM

document.addEventListener("DOMContentLoaded", () => {
    let layers = document.querySelector("main .canvas-layers");
    let layerPanel = layers.querySelector("canvas#layer-panel");
    let layerLine  = layers.querySelector("canvas#layer-line");
    let ctxPanel = layerPanel.getContext("2d");
    let ctxLine = layerLine.getContext("2d");
    let panelBox = document.querySelector("main #panel-box");
    let settingsBox = document.querySelector("main #settings-box");
    let allSettings = document.querySelectorAll("#panel-box input, #settings-box input");
    let settingsDisability = [];
    let isTouchDevice = "ontouchstart" in window || "ontouchstart" in document.documentElement;
    let layerLeft, layerTop; // only for touch device
    const MODE_SUBMIT = 0;
    const MODE_NEW_GAME = 1;

    let size, compOrig, compStep, compSize, compPnlSize, elems, beginPos, endPos, compBeginPos, compEndPos;

    function puzzleInit(pzl) {
        pzl.resize(layers);
        ({size, compOrig, compStep, compSize, compPnlSize, compEndPos, elems} = pzl);
        beginPos = i2p(elems.route[0], size[0]);
        endPos = i2p(elems.route[elems.route.length-1], size[0]);
        compBeginPos = [beginPos[0]*compStep, beginPos[1]*compStep];
        routeCurPos = [];
        settingsBox.querySelector("#creator-random textarea.puzzle-coder").value = elemCoder.encode(size, elems);
    }

    function layersClickOperate(mode, ex, ey) {
        if (mode == MODE_NEW_GAME) {
            let offsetX = ex - compOrig[0];
            let offsetY = ey - compOrig[1];
            if (offsetEq(offsetX, compBeginPos[0], 35) && offsetEq(offsetY, compBeginPos[1], 35)) {
                // hit on begin pt, then
                touchX = beginPos[0]*compStep; 
                touchY = beginPos[1]*compStep;
                touch = [touchX, touchY];
                routeCurPos = [beginPos];
                puzzleState = UNCOMPLETED;
                settingsDisability = Array.from(allSettings).map(setting => [setting, setting.disabled]);
                allSettings.forEach(s => (s.disabled = true));
                cursorInit(puzzles[puzzleCur], touch, routeCurPos);
                sliding = true;
            }
        } else if (mode == MODE_SUBMIT) {
            if (puzzleState == NEARCOMPLETED) {
                if (!arrayEq(routeCurPos.at(-1), endPos)) routeCurPos.push(endPos);
                routeCurPos = routeCompleted(routeCurPos);
                let route = [];
                routeCurPos.forEach(p => route.push(p2i(p, puzzles[puzzleCur].size[0])) );
                puzzleState = puzzles[puzzleCur].check(route);
            }
            settingsDisability.forEach(sd => sd[0].disabled = sd[1]);
            sliding = false;
        }
    }

    // MOTION for PC | phones.. However they might not stable
    if (isTouchDevice) {
        layers.addEventListener("touchstart", (e) => {
            if (puzzles.length == 0) return;
            if (!sliding) {
                frame = 0;
                layerLeft = layers.offsetLeft;
                layerTop = layers.offsetTop;
                layersClickOperate(MODE_NEW_GAME, e.targetTouches[0].pageX - layerLeft, e.targetTouches[0].pageY - layerTop);
            }
        });
        layers.addEventListener("touchend", (e) => {
            if (sliding) layersClickOperate(MODE_SUBMIT);
        });
        layers.addEventListener("touchmove", (e) => {
            if (sliding) {
                e.preventDefault();
                cursorMove(e.targetTouches[0].pageX - layerLeft, e.targetTouches[0].pageY - layerTop);
                touchX = touch[0];
                touchY = touch[1];
                puzzleState = (touchX == compEndPos[0] && touchY == compEndPos[1]) ? NEARCOMPLETED : UNCOMPLETED;
            }
        }, true);
    } else {
        layers.addEventListener("click", (e) => {
            if (puzzles.length == 0) return;
            frame = 0;
            if (sliding) {
                layersClickOperate(MODE_SUBMIT);
            } else {
                layersClickOperate(MODE_NEW_GAME, e.offsetX, e.offsetY);
            }
        });
        layers.addEventListener("mousemove", (e) => {
            if (sliding) {
                cursorMove(e.offsetX, e.offsetY);
                touchX = touch[0];
                touchY = touch[1];
                puzzleState = (touchX == compEndPos[0] && touchY == compEndPos[1]) ? NEARCOMPLETED : UNCOMPLETED;
            }
        }, true);
    }

    // general
    panelBox.querySelector("input#next-pzl").addEventListener("click", () => {
        if (puzzleCur == puzzles.length-1) {
            let size, elems;
            if (createBy == CREATE_BY_RANDOM) {
                size = getPuzzleSize();
                let puzzler = new PuzzleManager(size);
                elems = puzzler.createPuzzleElems();
            } else {
                try {
                    ({size:size, elems:elems} = elemCoder.decode(settingsBox.querySelector("#creator-code textarea.puzzle-coder").value));
                    settingsBox.querySelector("p#error-shower").innerHTML = "";
                } catch (err) {
                    settingsBox.querySelector("p#error-shower").innerHTML = "关卡代码解析失败,请重试!!";
                    console.error(err);
                    return;
                }
            }
            // (w-1)*(h-1) blocks; w*h*3 - w - h pts.
            puzzles.push(new Puzzle(
                size,
                elems,
                randint(0, themes.length - 1)
            ));
        }
        puzzleCur++;
        panelBox.querySelector("input#last-pzl").disabled = (puzzleCur == 0);
        panelBox.querySelector("input#next-pzl").value = (puzzleCur == puzzles.length - 1) ? "新题目 →" : "下一题 →";
        panelBox.querySelector("span#pzl-index").innerHTML = `第 ${puzzleCur + 1} / ${puzzles.length} 题`;

        puzzleInit(puzzles[puzzleCur]);
        puzzles[puzzleCur].drawPuzzle(ctxPanel);
    });
    
    panelBox.querySelector("input#last-pzl").addEventListener("click", () => {
        if (puzzleCur >= 1) {
            puzzleCur--;
            panelBox.querySelector("input#last-pzl").disabled = (puzzleCur == 0);
            panelBox.querySelector("input#next-pzl").value = (puzzleCur == puzzles.length - 1) ? "新题目 →" : "下一题 →";
            panelBox.querySelector("span#pzl-index").innerHTML = `第 ${puzzleCur + 1} / ${puzzles.length} 题`;

            puzzleInit(puzzles[puzzleCur]);
            puzzles[puzzleCur].drawPuzzle(ctxPanel);
        }
    });

    panelBox.querySelector("input#check-ans").addEventListener("click", () => {
        routeCurPos = [];
        puzzles[puzzleCur].elems.route.forEach(n => routeCurPos.push(i2p(n, size[0])));
        [touchX, touchY] = compEndPos;
        puzzleState = SUCCESS;
    });

    
    option("tetris").addEventListener("click", () => {
        option("tetris-rotate").disabled = option("tetris-clear").disabled = !option("tetris").checked;
    });

    document.querySelector("fieldset#pzl-create-method").addEventListener("change", () => {
        createBy = document.querySelector("input#create-random").checked ? CREATE_BY_RANDOM : CREATE_BY_CODE;
        settingsBox.querySelector(".creator#creator-random").style.display = (createBy == 0) ? "initial" : "none";
        settingsBox.querySelector(".creator#creator-code").style.display = (createBy == 1) ? "initial" : "none";
    }, true);
    document.querySelector("input#create-random").checked = true;
    
    function animate() {
        if (sliding || puzzleState == SUCCESS || frame < 115) frame = ++frame % 120;
        if (puzzleCur >= 0) {puzzles[puzzleCur].drawLines(ctxLine);}
        requestAnimationFrame(animate);
    }

    function resizeCanvas(canvas, box) {
        canvas.width = box.clientWidth;
        canvas.height = box.clientHeight;
    }
    window.addEventListener("resize", () => {
        resizeCanvas(layerPanel, layers);
        resizeCanvas(layerLine, layers);
        if (puzzleCur >= 0) {
            puzzleInit(puzzles[puzzleCur]);
            puzzles[puzzleCur].drawPuzzle(ctxPanel);
        }
    });
    resizeCanvas(layerPanel, layers);
    resizeCanvas(layerLine, layers);
    animate();
});

export {sliding, routeCurPos, touchX, touchY, puzzleState, frame};