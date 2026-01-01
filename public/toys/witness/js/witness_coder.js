import { WitnessElem, Cut, Point, Splitter, Teamer, Tetris, Passer, Remover, TETRIS_TYPE } from "./witness_class_elems.js";
import { pixeler as pxr } from "../../common/lib/pixeler.js";

function encode(size, elems) {
    let codes = [];
    codes.push(`size: ${size[0]}, ${size[1]}`);
    codes.push(`begin: ${elems.route.at(0)}`);
    codes.push(`end: ${elems.route.at(-1)}`);

    let all = [];
    for (const pzlName in elems) {
        if (pzlName === "route") continue;
        all.push(...elems[pzlName]);
    }
    all.forEach(elem => {
        switch (elem.id) {
            case "cut":
            case "point":
                codes.push(`${elem.id}: ${elem.index}`);
                break;
            case "splitter":
            case "teamer":
                codes.push(`${elem.id}: ${elem.index}, ${elem.color}`);
                break;
            case "passer":
                codes.push(`passer: ${elem.index}, ${elem.passCount}, ${elem.color}`);
                break;
            case "tetris":
                let shape = "";
                for (let y = 0; y < elem.shape[0].length; y++) {
                    for (let x = 0; x < elem.shape.length; x++) {
                        shape += elem.shape[x][y] ? "1" : "0";
                    }
                    shape += "|";
                }
                codes.push(`tetris: ${elem.index}, ${elem.tetrisType}, ${shape}, ${elem.color}`); // PREVIOUS
                // codes.push(`tetris: ${elem.index}, ${elem.isRotate}, ${isClear}, ${shape}, ${elem.color}`); // NOT RELEASED
                break;
            case "remover":
                codes.push(`remover: ${elem.index}, ${elem.color}`);
                break;
            default:
                break;
        }
    });
    return codes.join("; ");
}

function decode(code) {
    let codes = code.replace(/\s+/g,"").split(";");
    let basic = codes.splice(0, 3);
    let size = basic[0].split(":")[1].split(",").map(str => parseInt(str));
    let elems = {
        route: [],
        cut: [],
        point: [],
        splitter: [],
        teamer: [],
        passer: [],
        tetris: [],
        remover: [],
    };
    elems.route = [basic[1].split(":")[1], basic[2].split(":")[1]];
    
    for (const c of codes) {
        let [name, ...paras] = c.split(/\:|\,/);
        paras = paras.map((para) => isNaN(para) ? para : parseInt(para));
        switch (name) {
            case "point":
                elems.point.push(new Point(...paras));
                break;
            case "cut":
                elems.cut.push(new Cut(...paras));
                break;
            case "splitter":
                elems.splitter.push(new Splitter(...paras));
                break;
            case "teamer":
                elems.teamer.push(new Teamer(...paras));
                break;
            case "passer":
                elems.passer.push(new Passer(...paras));
                break;
            case "tetris":
                // FOR ABANDONED CODE
                if (paras.length === 4) {
                    let newTypeCode = [0, 0];
                    switch (paras[1]) {
                        case TETRIS_TYPE.NORMAL:
                            break;
                        case TETRIS_TYPE.ROTATE:
                            newTypeCode[0] = 1;
                            break;
                        case TETRIS_TYPE.CLEAR:
                            newTypeCode[1] = 1;
                            break;
                        case TETRIS_TYPE.ROTATE_CLEAR:
                            newTypeCode[0] = 1;
                            newTypeCode[1] = 1;
                            break;
                        default:
                            break;
                    }
                    paras.splice(1, 1, ...newTypeCode);
                }

                let shapeList = paras[2].split("|");
                if (!shapeList.at(-1)) shapeList.splice(-1, 1);
                let [xh, yh] = [shapeList[0].length, shapeList.length];
                let shape = pxr.create(xh, yh);
                for (let y = 0; y < yh; y++) {
                    for (let x = 0; x < xh; x++) {
                        shape[x][y] = (shapeList[y][x] === "1");
                    }
                }
                paras[2] = shape;
                elems.tetris.push(new Tetris(...paras));
                break;
            case "remover":
                elems.remover.push(new Remover(...paras));
                break;
            default:
                break;
        }
    }
    return {size: size, elems: elems};
}

export { encode, decode };