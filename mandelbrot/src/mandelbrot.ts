import {Matrix3D} from "./linear-algebra";

export class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

export class MandelbrotParameters {
    geometricTransform: Matrix3D = Matrix3D.identity;

    constructor(
        public iterationDepth: number,
        public scale: number,
        public theta: number,
        public centre: Complex,
        public canvasWidth: number,
        public canvasHeight: number
    ) {
        this.refreshGeometricTransformMatrix();
    }

    rotateLeft() {
        this.theta += 1/16;
        if (this.theta < 0) {
            this.theta += Math.PI * 2;
        }

        this.refreshGeometricTransformMatrix();
    }

    rotateRight() {
        this.theta -= 1/16;
        if (this.theta >= Math.PI * 2) {
            this.theta -= Math.PI * 2;
        }

        this.refreshGeometricTransformMatrix();
    }

    scrollLeft() {
        this.centre.re -= (1/4) * this.scale;

        this.refreshGeometricTransformMatrix();
    }

    scrollRight() {
        this.centre.re += (1/4) * this.scale;

        this.refreshGeometricTransformMatrix();
    }

    scrollDown() {
        this.centre.im -= (1/4) * this.scale;

        this.refreshGeometricTransformMatrix();
    }

    scrollUp() {
        this.centre.im += (1/4) * this.scale;

        this.refreshGeometricTransformMatrix();
    }

    private refreshGeometricTransformMatrix(): void {
        this.geometricTransform = Matrix3D.translation(this.centre.re, this.centre.im)
            .transformMatrix(Matrix3D.scale(this.scale / this.canvasWidth ))
            .transformMatrix(Matrix3D.rotation(-this.theta))
            .transformMatrix(Matrix3D.translation(-this.canvasWidth / 2, -this.canvasHeight / 2));
    }

    screenToComplex(x: number, y: number): Complex {
        return new Complex(
            this.geometricTransform.transformX(x, y),
            this.geometricTransform.transformY(x, y)
        );
    }

    zoomInTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale *= 1.25;

        this.refreshGeometricTransformMatrix();
    }

    zoomOutTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale /= 1.25;

        this.refreshGeometricTransformMatrix();
    }
}

export class RenderResult {
    constructor(
        public timeToRenderMs: number
    ) {}
}

export interface MandelbrotRenderer {
    draw(parameters: MandelbrotParameters): void;
}
