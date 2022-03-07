const numStars = 10000;

let vx = 0;
let vy = 0;

let keysDown = {};

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown[e.key] = true;
}, false);
document.addEventListener('keyup', function(e) {
    keysDown[e.key] = false;
}, false);

var ctx = canvas.getContext("2d");

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.font = "30px Arial";
ctx.fillStyle = "#FFFFFF";
ctx.fillText("Hello TypeScript!!!1", 10, 50);

var stars = makeStars();
setInterval(tick, 20)

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        /* IE11 */
        canvas.msRequestFullscreen();
  }
}

function tick() {
    stars.forEach(function(star, i, stars) {

        if (keysDown['a']) {
            vx += 0.00001;
        }
        if (keysDown['w']) {
            vy += 0.00001;
        }
        if (keysDown['d']) {
            vx -= 0.00001;
        }
        if (keysDown['s']) {
            vy -= 0.00001;
        }

        star.x = (star.x + vx / star.z);
        star.y = (star.y + vy / star.z);
        if (star.x < 0) {
            star.x += canvas.width;
        }
        if (star.x >= canvas.width) {
            star.x -= canvas.width;
        }
        if (star.y < 0) {
            star.y += canvas.height;
        }
        if (star.y >= canvas.height) {
            star.y -= canvas.height;
        }
    });

    drawStars();
}

function makeStars() {
    let stars = [];

    for (var i = 0; i < numStars; i++) {
        const star = {
            "x": Math.random() * canvas.width,
            "y": Math.random() * canvas.height,
            "z": Math.random() * 10 + 1
        }
        stars.push(star);
    }

    return stars;
}

function drawStars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(function(value, index, array) {
        drawStar(ctx, value);
    });
}

function drawStar(ctx: CanvasRenderingContext2D, dot) {
    drawDot(dot.x, dot.y, 255.0 / (dot.z), Math.min(1/dot.z, 3));
}

function drawDot(x: number, y: number, brightness: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
    ctx.fill();
}