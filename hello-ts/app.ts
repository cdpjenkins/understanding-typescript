console.log('I am an initial TS app!!!1');

var c = document.getElementById("myCanvas") as HTMLCanvasElement;
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(400, 400);
ctx.stroke();

ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();
