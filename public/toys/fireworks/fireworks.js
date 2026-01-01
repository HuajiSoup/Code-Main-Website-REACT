var canvas = document.getElementById("fireworks-canvas");
var w, h;
const GRAVITY = 0.04;
const PI2 = Math.PI*2;
var colors = [[255,0,0],[0,255,0],[0,255,255],[255,255,0],[255,0,255],
    [255,165,0],[255,0,165],[165,255,0],[165,0,255],[0,165,255],[0,255,165]];
var ptcs = [];
var ctx;

function newParticle(x, y, vx, vy, r, color, alpha) {
    let bColor = `rgb(${clamp(0, color[0]+random(-20, 20), 255)}, ${
        clamp(0, color[1]+random(-20, 20), 255)
        }, ${clamp(0, color[2]+random(-25, 25), 255)})`;
    return [x, y, vx, vy, r, bColor, alpha];
}
function particleMove(ptc) {
    ptc[0] += ptc[2];
    ptc[1] += (ptc[3] += GRAVITY);
    ptc[6] -= 0.01;
    return ptc[6] > 0 && ptc[1] < h && 0 < ptc[0] < w;
}
function particleDraw(ptc, ctx) {
    ctx.save();
    ctx.fillStyle = ptc[5];
    ctx.globalAlpha = ptc[6];
    ctx.beginPath();
    ctx.arc(ptc[0], ptc[1], ptc[4], 0, PI2);
    ctx.fill();
    ctx.restore();
}
function drawSky(ctx) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < ptcs.length; i++) {
        let inScreen = particleMove(ptcs[i]);
        if (!inScreen) {
            ptcs.splice(i--, 1);
            continue;
        }
        particleDraw(ptcs[i],ctx);
    }
    requestAnimationFrame(() => {
        if (Math.random() < 0.015) createFirework(random(0, w), random(0,h));
        drawSky(ctx);
    });
}
function createFirework(x, y) {
    let r = random(2.5, 4);
    let num = random(50, 180);
    let color = colors[Math.floor(Math.random()*11)];
    for (let i = 0; i < num; i++) {
        let vx = random(-r, r);
        let vy = Math.sqrt(r*r-vx*vx)*random(-1, 1);
        let pr = random(1.3, 4.2);
        let alpha = random(0.6, 1.1);
        ptcs.push(newParticle(x, y, vx, vy, pr, color, alpha));
    }
}
function resizeCanvas() {   
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
function clamp(min, value, max) {
    return value > min ? value < max ? value : max : min;
}
function random(from=0, to=1) {
    return from + Math.random() * (to - from);
}

resizeCanvas();
if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("click", function(e) {
        createFirework(e.pageX, e.pageY);
    });
    createFirework(w/2, h/2);
    drawSky(ctx);
}