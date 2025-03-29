import { Matrix3D } from "./linear-algebra";
import { ColourSupplier } from "./colour";
import {Complex, MandelbrotParameters, MandelbrotRenderer} from "./mandelbrot";

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

export class MandelbrotCPURenderer implements MandelbrotRenderer {
    timeToRender: number = -1;
    geometricTransform: Matrix3D = Matrix3D.identity;

    ctx: CanvasRenderingContext2D;
    updateUI: (mandie: MandelbrotParameters) => void;
    canvasData: ImageData;

    width: number;
    height: number;

    colourSaturation: number = 0.8;
    colourValue: number = 1;

    colourSupplier: ColourSupplier = new ColourSupplier();

    constructor(ctx: CanvasRenderingContext2D, updateUI: (mandie: MandelbrotParameters) => void, public parameters: MandelbrotParameters) {
        this.ctx = ctx;
        this.updateUI = updateUI;
        this.canvasData = this.ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.width = this.canvasData.width;
        this.height = this.canvasData.height;
    }

    setParameters(parameters: MandelbrotParameters): void {
        this.parameters = parameters
    }

    getParameters(): MandelbrotParameters {
        return new MandelbrotParameters(this.parameters.iterationDepth, this.parameters.scale, this.parameters.theta, this.parameters.centre, this.parameters.scale);
    }

    screenToComplex(x: number, y: number): Complex {
        return new Complex(
            this.geometricTransform.transformX(x, y),
            this.geometricTransform.transformY(x, y)
        );
    }

    screenYToComplexIm(y: number) {
        return this.parameters.centre.im + (y - this.height / 2) / (this.parameters.scale * this.height / 2);
    }

    refreshGeometricTransformMatrix() {
        this.geometricTransform = Matrix3D.translation(this.parameters.centre.re, this.parameters.centre.im)
            .transformMatrix(Matrix3D.scale(this.parameters.scale / this.width ))
            .transformMatrix(Matrix3D.rotation(-this.parameters.theta))
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
        this.parameters.centre.re -= this.parameters.scale * (1/16);
        // this.updateUI(this);
        this.draw();
    }

    scrollRight() {
        this.parameters.centre.re += this.parameters.scale * (1/16);
        // updateUI(this);
        this.draw();
    }

    scrollDown() {
        this.parameters.centre.im += this.parameters.scale * (1/16);
        // updateUI(this);
        this.draw();
    }

    scrollUp() {
        this.parameters.centre.im -= this.parameters.scale * (1/16);
        // updateUI(this);
        this.draw();
    }

    rotateLeft() {
        this.parameters.theta -= 1/16;
        if (this.parameters.theta < 0) {
            this.parameters.theta += Math.PI * 2;
        }
        // updateUI(this);
        this.draw();
    }

    rotateRight() {
        this.parameters.theta += 1/16;
        if (this.parameters.theta >= Math.PI * 2) {
            this.parameters.theta -= Math.PI * 2;
        }
        // updateUI(this);
        this.draw();
    }

    zoomIn() {
        this.parameters.scale /= 1.25;
        // updateUI(this);
        this.draw();
    }

    zoomOut() {
        this.parameters.scale *= 1.25;
        this.draw();
    }

    zoomInTo(x: number, y: number) {
        this.parameters.centre = this.screenToComplex(x, y);
        this.parameters.scale /= 1.25;

        this.draw();
    }

    zoomOutTo(x: number, y: number) {
        this.parameters.centre = this.screenToComplex(x, y);
        this.parameters.scale *= 1.25;

        this.draw();
    }

    private mandelbrotIterations(kre: number, kim: number): number {
        let zre = 0;
        let zim = 0;

        let zReSquared = 0;
        let zImSquared = 0;

        for (let i = 0; i < this.parameters.iterationDepth; i++) {
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

