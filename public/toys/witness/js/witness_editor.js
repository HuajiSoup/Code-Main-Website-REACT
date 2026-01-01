import { themes, p2i, i2p, indexBtw, p2iExt, i2pExt } from "./witness_public.js";
import { Puzzle } from "./witness_class_puzzles.js";
import { WitnessElem, Point, Splitter, Teamer, Tetris, Passer, Remover, TETRIS_TYPE, Cut } from "./witness_class_elems.js";
import { clamp, deepCopy, randint } from "../../common/lib/huaji-query.js";
import { pixeler as pxr } from "../../common/lib/pixeler.js";
import * as elemCoder from "./witness_coder.js";

const STATE = {
    NOTHING: 0,
    SETTING_BEGIN: 1,
    SETTING_END  : 2,
    SETTING_ELEM_ON_LINE : 3,
    SETTING_ELEM_ON_BLOCK: 4,
}
var editorState = STATE.NOTHING;

function option(name) {
    return document.querySelector(`#settings-box input[name="${name}"], #settings-box select[name="${name}"]`);
}
function valueOf(selector) {
    return selector[selector.selectedIndex].value;
}

document.addEventListener("DOMContentLoaded", () => {
    let layers = document.querySelector("main .canvas-layers");
    let layerPanel = layers.querySelector("canvas#layer-panel");
    let layerCursor  = layers.querySelector("canvas#layer-cursor");
    let canvaView = document.querySelector("canvas#elem-view");
    let ctxPanel = layerPanel.getContext("2d");
    let ctxCursor = layerCursor.getContext("2d");
    let ctxView = canvaView.getContext("2d");

    let elemSelector = option("elem-selector");
    let colorSelector = option("public-color");
    let tetrisShaper = document.querySelector("#tetris-shape");
    let puzzleCoder = document.querySelector("textarea.puzzle-coder");

    let puzzle, elems, theme, color, elemName, size;
    let compOrig, compStep, compSize;
    let element = new WitnessElem();

    function drawCursor(ctx, x, y) {
        ctx.save();
        ctxCursor.lineWidth = 5;
        ctxCursor.strokeStyle = "#000";
        ctxCursor.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 6.29);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    function updateSelectedElement() {
        let elemNameNew = valueOf(elemSelector);
        if (elemNameNew === elemName) return;
        elemName = elemNameNew;

        document.querySelectorAll(".elem-editor:not(#public)").forEach(p => {
            p.style.display = "none";
        });
        document.querySelector(`.elem-editor#${elemName}`).style.display = "initial";

        let color = valueOf(colorSelector);
        switch (elemName) {
            case "cut":
                element = new Cut(undefined);
                break;
            case "point":
                element = new Point(undefined);
                break;
            case "splitter":
                element = new Splitter(undefined, color);
                break;
            case "teamer":
                element = new Teamer(undefined, color);
                break;
            case "passer":
                element = new Passer(undefined, undefined, color);
                break;
            case "tetris":
                element = new Tetris(undefined, undefined, undefined, undefined, color);
                break;
            case "remover":
                element = new Remover(undefined, color);
                break;
            default:
                break;
        }
        if (elemName === "splitter" || elemName === "teamer") {
            colorSelector.querySelector("option[value='-1']").disabled = true;
            colorSelector.selectedIndex = 1;
        } else {
            colorSelector.querySelector("option[value='-1']").disabled = false;
            colorSelector.selectedIndex = 0;
        }
        if (elemName === "point" || elemName === "cut") {
            editorState = STATE.SETTING_ELEM_ON_LINE;
        } else {
            editorState = STATE.SETTING_ELEM_ON_BLOCK;
        }
    }
    function editElement() {
        color = valueOf(colorSelector);
        switch (elemName) {
            case "splitter":
            case "teamer":
            case "remover":
                element.color = color;
                break;
            case "passer":
                element.passCount = valueOf(option("passer-times"));
                element.color = color;
                break;
            case "tetris":
                let w = parseInt(tetrisShaper.getAttribute("data-tetris-width"));
                let h = parseInt(tetrisShaper.getAttribute("data-tetris-height"));
                let shape = pxr.create(w, h);
                for (let x = 0; x < w; x++) {
                    for (let y = 0; y < h; y++) {
                        shape[x][y] = (tetrisShaper.querySelector(`span:nth-child(${y+1}) span:nth-child(${x+1})`).hasAttribute("selected"));
                    }
                }
                element.shape = shape;
                element.isRotate = option("tetris-rotate").checked;
                element.isClear  = option("tetris-clear").checked;
                element.color = color;
                break;
            default:
                break;
        }
    
        ctxView.clearRect(0, 0, 40, 40);
        ctxView.fillStyle = ctxView.strokeStyle = (color === -1) ? theme[element.id] : theme.splitter[color];
        element.draw(ctxView, 20, 20, 19);
    }

    option("submit-step1").addEventListener("click", () => {
        let w = option("size-w").valueAsNumber;
        let h = option("size-h").valueAsNumber;
        if (Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0) {
            size = [w, h];
            elems = {
                route: [0, 0],
                cut: [],
                point: [],
                splitter: [],
                teamer: [],
                tetris: [],
                passer: [],
                remover: [],
            };
            puzzle = new Puzzle(size, elems, randint(0, themes.length-1));
            puzzle.resize(layers);
            puzzleInit(puzzle);
            puzzle.drawPuzzle(ctxPanel);

            document.querySelector(".maker#step2").style.display = "initial";
            option("submit-step1").disabled = true;
            option("reset-step1").disabled = false;
            editorState = STATE.SETTING_BEGIN;
        }
    });

    option("reset-step1").addEventListener("click", () => {
        document.querySelectorAll(".maker#step2, .maker#step3, .maker#coder").forEach(step => {
            step.style.display = "none";
        });
        option("submit-step1").disabled = false;
        option("reset-step1").disabled = true;
        option("submit-step2").disabled = false;
        option("reset-step2").disabled = true;
        editorState = STATE.NOTHING;
    });


    option("submit-step2").addEventListener("click", () => {
        document.querySelector(".maker#step3").style.display = "initial";
        document.querySelector(".maker#coder").style.display = "initial";
        option("submit-step2").disabled = true;
        option("reset-step2").disabled = false;
        elemName = undefined;
        updateSelectedElement();
        editElement();
        puzzleCoder.value = elemCoder.encode(size, puzzle.elems);
    });

    option("reset-step2").addEventListener("click", () => {
        document.querySelector(".maker#step3").style.display = "none";
        document.querySelector(".maker#coder").style.display = "none";
        option("submit-step2").disabled = false;
        option("reset-step2").disabled = true;
        editorState = STATE.SETTING_BEGIN;
    });


    document.querySelectorAll(".maker#step3 input[name^='tetris-shape']").forEach(op => {
        op.addEventListener("change", () => {
            let w = option("tetris-shape-w").valueAsNumber;
            let h = option("tetris-shape-h").valueAsNumber;
            if (w > 0 && h > 0 && Number.isInteger(w) && Number.isInteger(h)) {
                tetrisShaper.setAttribute("data-tetris-width", w);
                tetrisShaper.setAttribute("data-tetris-height", h);
                tetrisShaper.innerHTML = "";
                for (let y = 0; y < h; y++) {
                    let xbox = document.createElement("span");
                    for (let x = 0; x < w; x++) {
                        xbox.appendChild(document.createElement("span"));
                    }
                    tetrisShaper.appendChild(xbox);
                }
                editElement();
            }
        });
    });

    document.querySelector(".maker#step3 #tetris-shape").addEventListener("click", (e) => {
        if (e.target.hasAttribute("selected")) {
            e.target.removeAttribute("selected");
        } else {
            e.target.setAttribute("selected", true);
        }
        editElement();
    });

    document.querySelectorAll(".maker#step3 input:not([name^='tetris-shape']), .maker#step3 select").forEach(op => {
        op.addEventListener("change", () => {
            updateSelectedElement();
            editElement();
        });
    });

    layers.addEventListener("mousemove", (e) => {
        if (editorState) {
            let cursorPos;
            let offsetX = clamp(0, e.offsetX-compOrig[0], compSize[0]-1);
            let offsetY = clamp(0, e.offsetY-compOrig[1], compSize[1]-1);

            ctxCursor.save();
            ctxCursor.clearRect(0, 0, layerCursor.clientWidth, layerCursor.clientHeight);
            ctxCursor.translate(compOrig[0], compOrig[1]);
            if (editorState === STATE.SETTING_BEGIN || editorState === STATE.SETTING_END) {
                cursorPos = [Math.round(offsetX / compStep)*compStep, Math.round(offsetY / compStep)*compStep];
                drawCursor(ctxCursor, cursorPos[0], cursorPos[1]);
            } else if (editorState === STATE.SETTING_ELEM_ON_LINE || editorState === STATE.SETTING_ELEM_ON_BLOCK) {
                cursorPos = [Math.round(offsetX*2 / compStep)*compStep/2, Math.round(offsetY*2 / compStep)*compStep/2];
                ctxCursor.clearRect(0, 0, layerCursor.clientWidth, layerCursor.clientHeight);
                if (elemName === "cut") {
                    drawCursor(ctxCursor, cursorPos[0], cursorPos[1]);
                } else {
                    ctxCursor.fillStyle = ctxCursor.strokeStyle = (color === -1) ? theme[element.id] : theme.splitter[color];
                    element.draw(ctxCursor, cursorPos[0], cursorPos[1], compStep*0.25);
                }
            }
            ctxCursor.restore();
        }
    });
    
    // SET ELEMENTS
    layers.addEventListener("click", (e) => {
        if (!editorState) return;

        let offsetX = clamp(0, e.offsetX-compOrig[0], compSize[0]-1);
        let offsetY = clamp(0, e.offsetY-compOrig[1], compSize[1]-1);

        let grid = [Math.round(offsetX*2 / compStep), Math.round(offsetY*2 / compStep)];
        let pos = [];
        if (editorState === STATE.SETTING_BEGIN) {
            pos = [Math.round(offsetX / compStep), Math.round(offsetY / compStep)];
            elems.route[0] = p2i(pos, size[0]);

            editorState = STATE.SETTING_END;
        } else if (editorState === STATE.SETTING_END) {
            pos = [Math.round(offsetX / compStep), Math.round(offsetY / compStep)];
            puzzle.elems.route[1] = p2i(pos, size[0]);

            editorState = STATE.SETTING_BEGIN;
        } else if (editorState === STATE.SETTING_ELEM_ON_BLOCK) {
            if (grid[0] % 2 === 1 && grid[1] % 2 === 1) {
                pos = [Math.round(grid[0]/2 - 0.5), Math.round(grid[1]/2 - 0.5)];
                element.index = p2i(pos, size[0]-1);
                puzzle.elems[element.id].push(deepCopy(element));
            }
        } else if (editorState === STATE.SETTING_ELEM_ON_LINE) {
            if (grid[0] % 2 === 0 || grid[1] % 2 === 0) {
                element.index = p2iExt([grid[0]/2, grid[1]/2], ...size);
                puzzle.elems[element.id].push(deepCopy(element));
            }
        }
        puzzle.drawPuzzle(ctxPanel);
        puzzleCoder.value = elemCoder.encode(size, puzzle.elems);
    });

    // DELETE ELEMENTS
    layers.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        let offsetX = clamp(0, e.offsetX-compOrig[0], compSize[0]-1);
        let offsetY = clamp(0, e.offsetY-compOrig[1], compSize[1]-1);
        let grid = [Math.round(offsetX*2 / compStep), Math.round(offsetY*2 / compStep)];
        if (editorState === STATE.SETTING_ELEM_ON_BLOCK) {
            if (grid[0] % 2 === 1 && grid[1] % 2 === 1) {
                let pos = [Math.round(grid[0]/2 - 0.5), Math.round(grid[1]/2 - 0.5)];
                let del = p2i(pos, size[0]-1);
                for (const pzlName in puzzle.elems) {
                    if (pzlName === "point" || pzlName === "cut" || pzlName === "route") continue;
                    let delIndex = puzzle.elems[pzlName].findIndex((elem) => (elem.index === del));
                    if (delIndex >= 0) {
                        puzzle.elems[pzlName].splice(delIndex, 1);
                        break;
                    }
                }
            }
        } else if (editorState === STATE.SETTING_ELEM_ON_LINE) {
            if (grid[0] % 2 === 0 || grid[1] % 2 === 0) {
                let del = p2iExt([grid[0]/2, grid[1]/2], ...size);
                for (const pzlName of ["point", "cut"]) {
                    let delIndex = puzzle.elems[pzlName].findIndex((elem) => (elem.index === del));
                    if (delIndex >= 0) {
                        puzzle.elems[pzlName].splice(delIndex, 1);
                        break;
                    }
                }
            }
        }
        puzzleCoder.value = elemCoder.encode(size, elems);
        puzzle.drawPuzzle(ctxPanel);
    });

    layers.addEventListener("mouseleave", () => {
        ctxCursor.clearRect(0, 0, layerCursor.clientWidth, layerCursor.clientHeight);
    });

    function puzzleInit(puzzle) {
        ({compStep, compOrig, size, theme} = puzzle);
        compSize = [(size[0]-1)*compStep, (size[1]-1)*compStep];
    }
    function resizeCanvas(canvas, box) {
        canvas.width = box.clientWidth;
        canvas.height = box.clientHeight;
    }
    window.addEventListener("resize", () => {
        resizeCanvas(layerPanel, layers);
        resizeCanvas(layerCursor, layers);
        if (puzzle) {
            puzzle.resize(layers);
            puzzleInit(puzzle);
            puzzle.drawPuzzle(ctxPanel);
        }
    });
    resizeCanvas(layerPanel, layers);
    resizeCanvas(layerCursor, layers);

    function resetAllInput() {
        document.querySelectorAll("input[value]").forEach(op => {
            op.value = op.getAttribute("value");
        });
        document.querySelectorAll("input[disabled]").forEach(op => {
            op.disabled = true;
        });
    }
    resetAllInput();
});