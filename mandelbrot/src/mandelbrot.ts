import {Matrix3D} from "./linear-algebra";

export class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

export enum RenderMode {
    CPU,
    WEB_GL,
    CPU_PARALLEL
}

export class MandelbrotParameters {
    screenToComplexTransform: Matrix3D = Matrix3D.identity;

    constructor(
        public iterationDepth: number = 1000,
        public scale: number = 4,
        public theta: number = 0,
        public centre: Complex = new Complex(0, 0),
        public canvasWidth: number = 640,
        public canvasHeight: number = 480,
        public renderMode: RenderMode = RenderMode.CPU
    ) {
        this.refreshScreenToComplexTransformMatrix();
    }

    decreaseIterationDepth() {
        this.iterationDepth -= 100;
    }

    increaseIterationDepth() {
        this.iterationDepth += 100;
    }

    rotateLeft() {
        this.theta += 1/16;
        if (this.theta < 0) {
            this.theta += Math.PI * 2;
        }

        this.refreshScreenToComplexTransformMatrix();
    }

    rotateRight() {
        this.theta -= 1/16;
        if (this.theta >= Math.PI * 2) {
            this.theta -= Math.PI * 2;
        }

        this.refreshScreenToComplexTransformMatrix();
    }

    scrollLeft() {
        this.centre.re -= (1/4) * this.scale;

        this.refreshScreenToComplexTransformMatrix();
    }

    scrollRight() {
        this.centre.re += (1/4) * this.scale;

        this.refreshScreenToComplexTransformMatrix();
    }

    scrollDown() {
        this.centre.im += (1/4) * this.scale;

        this.refreshScreenToComplexTransformMatrix();
    }

    scrollUp() {
        this.centre.im -= (1/4) * this.scale;

        this.refreshScreenToComplexTransformMatrix();
    }

    zoomIn() {
        this.scale /= 1.25;
        this.refreshScreenToComplexTransformMatrix();
    }

    zoomOut() {
        this.scale *= 1.25;
        this.refreshScreenToComplexTransformMatrix();
    }

    private refreshScreenToComplexTransformMatrix(): void {
        this.screenToComplexTransform = Matrix3D.translation(this.centre.re, this.centre.im)
            .transformMatrix(Matrix3D.scale(this.scale / this.canvasWidth ))
            .transformMatrix(Matrix3D.rotation(-this.theta))
            .transformMatrix(Matrix3D.translation(-this.canvasWidth / 2, -this.canvasHeight / 2));
    }

    screenToComplex(x: number, y: number): Complex {
        return new Complex(
            this.screenToComplexTransform.transformX(x, y),
            this.screenToComplexTransform.transformY(x, y)
        );
    }

    zoomInTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.zoomIn();
    }

    zoomOutTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.zoomOut();
    }

    setScale(scale: number) {
        this.scale = scale;
        this.refreshScreenToComplexTransformMatrix();
    }

    setIterationDepth(iterationDepth: number) {
        this.iterationDepth = iterationDepth;
    }

    moveTo(centre: Complex) {
        this.centre = centre;
        this.refreshScreenToComplexTransformMatrix();
    }

    setTheta(theta: number) {
        this.theta = theta;
        this.refreshScreenToComplexTransformMatrix();
    }

    static of(urlSearchParams: URLSearchParams): MandelbrotParameters {
        const params = urlSearchParams;

        const parameters = new MandelbrotParameters();

        params.forEach((value, key) => {
            switch (key) {
                case "iterationDepth":
                    if (value != null) parameters.setIterationDepth(parseFloat(value));
                    break;
                case "scale":
                    if (value != null) parameters.setScale(parseFloat(value));
                    break;
                case "theta":
                    if (value != null) parameters.setTheta(parseFloat(value));
                    break;
                case "real":
                    if (value != null) {
                        const re = parseFloat(value);
                        parameters.moveTo(new Complex(re, parameters.centre.im));
                    }
                    break;
                case "imaginary":
                    if (value != null) {
                        const im = parseFloat(value);
                        parameters.moveTo(new Complex(parameters.centre.re, im));
                    }
                    break;
                case "renderMode":
                    if (value != null) {
                        parameters.renderMode = parseInt(value);
                    }
                    break;
            }
        });

        return parameters;
    }
}

export class RenderResult {
    constructor(public timeToRenderMs: number) {}
}

export interface MandelbrotRenderer {
    draw(parameters: MandelbrotParameters): void;
}
