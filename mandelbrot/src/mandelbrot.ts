
export class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

export class MandelbrotParameters {
    constructor(
        public iterationDepth: number,
        public scale: number,
        public theta: number,
        public centre: Complex,
        public timeToRenderSpan: number
    ) {}

    rotateLeft() {
        this.theta -= 1/16;
        if (this.theta < 0) {
            this.theta += Math.PI * 2;
        }
    }

    rotateRight() {
        this.theta += 1/16;
        if (this.theta >= Math.PI * 2) {
            this.theta -= Math.PI * 2;
        }
    }

    scrollLeft() {
        this.centre.re -= (1/4) / this.scale;
    }

    scrollRight() {
        this.centre.re += (1/4) / this.scale;
    }

    scrollDown() {
        this.centre.im += (1/4) / this.scale;
    }

    scrollUp() {
        this.centre.im -= (1/4) / this.scale;
    }
}

export class RenderResult {
    constructor(
        public timeToRenderSpan: number
    ) {}
}

export interface MandelbrotRenderer {
    getParameters(): MandelbrotParameters;
    setParameters(parameters: MandelbrotParameters): void;
    draw(): void;
}
