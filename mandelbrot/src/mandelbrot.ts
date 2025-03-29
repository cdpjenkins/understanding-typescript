
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
