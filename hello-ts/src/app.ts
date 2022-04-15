const numStars = 4000;
const acceleration = 0.5;

class Star {
    constructor(
        private  x: number,
        private y: number,
        public readonly z: number,       // this is only needed for comparison... need to find out the idiomatic way to do this in JS/TS
        private readonly rgb: string,
        private readonly radius: number
    ) {}

    draw() {
        drawCircle(this.x, this.y, this.rgb, this.radius);
    }

    update(vx: number, vy: number) {
        this.x = (this.x + vx / (this.z * 10));
        this.y = (this.y + vy / (this.z * 10));
        if (this.x < 0) {
            this.x += canvas.width;
        }
        if (this.x >= canvas.width) {
            this.x -= canvas.width;
        }
        if (this.y < 0) {
            this.y += canvas.height;
        }
        if (this.y >= canvas.height) {
            this.y -= canvas.height;
        }
    }
};

class SpectralClassDetails {
    constructor(
        private readonly r: number,
        private readonly g: number,
        private readonly b: number
    ) {}

    rgbString(z: number) {
        const brightness = Math.min(Math.max(10 / z, 0.0001), 1);
        const r = this.r * brightness;
        const g = this.g * brightness;
        const b = this.b * brightness;

        return `rgb(${r},${g},${b})`;
    }
};

type SpectralClass =  "O" | "B" | "A" | "F" | "G" | "K" | "M" ;

const spectralClasses = {
    "O": new SpectralClassDetails(0xa0, 0xd0, 0xff),
    "B": new SpectralClassDetails(0xaa, 0xbf, 0xff),
    "A": new SpectralClassDetails(0xca, 0xd7, 0xff),
    "F": new SpectralClassDetails(0xf8, 0xf7, 0xff),
    "G": new SpectralClassDetails(0xff, 0xf4, 0xea),
    "K": new SpectralClassDetails(0xff, 0xe2, 0xc1),
    "M": new SpectralClassDetails(0xff, 0xec, 0xaf),
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
    handleKeys();
    updateStars();
    draw();
}

function updateStars() {
    for (const star of stars) {
        star.update(vx, vy);
    }
}

function handleKeys() {
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
}

function makeStars() {
    let stars: Star[] =
        Array(numStars)
            .fill(0)
            .map((_v, _i, _a) => makeRandomStar());

    stars.sort((a, b) => b.z - a.z);

    return stars;
}

function makeRandomStar(): Star {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const z = Math.random() * 60 + 2
    const spectralClass = randomSpectralClass()
    const rgb = spectralClasses[spectralClass].rgbString(z);
    const radius = radiusForStar(z);

    return new Star(
        x,
        y,
        z,
        rgb,
        radius
    );
}

function randomSpectralClass(): SpectralClass {
    let keys = Object.keys(spectralClasses)
    const randomElement = keys[Math.floor(Math.random() * keys.length)];

    return randomElement as SpectralClass;
}

function clear() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();

    for (const star of stars) {
        star.draw();
    }
}

function radiusForStar(z: number) {
    return Math.min(Math.max(10 / z, 1), 2);
}

function drawCircle(x: number, y: number, rgb: string, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();

    // ctx.fillStyle = "rgb(255, 255, 255)";
    // ctx.fillText(`${rgb}, ${radius}`, x+10, y-10);
}
