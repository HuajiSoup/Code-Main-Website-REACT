// main balls
const PI2 = Math.PI * 2;
var gravity = 2;
var hitEnergySave = 1.0;
var ballsHit = true;
var borderHit = false;
var clickType = 0; // 0 for click, 1 for drag, 2 for del
var ballRad = 50;
var ballMass = 1000;
var ballColor = "#FFA500";
var ballActive = true;
var dragStart;
var dragCurrent;
var ballsList = [];

var ww, wh;

const vecProd         = (v, n) => [v[0] * n, v[1] * n];
const vecAdd          = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
const vecMinus        = (v1, v2) => vecAdd(v1, vecProd(v2, -1));
const vecDotProd      = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
const vecGetLength2   = (v) => v[0] * v[0] + v[1] * v[1];
const vecGetLength    = (v) => Math.sqrt(vecGetLength2(v));
const vecProj         = (from, to) => vecProd(to, vecDotProd(from, to) / vecGetLength2(to));

class Ball {
    constructor(pos, radius, mass, vel, color, active) {
        this.pos = pos;
        this.r = radius;
        this.mass = mass;
        this.vel = vel;
        this.color = color;
        this.active = active;
    }
    move() {
        this.pos = vecAdd(this.pos, this.vel);
        if (borderHit) {
            if ((this.pos[0] < this.r && this.vel[0] < 0)||(this.pos[0] > ww-this.r && this.vel[0] > 0)) {this.vel[0] *= -hitEnergySave;}
            if ((this.pos[1] < this.r && this.vel[1] < 0)||(this.pos[1] > wh-this.r && this.vel[1] > 0)) {this.vel[1] *= -hitEnergySave;}
        }
    }
    inBorder() {
        return -this.r < this.pos[0] && this.pos[0] < ww+this.r && -this.r < this.pos[1] && this.pos[1] < wh+this.r; // too far
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.r, 0, PI2);
        ctx.fill();
        ctx.restore();
    }
}

function createBall(x, y, vel) {
    ballsList.push(new Ball([x, y], ballRad, ballMass, vel, ballColor, ballActive));
}
function physicsCalc(balls) {
    let accList = Array.from(new Array(balls.length), () => [0, 0]);
    let skipList = [];

    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        if (!ball.active || skipList.includes(i)) {continue;}

        for (let j = 0; j < balls.length; j++) { // Gravity
            if (i === j) {continue;}
            const ballG = balls[j];

            let disVec = vecMinus(ballG.pos, ball.pos);
            let dis2 = vecGetLength2(disVec);
            if (ballsHit && dis2 <= Math.pow(ball.r + ballG.r, 2)) { // hit & bonus
                let velVert = vecProj(ball.vel, disVec);
                let velVertG = vecProj(ballG.vel, disVec);
                if (vecDotProd(vecMinus(velVert, velVertG), disVec) >= 0) {
                    let velPara = vecMinus(ball.vel, velVert); 
                    let velParaG = vecMinus(ballG.vel, velVertG);
                    if (ballG.active) {
                        ball.vel = vecAdd(
                            vecProd(vecAdd(vecProd(velVert, ball.mass - ballG.mass), vecProd(velVertG, ballG.mass * 2)), hitEnergySave/(ball.mass + ballG.mass)),
                            velPara
                        );
                        ballG.vel = vecAdd(
                            vecProd(vecAdd(vecProd(velVertG, ballG.mass - ball.mass), vecProd(velVert, ball.mass * 2)), hitEnergySave/(ball.mass + ballG.mass)),
                            velParaG
                        );
                    } else {
                        ball.vel = vecAdd(
                            vecProd(vecMinus(vecProd(velVertG, 2), velVert), hitEnergySave),
                            velPara
                        ); // ballG.mass -> inf
                    }
                    accList[i] = [0, 0];
                    skipList.push(i, j);
                    break;
                }
            }
            accList[i] = vecAdd(accList[i], vecProd(disVec, ballG.mass / Math.pow(vecGetLength(disVec), 3))); // F = ma = GMm / r^2
        }
        accList[i] = vecProd(accList[i], gravity);
    }
    for (let i = 0; i < balls.length; i++) {
        balls[i].vel = vecAdd(balls[i].vel, accList[i]); // synchr
    }
}
function drawSky(ctx) {
    physicsCalc(ballsList);
    ballsList.forEach(ball => ball.move());
    ctx.fillRect(0, 0, ww, wh);
    ballsList.forEach(ball => ball.draw(ctx));
    if (dragStart && dragCurrent && clickType === 1) { // vel line
        ctx.save();
        ctx.beginPath();
        ctx.arc(dragStart[0], dragStart[1], ballRad, 0 ,PI2);
        ctx.stroke();
        ctx.moveTo(dragStart[0], dragStart[1]);
        ctx.lineTo(dragCurrent[0], dragCurrent[1]);
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
    }

    requestAnimationFrame(() => {drawSky(ctx)});
}

// DOM
document.addEventListener("DOMContentLoaded", () => {
    var canvas = document.querySelector("#balls-canvas");
    var settings = document.querySelector(".settings .box#set-box");
    var inputs = settings.querySelectorAll("input");
    var settingsOpened = false;
    function resizeCanvas() {
        ww = (canvas.width = window.innerWidth);
        wh = (canvas.height = window.innerHeight);
    }
    function option(select) {
        return settings.querySelector(select);
    }
    function getParas() {
        gravity = option("#env-g").valueAsNumber;
        hitEnergySave = (100 - option("#env-hit").valueAsNumber)/100;
        ballsHit = option("#env-balls-hit").checked;
        borderHit = option("#env-border-hit").checked;
        ballRad = option("#ball-rad").valueAsNumber;
        ballMass = option("#ball-mass").valueAsNumber;
        ballColor = option("#ball-color").value;
        ballActive = option("#ball-active").checked;
        clickType = Number(option("input[name='click-type']:checked").value);
        inputs.forEach(input => {
            input.classList.remove("edited");
        });

        for (let i = 0; i < ballsList.length; i++) {
            if (!ballsList[i].inBorder()) {ballsList.splice(i--, 1);}
        }
    }

    inputs.forEach(input => {
        input.addEventListener("change", () => input.classList.add("edited"));
    });
    option("#ball-color").addEventListener("change", () => {option("#ball-color-text").value = option("#ball-color").value;});
    option("#ball-color-text").addEventListener("change", () => {option("#ball-color").value = option("#ball-color-text").value;});
    option(".settings #btn-confirm").addEventListener("click", getParas);
    document.querySelector(".box#switch-box").addEventListener("click", () => {
        settingsOpened = !settingsOpened;
        if (settingsOpened) {
            settings.style["width"] = "20em";
        } else {
            settings.style["width"] = "0";
        }
    });

    const ctx = canvas.getContext("2d");
    if (ctx) {
        resizeCanvas();
        getParas();
        window.addEventListener("resize", resizeCanvas);
        canvas.addEventListener("click", (e) => {
            if (e.button === 0) {
                if (clickType === 0) {
                    createBall(e.pageX, e.pageY, [0, 0]);
                } else if (clickType === 2) {
                    for (let i = 0; i < ballsList.length; i++) {
                        const ball = ballsList[i];
                        if (vecGetLength2(vecMinus(ball.pos, [e.pageX, e.pageY])) < ball.r * ball.r) {
                            ballsList.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        });
        canvas.addEventListener("mousedown", (e) => {
            if (e.button === 0 && clickType === 1) {dragStart = [e.pageX, e.pageY];}
        });
        canvas.addEventListener("mousemove", (e) => {
            if (e.button === 0 && clickType === 1) {dragCurrent = [e.pageX, e.pageY];}
        });
        canvas.addEventListener("mouseup", (e) => {
            if (e.button === 0 && clickType === 1) {
                createBall(dragStart[0], dragStart[1], vecProd(vecMinus(dragCurrent, dragStart), 0.02));
                dragStart = dragCurrent = undefined;
            }
        });
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        drawSky(ctx);
    }
});