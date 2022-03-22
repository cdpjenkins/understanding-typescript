const numStars = 4000;
const acceleration = 0.5;

type Star = {
    x: number,
    y: number,
    z: number,
    spectralClass: SpectralClass,
    rgb: string,
    radius: number
};

type SpectralClassDetails = {
    r: number,
    g: number,
    b: number,
    colour: string
};

type SpectralClass =  "O" | "B" | "A" | "F" | "G" | "K" | "M" ;

const spectralClasses = {
    "O": {
        r: 0xa0,
        g: 0xd0,
        b: 0xff,
        colour: "#abd0ff"
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
        colour: "#dcd7ff"
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
        colour: "#fff4fa"
    },
    "K": {
        r: 0xff,
        g: 0xe2,
        b: 0xc1,
        colour: "#ffd2a1"
    },
    "M": {
        r: 0xff,
        g: 0xec,
        b: 0xaf,
        colour: "#ffcc6f"
    },
}

let vx = -30;
let vy = 1;

let keysDown = new Map<string, boolean>();

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown.set(e.key, true);
}, false);
document.addEventListener('keyup', function(e) {
    keysDown.set(e.key, false);
}, false);

var ctx = canvas.getContext("2d")!;

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
    if (keysDown.get('a')) {
        vx += acceleration;
    }
    if (keysDown.get('w')) {
        vy += acceleration;
    }
    if (keysDown.get('d')) {
        vx -= acceleration;
    }
    if (keysDown.get('s')) {
        vy -= acceleration;
    }

    for (const star of stars) {
        star.x = (star.x + vx / (star.z * 10));
        star.y = (star.y + vy / (star.z * 10));
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
    let stars: Star[] = [];

    stars = Array(numStars).fill(0).map((_v, _i, _a) => makeRandomStar());

    stars.sort((a, b) => b.z - a.z);

    return stars;
}

function makeRandomStar(): Star {
    const spectralClass = randomSpectralClass()
    const z = Math.random() * 15 + 4
    const star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: z,
        spectralClass: spectralClass,
        rgb: rgbForStar(spectralClass, z),
        radius: radiusForStar(z)
    }

    return star;
}

function randomSpectralClass(): SpectralClass {
    let keys = Object.keys(spectralClasses)
    const randomElement = keys[Math.floor(Math.random() * keys.length)];

    return randomElement as SpectralClass;
}

function drawStars() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, _index, _array) => drawStar(star));
}

function drawStar(star: Star) {
    drawCircle(star.x, star.y, star.rgb, star.radius);
}

function radiusForStar(z: number) {
    return Math.min(Math.max(10 / z, 1), 10);
}

function rgbForStar(spectralClass: SpectralClass, z: number) {
    const spectralClassDetails = spectralClasses[spectralClass]

    const brightness = Math.min(Math.max(10 / z, 0.0001), 1);
    const r = spectralClassDetails.r * brightness;
    const g = spectralClassDetails.g * brightness;
    const b = spectralClassDetails.b * brightness;

    return `rgb(${r},${g},${b})`;
}

function drawCircle(x: number, y: number, rgb: string, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();

    // ctx.fillStyle = "rgb(255, 255, 255)";
    // ctx.fillText(`${rgb}, ${r}`, x, y);
}
