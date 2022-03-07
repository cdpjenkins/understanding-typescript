const numStars = 20000;

console.log('I am an initial TS app!!!1');

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
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
        star.x = (star.x - 1 / star.distance);
        if (star.x < 0) {
            star.x += canvas.width;
        }
    });

    drawStars();
}

function makeStars() {
    let stars = [];

    for (var i = 0; i < numStars; i++) {
        var star = {
            "x": Math.random() * canvas.width,
            "y": Math.random() * canvas.height,
            "distance": Math.random() * 10
        }
        stars.push(star);
    }

    return stars;
}

function drawStars() {
    console.log("drawDots")

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(function(value, index, array) {
        drawStar(ctx, value);
    });
}

function drawStar(ctx: CanvasRenderingContext2D, dot) {
    var brightness = 256 / dot.distance
    ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
    ctx.fillRect(dot.x, dot.y, 1, 1);
}
