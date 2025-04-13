import { MandelbrotParameters, MandelbrotRenderer, RenderResult } from "./mandelbrot";

/**
 * Mandelbrot renderer that uses Web Workers for parallel computation.
 * This renderer divides the canvas into horizontal strips and processes each strip in a separate worker.
 */
export class MandelbrotCPUParallelRenderer implements MandelbrotRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvasData: ImageData;
    private workers: Worker[] = [];
    private pendingWorkers: number = 0;
    private startTime: number = 0;

    // Number of workers to use (typically equal to the number of CPU cores)
    private readonly numWorkers: number = navigator.hardwareConcurrency || 4;

    constructor(
        canvasElement: HTMLCanvasElement,
        private renderResultCallback: (result: RenderResult) => void
    ) {
        this.ctx = canvasElement.getContext("2d")!;
        this.canvasData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Initialize workers
        this.initializeWorkers();
    }

    /**
     * Initialize the Web Workers pool
     */
    private initializeWorkers(): void {
        // Terminate any existing workers
        this.terminateWorkers();

        // Create new workers
        for (let i = 0; i < this.numWorkers; i++) {
            const worker = new Worker(new URL('./mandelbrot-worker.ts', import.meta.url), { type: 'module' });

            worker.onmessage = (e) => this.handleWorkerMessage(e.data);

            this.workers.push(worker);
        }
    }

    /**
     * Terminate all workers
     */
    private terminateWorkers(): void {
        for (const worker of this.workers) {
            worker.terminate();
        }
        this.workers = [];
    }

    /**
     * Handle messages from workers
     */
    private handleWorkerMessage(data: {
        startY: number;
        endY: number;
        width: number;
        pixelData: Uint8ClampedArray;
    }): void {
        const { startY, endY, width, pixelData } = data;

        // Copy the worker's pixel data to the canvas data
        const height = endY - startY;
        let srcIndex = 0;
        let destIndex = startY * width * 4;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width * 4; x++, srcIndex++, destIndex++) {
                this.canvasData.data[destIndex] = pixelData[srcIndex];
            }
        }

        // Decrement the pending workers count
        this.pendingWorkers--;

        // If all workers have completed, update the canvas and report the result
        if (this.pendingWorkers === 0) {
            this.ctx.putImageData(this.canvasData, 0, 0);

            const endTime = performance.now();
            const timeToRender = endTime - this.startTime;

            this.renderResultCallback(new RenderResult(timeToRender));
        }
    }

    /**
     * Draw the Mandelbrot set using parallel computation
     */
    draw(parameters: MandelbrotParameters): void {
        // Record the start time
        this.startTime = performance.now();

        // Get canvas dimensions
        const width = parameters.canvasWidth;
        const height = parameters.canvasHeight;

        // Calculate the height of each strip
        const stripHeight = Math.ceil(height / this.numWorkers);

        // Reset the pending workers count
        this.pendingWorkers = this.numWorkers;

        // Distribute work to workers
        for (let i = 0; i < this.numWorkers; i++) {
            const startY = i * stripHeight;
            const endY = Math.min(startY + stripHeight, height);

            // Skip if this strip is outside the canvas
            if (startY >= height) {
                this.pendingWorkers--;
                continue;
            }

            // Prepare the data to send to the worker
            const workerData = {
                startY,
                endY,
                width,
                iterationDepth: parameters.iterationDepth,
                // We can't directly pass a Matrix3D instance to a worker because Web Workers can only receive
                // data that can be serialized using the structured clone algorithm, which doesn't preserve class instances.
                // Instead, we pass a plain object with the same properties, and the worker creates a Matrix3D instance from it.
                transformMatrix: {
                    m11: parameters.screenToComplexTransform.m11,
                    m21: parameters.screenToComplexTransform.m21,
                    m31: parameters.screenToComplexTransform.m31,
                    m12: parameters.screenToComplexTransform.m12,
                    m22: parameters.screenToComplexTransform.m22,
                    m32: parameters.screenToComplexTransform.m32
                }
            };

            // Send the data to the worker
            this.workers[i].postMessage(workerData);
        }

        // If no workers were started (unlikely), report completion immediately
        if (this.pendingWorkers === 0) {
            const endTime = performance.now();
            const timeToRender = endTime - this.startTime;

            this.renderResultCallback(new RenderResult(timeToRender));
        }
    }
}
