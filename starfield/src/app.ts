const numStars = 10000;
const acceleration = 0.5;

class Star {
    static MAX_Z: number = 4;

    constructor(
        private x: number,
        private y: number,
        public z: number,
        public r: number,
        public g: number,
        public b: number,
    ) {}

    draw() {
        const x = this.x / this.z + canvas.width/2;
        const y = this.y / this.z + canvas.height/2;

        const r = this.r / this.z;
        const g = this.g / this.z;
        const b = this.b / this.z;

        const radius = Math.min(
            Math.max(
                4 / this.z,
                1),
            2);

        drawCircle(x, y, `rgb(${r},${g},${b})`, radius);
    }

    update(vx: number, vy: number) {

        this.z -= 0.01;

        if (this.z <= 0) {
            this.z += Star.MAX_Z;
        }
    }

    static makeRandom(): Star {
        const ston = 4;

        const x = ((Math.random() * canvas.width) - canvas.width/2) * ston;
        const y = ((Math.random() * canvas.height) - canvas.height/2) * ston;
        const z = Math.random() * Star.MAX_Z;
        const spectralClass = randomSpectralClass()
        const [r, g, b] = spectralClasses[spectralClass].makeRGB(z);

        return new Star(
            x,
            y,
            z,
            r,
            g,
            b
            );
    }
};

class SpectralClassDetails {
    constructor(
        private readonly r: number,
        private readonly g: number,
        private readonly b: number
    ) {}

    makeRGB(z: number): [number, number, number] {
        const brightness = 1;
        const r = this.r * brightness;
        const g = this.g * brightness;
        const b = this.b * brightness;

        return [r, g, b];
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

var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

var stars = makeStars();
setInterval(tick, 20)

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if ((<any> canvas).webkitRequestFullscreen) {
        /* Safari */
        (<any> canvas).webkitRequestFullscreen();
    } else if ((<any> canvas).msRequestFullscreen) {
        /* IE11 */
        (<any> canvas).msRequestFullscreen();
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
            .map((_v, _i, _a) => Star.makeRandom());

    stars.sort((a, b) => b.z - a.z);

    return stars;
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

function drawCircle(x: number, y: number, rgb: string, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();

    // ctx.fillStyle = "rgb(255, 255, 255)";
    // ctx.fillText(`${rgb}, ${radius}`, x+10, y-10);
}
