// Web Worker for Mandelbrot set calculations
// This worker processes a strip of the canvas

// Import Matrix3D class
import { Matrix3D } from './linear-algebra';

// Define interfaces for messages
interface WorkerInput {
    startY: number;
    endY: number;
    width: number;
    iterationDepth: number;
    transformMatrix: {
        m11: number;
        m21: number;
        m31: number;
        m12: number;
        m22: number;
        m32: number;
    };
}

interface WorkerOutput {
    startY: number;
    endY: number;
    width: number;
    pixelData: Uint8ClampedArray;
}

// Import is not available in workers, so we need to redefine the calculation function
function calculateIterations(re: number, im: number, iterationDepth: number): number {
    let zre = 0;
    let zim = 0;

    let zReSquared = 0;
    let zImSquared = 0;

    for (let i = 0; i < iterationDepth; i++) {
        let z2re = zReSquared - zImSquared + re;
        let z2im = 2 * zre * zim + im;

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

// Color calculation function
function colourFor(iterations: number): [number, number, number] {
    const period = 512;
    const lookup: number[][] = [
        [0,   7,   100],
        [32,  107, 203],
        [237, 255, 255],
        [266, 170, 0]
    ];
    const stepsPerColour = period / lookup.length;

    iterations = iterations % period;

    let current: number[];
    let next: number[];

    if (iterations >= stepsPerColour * 3) {
        current = lookup[3];
        next = lookup[0];
    } else if (iterations >= stepsPerColour * 2) {
        current = lookup[2];
        next = lookup[3];
    } else if (iterations >= stepsPerColour) {
        current = lookup[1];
        next = lookup[2];
    } else {
        current = lookup[0];
        next = lookup[1];
    }

    const dr = (next[0] - current[0]) / stepsPerColour;
    const dg = (next[1] - current[1]) / stepsPerColour;
    const db = (next[2] - current[2]) / stepsPerColour;

    const d = iterations % stepsPerColour;

    const r = (current[0] + dr * d) / 256;
    const g = (current[1] + dg * d) / 256;
    const b = (current[2] + db * d) / 256;

    return [r, g, b];
}

// Transform function
function createMatrix3D(matrix: WorkerInput['transformMatrix']): Matrix3D {
    return new Matrix3D(
        matrix.m11, matrix.m21, matrix.m31,
        matrix.m12, matrix.m22, matrix.m32
    );
}

// Process message from main thread
self.onmessage = (e: MessageEvent<WorkerInput>) => {
    const { startY, endY, width, iterationDepth, transformMatrix } = e.data;

    // Calculate the height of this strip
    const height = endY - startY;

    // Create array for pixel data (RGBA for each pixel)
    const pixelData = new Uint8ClampedArray(width * height * 4);

    // Create a Matrix3D instance from the transform matrix
    const matrix3D = createMatrix3D(transformMatrix);

    // Process each pixel in the strip
    let i = 0;
    for (let y = startY; y < endY; y++) {
        for (let x = 0; x < width; x++, i += 4) {
            // Convert screen coordinates to complex plane
            const re = matrix3D.transformX(x, y);
            const im = matrix3D.transformY(x, y);

            // Calculate iterations for this point
            const iterations = calculateIterations(re, im, iterationDepth);

            // Set pixel color based on iterations
            if (iterations === -1) {
                // Point is in the set (black)
                pixelData[i + 0] = 0;
                pixelData[i + 1] = 0;
                pixelData[i + 2] = 0;
                pixelData[i + 3] = 255;
            } else {
                // Point is outside the set (colored based on iterations)
                const [r, g, b] = colourFor(iterations);
                pixelData[i + 0] = r * 255;
                pixelData[i + 1] = g * 255;
                pixelData[i + 2] = b * 255;
                pixelData[i + 3] = 255;
            }
        }
    }

    // Send the processed data back to the main thread
    const result: WorkerOutput = {
        startY,
        endY,
        width,
        pixelData
    };

    self.postMessage(result, { transfer: [result.pixelData.buffer] });
};
