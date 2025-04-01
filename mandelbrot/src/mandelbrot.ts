import {Matrix3D} from "./linear-algebra";

export class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

export class MandelbrotParameters {
    screenToComplexTransform: Matrix3D = Matrix3D.identity;

    constructor(
        public iterationDepth: number,
        public scale: number,
        public theta: number,
        public centre: Complex,
        public canvasWidth: number,
        public canvasHeight: number
    ) {
        this.refreshScreenToComplexTransformMatrix();
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
        this.centre.im -= (1/4) * this.scale;

        this.refreshScreenToComplexTransformMatrix();
    }

    scrollUp() {
        this.centre.im += (1/4) * this.scale;

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
}

export class RenderResult {
    constructor(public timeToRenderMs: number) {}
}

export interface MandelbrotRenderer {
    draw(parameters: MandelbrotParameters): void;
}
