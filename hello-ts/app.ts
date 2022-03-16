const numStars = 10000;

type SpectralClassDetails = {
    r: number,
    g: number,
    b: number,
    colour: string
};

type SpectralClass =  "O" | "B" | "A" | "F" | "G" | "K" | "M" ;

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
        const spectralClass = randomSpectralClass()
        const z = Math.random() * 10 + 0.5
        const star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: z,
            spectralClass: spectralClass,
            rgb: rgbForStar(spectralClasses[spectralClass], z),
            radius: radiusForStar(z)
        }
        stars.push(star);
    }

    stars.sort((a, b) => b.z - a.z);

    return stars;
}

function randomSpectralClass(): SpectralClass {
    let keys = Object.keys(spectralClasses)
    const randomElement = keys[Math.floor(Math.random() * keys.length)];

    return randomElement as SpectralClass;
}

function drawStars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(function(value, _index, _array) {
        drawStar(ctx, value);
    });
}

function drawStar(ctx: CanvasRenderingContext2D, star) {
    drawDot(star.x, star.y, star.rgb, star.radius);
}

function radiusForStar(z) {
    return Math.min(Math.max(2 / z, 1), 20);
}

function rgbForStar(spectralClass, z: number) {
    const brightness = Math.min(Math.max(1 / (z), 0.001), 1);
    const r = spectralClass.r * brightness;
    const g = spectralClass.g * brightness;
    const b = spectralClass.b * brightness;

    return `rgb(${r},${g},${b})`;
}

function drawDot(x: number, y: number, rgb: string, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();

    // const brightness = "#FFFFFF";
    // ctx.fillStyle = brightness;
    // ctx.font = "30px Arial";
    // ctx.fillText(`${rgb} ${r}`, x, y);
}
