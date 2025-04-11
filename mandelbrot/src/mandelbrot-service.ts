// import { Complex } from "./mandelbrot";

/**
 * Service class for Mandelbrot set calculations.
 * This class provides methods for calculating Mandelbrot set iterations
 * that can be shared between different renderers.
 */
export class MandelbrotService {
    /**
     * Calculates the number of iterations before the point escapes the Mandelbrot set.
     * 
     * @param re - Real part of the complex number
     * @param im - Imaginary part of the complex number
     * @param iterationDepth - Maximum number of iterations to perform
     * @returns The number of iterations before the point escapes, or -1 if it doesn't escape
     */
    public static calculateIterations(re: number, im: number, iterationDepth: number): number {
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

    /**
     * Gets the GLSL shader code for Mandelbrot set calculation.
     * This can be used by WebGL renderers to perform the calculation on the GPU.
     * 
     * @param maxIterations - Maximum number of iterations to perform in the shader
     * @returns GLSL shader code for Mandelbrot set calculation
     */
    public static getShaderCode(maxIterations: number = 10000): string {
        return `
            // Mandelbrot set calculation
            vec2 z = vec2(0.0);
            int i = 0;
            
            for(int j = 0; j < ${maxIterations}; j++) {
                z = vec2(
                    z.x * z.x - z.y * z.y + c.x,
                    2.0 * z.x * z.y + c.y
                );
                if(dot(z, z) > 4.0) {
                    i = j;
                    break;
                }
                i = j;
            }
        `;
    }
}