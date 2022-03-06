console.log('I am an initial TS app!!!1');

var c = document.getElementById("myCanvas") as HTMLCanvasElement;
var ctx = c.getContext("2d");

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, c.width, c.height);

ctx.strokeStyle = "#FFFFFF"
ctx.moveTo(0, 0);
ctx.lineTo(400, 400);
ctx.stroke();

ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();

ctx.font = "30px Arial";
ctx.fillStyle = "#FFFFFF";
ctx.fillText("Hello TypeScript!!!1", 10, 50);

setInterval(drawDots, 500)

function drawDots() {
    console.log("drawDots")

    for (var i = 0; i < 100; i++) {
        drawDot(ctx, Math.random() * c.width, Math.random() * c.height);
    }
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    var brightness = Math.random() * 256
    ctx.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
    ctx.fillRect(x, y, 1, 1);
}