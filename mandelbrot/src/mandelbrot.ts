class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const HUE_PERIOD: number = 360;

    let c = v * s;
    let h1 = (h % HUE_PERIOD) / (HUE_PERIOD / 6);
    let x = c * (1 - Math.abs((h1 % 2) - 1));

    if (h1 < 1) {
        return [c, x, 0];
    } else if (h1 < 2) {
        return [x, c, 0];
    } else if (h1 < 3) {
        return [0, c, x];
    } else if (h1 < 4) {
        return [0, x, c];
    } else if (h1 < 5) {
        return [x, 0, c];
    } else if (h1 < 6) {
        return [c, 0, x];
    } else {
        // this should never be hit but it'll be obvious if we do hit it...
        return [1, 1, 1];
    }
}

class MandelbrotRenderer {
    centre: Complex = new Complex(0, 0);
    scale: number = 0.5;
    iterationDepth: number = 1000;
    timeToRender: number = -1;

    ctx: CanvasRenderingContext2D;
    canvasData: ImageData;

    width: number;
    height: number;

    colourSaturation: number = 0.8;
    colourValue: number = 1;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

        this.width = this.canvasData.width;
        this.height = this.canvasData.height;
    }

    screenXToComplexRe(x: number) {
        return this.centre.re + (x - this.width / 2) / (this.scale * this.width / 2);
    }

    screenYToComplexIm(y: number) {
        return this.centre.im + (y - this.height / 2) / (this.scale * this.height / 2);
    }

    draw() {
        const startTime = performance.now();

        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++, i += 4) {

                let re = this.screenXToComplexRe(x);
                let im = this.screenYToComplexIm(y);

                let iterations = this.mandelbrotIterations(re, im);
                if (iterations == -1) {
                    this.canvasData.data[i + 0] = 0x00;
                    this.canvasData.data[i + 1] = 0x00;
                    this.canvasData.data[i + 2] = 0x00;
                    this.canvasData.data[i + 3] = 0xFF;
                } else {
                    let [r, g, b] = hsvToRgb(iterations, this.colourSaturation, this.colourValue);

                    this.canvasData.data[i + 0] = r * 255;
                    this.canvasData.data[i + 1] = g * 255;
                    this.canvasData.data[i + 2] = b * 255;
                    this.canvasData.data[i + 3] = 0xFF;
                }

            }
        }

        this.ctx.putImageData(this.canvasData, 0, 0);

        const endTime = performance.now();
        this.timeToRender = endTime - startTime;        
    }

    zoomIn() {
        this.scale *= 1.25;
        updateUI(this);
        this.draw();
    }

    zoomOut() {
        this.scale /= 1.25;
        updateUI(this);
        this.draw();
    }

    zoomInTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale *= 1.25;

        updateUI(this);

        this.draw();
    }

    zoomOutTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale /= 1.25;

        updateUI(this);

        this.draw();
    }

    private screenToComplex(x: number, y: number) {
        let re = this.screenXToComplexRe(x);
        let im = this.screenYToComplexIm(y);

        const z = new Complex(re, im);
        return z;
    }

    private mandelbrotIterations(kre: number, kim: number): number {
        let zre = 0;
        let zim = 0;

        for (let i = 0; i < this.iterationDepth; i++) {
            let z2re = zre * zre - zim * zim + kre;
            let z2im = 2 * zre * zim + kim;

            zre = z2re;
            zim = z2im;

            if (magnitudeSquared(zre, zim) >= 4) {
                return i;
            }
        }

        return -1;
    }
}

function magnitudeSquared(re: number, im: number): number {
    return re * re + im * im;
}

let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.onmousedown = (e) => {
    if (e.button == 0) {
        mandie.zoomInTo(e.x, e.y);
    } else if (e.button == 2) {
        mandie.zoomOutTo(e.x, e.y);
    }
};

let iterationDepthTextInput = <HTMLInputElement>document.getElementById("iterationDepth");
let scaleTextInput = <HTMLInputElement>document.getElementById("scale");
let realInput = <HTMLInputElement>document.getElementById("real");
let imaginaryInput = <HTMLInputElement>document.getElementById("imaginary");
let timeToRenderSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");

// TODO - maybe all these set functions could live in the MandelbrotRenderer class
function setIterationDepth(newIterationDepth: number) {
    mandie.iterationDepth = newIterationDepth;
    mandie.draw();
}

function setScale(newScale: number) {
    mandie.scale = newScale;
    mandie.draw();
}

function updateUI(mandie: MandelbrotRenderer) {
    iterationDepthTextInput.value = mandie.iterationDepth.toString();
    scaleTextInput.value = mandie.scale.toString();
    realInput.value = `${mandie.centre.re.toString()}`;
    imaginaryInput.value = `${mandie.centre.im.toString()}`;
    timeToRenderSpan.textContent = `${mandie.timeToRender.toFixed(2)}ms`;
}

function increaseIterationDepth() {
    mandie.iterationDepth += 100;
    updateUI(mandie);
    mandie.draw();
}

function decreaseIterationDepth() {
    mandie.iterationDepth -= 100;
    updateUI(mandie);
    mandie.draw();
}

function zoomIn() {
    mandie.zoomIn();
    updateUI(mandie);
    mandie.draw();
}

function zoomOut() {
    mandie.zoomOut();
    updateUI(mandie);
    mandie.draw();
}

iterationDepthTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const iterationDepthString = target.value
        const newIterationDepth = parseInt(iterationDepthString);

        setIterationDepth(newIterationDepth)
    }
}

scaleTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const scaleString = target.value
        const newScale = parseFloat(scaleString);

        setScale(newScale)
    }
}

realInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        mandie.centre.re = parseFloat(target.value);

        mandie.draw();
    }
}

imaginaryInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        mandie.centre.im = parseFloat(target.value);

        mandie.draw();
    }
}

canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let ctx = canvas.getContext("2d")!;
let mandie = new MandelbrotRenderer(ctx);

mandie.draw();
updateUI(mandie);

