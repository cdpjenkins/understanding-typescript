import { Matrix3D } from "./linear-algebra";
import { ColourSupplier } from "./colour";

class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

// @ts-ignore
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
    scale: number = 4;
    theta: number = 0;
    iterationDepth: number = 1000;
    timeToRender: number = -1;
    geometricTransform: Matrix3D = Matrix3D.identity;

    ctx: CanvasRenderingContext2D;
    canvasData: ImageData;

    width: number;
    height: number;

    colourSaturation: number = 0.8;
    colourValue: number = 1;

    colourSupplier: ColourSupplier = new ColourSupplier();

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

        this.width = this.canvasData.width;
        this.height = this.canvasData.height;
    }

    screenToComplex(x: number, y: number): Complex {
        return new Complex(
            this.geometricTransform.transformX(x, y),
            this.geometricTransform.transformY(x, y)
        );
    }

    screenYToComplexIm(y: number) {
        return this.centre.im + (y - this.height / 2) / (this.scale * this.height / 2);
    }

    refreshGeometricTransformMatrix() {
        this.geometricTransform = Matrix3D.translation(this.centre.re, this.centre.im)
                    .transformMatrix(Matrix3D.scale(this.scale / this.width ))
                    .transformMatrix(Matrix3D.rotation(-this.theta))
                    .transformMatrix(Matrix3D.translation(-this.width / 2, -this.height / 2));
    }

    draw() {
        const startTime = performance.now();

        this.refreshGeometricTransformMatrix();

        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++, i += 4) {
                const re = this.geometricTransform.transformX(x, y);
                const im = this.geometricTransform.transformY(x, y);

                let iterations = this.mandelbrotIterations(re, im);
                if (iterations == -1) {
                    this.canvasData.data[i + 0] = 0x00;
                    this.canvasData.data[i + 1] = 0x00;
                    this.canvasData.data[i + 2] = 0x00;
                    this.canvasData.data[i + 3] = 0xFF;
                } else {
                    // let [r, g, b] = hsvToRgb(iterations, this.colourSaturation, this.colourValue);
                    let [r, g, b] = this.colourSupplier.colourFor(iterations);

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

    scrollLeft() {
        this.centre.re -= this.scale * (1/16);
        updateUI(this);
        this.draw();
    }

    scrollRight() {
        this.centre.re += this.scale * (1/16);
        updateUI(this);
        this.draw();
    }

    scrollDown() {
        this.centre.im += this.scale * (1/16);
        updateUI(this);
        this.draw();
    }

    scrollUp() {
        this.centre.im -= this.scale * (1/16);
        updateUI(this);
        this.draw();
    }
    
    rotateLeft() {
        this.theta -= 1/16;
        if (this.theta < 0) {
            this.theta += Math.PI * 2;
        }
        updateUI(this);
        this.draw();
    }

    rotateRight() {
        this.theta += 1/16;
        if (this.theta >= Math.PI * 2) {
            this.theta -= Math.PI * 2;
        }
        updateUI(this);
        this.draw();
    }

    zoomIn() {
        this.scale /= 1.25;
        updateUI(this);
        this.draw();
    }

    zoomOut() {
        this.scale *= 1.25;
        updateUI(this);
        this.draw();
    }

    zoomInTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale /= 1.25;

        updateUI(this);

        this.draw();
    }

    zoomOutTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale *= 1.25;

        updateUI(this);

        this.draw();
    }

    private mandelbrotIterations(kre: number, kim: number): number {
        let zre = 0;
        let zim = 0;

        let zReSquared = 0;
        let zImSquared = 0;

        for (let i = 0; i < this.iterationDepth; i++) {
            let z2re = zReSquared - zImSquared + kre;
            let z2im = 2 * zre * zim + kim;

            zre = z2re;
            zim = z2im;

            zReSquared = zre * zre;
            zImSquared = zim * zim;

            if (zReSquared + zImSquared >= 4) {
                return i;
            }
        }

        return -1;
    }
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
let thetaTextInput = <HTMLInputElement>document.getElementById("theta");
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
    thetaTextInput.value = mandie.theta.toString();
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

// @ts-ignore
function zoomIn() {
    mandie.zoomIn();
    updateUI(mandie);
    mandie.draw();
}

// @ts-ignore
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

(document.getElementById("decreaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => decreaseIterationDepth());
(document.getElementById("increaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => increaseIterationDepth());

(document.getElementById("zoomIn") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomIn());
(document.getElementById("zoomOut") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomOut());


(document.getElementById("rotateLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.rotateLeft());
(document.getElementById("rotateRight") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.rotateRight());

(document.getElementById("scrollUp") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.scrollUp());
(document.getElementById("scrollLeft") as HTMLButtonElement)
.addEventListener("click", (_) => mandie.scrollLeft());
(document.getElementById("scrollRight") as HTMLButtonElement)
.addEventListener("click", (_) => mandie.scrollRight());
(document.getElementById("scrollDown") as HTMLButtonElement)
.addEventListener("click", (_) => mandie.scrollDown());



// <td><button onclick="zoomIn();">Zoom in</button></td>
// <td><button onclick="zoomOut();">Zoom out</button></td>

canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let ctx = canvas.getContext("2d")!;
let mandie = new MandelbrotRenderer(ctx);

mandie.draw();
updateUI(mandie);

