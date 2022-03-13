const numStars = 10000;
const spectralClasses = {
    "O": {
        r: 0x0b,
        g: 0xb0,
        b: 0xff,
        colour: "#9bb0ff"
    },
    "B": {
        r: 0xaa,
        g: 0xbf,
        b: 0xff,
        colour: "#aabfff"
    },
    "A": {
        r: 0xca,
        g: 0xd7,
        b: 0xff,
        colour: "#cad7ff"
    },
    "F": {
        r: 0xf8,
        g: 0xf7,
        b: 0xff,
        colour: "#f8f7ff"
    },
    "G": {
        r: 0xff,
        g: 0xf4,
        b: 0xea,
        colour: "#fff4ea"
    },
    "K": {
        r: 0xff,
        g: 0xd2,
        b: 0xa1,
        colour: "#ffd2a1"
    },
    "M": {
        r: 0xff,
        g: 0xcc,
        b: 0x6f,
        colour: "#ffcc6f"
    },
}

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
    if (keysDown['a']) {
        vx += 0.01;
    }
    if (keysDown['w']) {
        vy += 0.01;
    }
    if (keysDown['d']) {
        vx -= 0.01;
    }
    if (keysDown['s']) {
        vy -= 0.01;
    }

    for (const star of stars) {
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
    }

    drawStars();
}

function makeStars() {
    let stars = [];

    for (var i = 0; i < numStars; i++) {
        const star = {
            "x": Math.random() * canvas.width,
            "y": Math.random() * canvas.height,
            "z": Math.random() * 10 + 0.5,
            "spectralClass": randomSpectralClass()
        }
        stars.push(star);
    }

    stars.sort((a, b) => b.z - a.z )

    return stars;
}

function randomSpectralClass() {
    let keys = Object.keys(spectralClasses)
    const randomElement = keys[Math.floor(Math.random() * keys.length)];

    console.log(randomElement);

    return randomElement;
}

function drawStars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(function(value, _index, _array) {
        drawStar(ctx, value);
    });
}

function drawStar(_ctx: CanvasRenderingContext2D, star) {
    const spectralClass = spectralClasses[star.spectralClass];
    const brightness = Math.max(255.0 / (star.z), 25);
    const r = spectralClass.r * brightness / 255;
    const g = spectralClass.g * brightness / 255;
    const b = spectralClass.b * brightness / 255;
    const rgb = `rgb(${r},${g},${b})`;

    console.log(rgb);

    drawDot(star.x, star.y, rgb, Math.min(Math.max(2 / star.z, 1), 2));
}

function drawDot(x: number, y: number, rgb: string, r: number) {

    // brightness = 255;
    // r = 10;


    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();

    // // brightness = Math.max(brightness, 50);
    // ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
    // ctx.font = "30px Arial";
    // ctx.fillText("" + r + " " + brightness, x, y);
}