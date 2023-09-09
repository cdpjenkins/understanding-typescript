const numStars = 10000;
const acceleration = 0.5;

class Matrix2D {
    constructor(public m11: number, public m21: number,
                public m12: number, public m22: number) {}

    transformVector(x: number, y: number) {
        return [matrix.m11 * x + matrix.m21 * y,
                matrix.m12 * x + matrix.m22 * y];
    }
}

let theta: number = 0;
let matrix = new Matrix2D(1, 0, 0, 1);

class Star {
    static MAX_Z: number = 10;

    view_x: number = 0;
    view_y: number = 0;

    constructor(
        private x: number,
        private y: number,
        public z: number,
        public r: number,
        public g: number,
        public b: number,
        public screen_x: number,
        public screen_y: number
    ) {
        this.transform_world_to_view();
        this.project_view_to_screen();
    }

    draw() {
        const r = this.r / this.z;
        const g = this.g / this.z;
        const b = this.b / this.z;

        const radius = Math.min(
            Math.max(
                4 / this.z,
                1),
            2);

        drawCircle(this.screen_x + canvas.width/2, this.screen_y + canvas.height/2, `rgb(${r},${g},${b})`, radius);
    }

    transform_world_to_view() {
        [this.view_x,this.view_y] = matrix.transformVector(this.x, this.y);
    }

    project_view_to_screen() {
        this.screen_x = this.view_x / this.z;
        this.screen_y = this.view_y / this.z;
    }

    isVisible(): boolean {
        return this.screen_x * this.screen_x + this.screen_y * this.screen_y < canvas.width * canvas.width / 4;
    }

    update() {
        this.z -= 0.01;

        this.transform_world_to_view();
        this.project_view_to_screen();

        if (!this.isVisible) {
            this.z += Star.MAX_Z;
        }

        if (this.z <= 0) {
            this.z += Star.MAX_Z;
        }
    }

    static makeRandom(): Star {
        const ston = 8;

        const x = ((Math.random() * canvas.width) - canvas.width/2) * ston;
        const y = ((Math.random() * canvas.height) - canvas.height/2) * ston;
        const z = Math.random() * Star.MAX_Z;
        const spectralClass = randomSpectralClass()
        const [r, g, b] = spectralClasses[spectralClass].makeRGB();

        const star = new Star(
            x,
            y,
            z,
            r,
            g,
            b,
            -1,
            -1);

        star.transform_world_to_view();
        star.project_view_to_screen();

        return star;
    }
};

class SpectralClassDetails {
    constructor(
        private readonly r: number,
        private readonly g: number,
        private readonly b: number
    ) {}

    makeRGB(): [number, number, number] {
        const brightness = Math.random();
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
    let startTime = performance.now();

    handleKeys();
    theta += 1/512;
    matrix = new Matrix2D(Math.cos(theta), - Math.sin(theta),
                            Math.sin(theta), Math.cos(theta));

    if (theta >= 2 * Math.PI) theta -= 2 * Math.PI;
    updateStars();
    draw();

    let endTime = performance.now();
    // console.log(`tick took ${endTime - startTime}ms`)
}

function updateStars() {
    for (const star of stars) {
        star.update();
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
            .map((_v, _i, _a) => Star.makeRandom())
            .filter((star) => star.isVisible());


    console.log(`${stars.length} stars`);

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
}
