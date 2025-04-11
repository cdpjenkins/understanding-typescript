import { ColourSupplier } from "./colour";
import { MandelbrotParameters, MandelbrotRenderer, RenderResult } from "./mandelbrot";
import { MandelbrotService } from "./mandelbrot-service";

export class MandelbrotCPURenderer implements MandelbrotRenderer {
    ctx: CanvasRenderingContext2D;
    canvasData: ImageData;
    colourSupplier: ColourSupplier = new ColourSupplier();

    constructor(canvasElement: HTMLCanvasElement,
                public renderResultCallback: (result: RenderResult) => void
    ) {
        this.ctx = canvasElement.getContext("2d")!;
        this.canvasData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw(parameters: MandelbrotParameters): void {
        const startTime = performance.now();

        let i = 0;
        for (let y = 0; y < parameters.canvasHeight; y++) {
            for (let x = 0; x < parameters.canvasWidth; x++, i += 4) {
                const re = parameters.screenToComplexTransform.transformX(x, y);
                const im = parameters.screenToComplexTransform.transformY(x, y);

                let iterations = MandelbrotService.calculateIterations(re, im, parameters.iterationDepth);
                if (iterations == -1) {
                    this.canvasData.data[i + 0] = 0x00;
                    this.canvasData.data[i + 1] = 0x00;
                    this.canvasData.data[i + 2] = 0x00;
                    this.canvasData.data[i + 3] = 0xFF;
                } else {
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
        let timeToRender = endTime - startTime;

        this.renderResultCallback(new RenderResult(timeToRender));
    }

}
