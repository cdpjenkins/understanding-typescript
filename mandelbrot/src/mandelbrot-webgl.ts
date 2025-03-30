import {MandelbrotParameters, MandelbrotRenderer, RenderResult} from "./mandelbrot";

class MandelbrotWebGLRenderer implements MandelbrotRenderer {
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private positionBuffer: WebGLBuffer | null = null;
    private positionAttributeLocation: number = -1;
    private resolutionUniformLocation: WebGLUniformLocation | null = null;
    private centerUniformLocation: WebGLUniformLocation | null = null;
    private scaleUniformLocation: WebGLUniformLocation | null = null;
    private thetaUniformLocation: WebGLUniformLocation | null = null;
    private iterationDepthUniformLocation: WebGLUniformLocation | null = null;

    timeToRender: number = -1;

    width: number;
    height: number;

    constructor(canvas: HTMLCanvasElement,
                public renderResultCallback: (result: RenderResult) => void
    ) {
        this.gl = canvas.getContext('webgl2')!;
        this.width = canvas.width;
        this.height = canvas.height;

        this.initWebGL();
    }

    private initWebGL() {
        // Vertex shader source
        const vertexShaderSource = `#version 300 es
            in vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Fragment shader source
        const fragmentShaderSource = `#version 300 es
            precision highp float;
            precision highp int;
            out vec4 fragColor;

            uniform vec2 u_resolution;
            uniform vec2 u_center;
            uniform float u_scale;
            uniform float u_theta;
            uniform int u_iterationDepth;

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / (u_resolution.y / u_scale);
                
                // Apply rotation
                float cos_theta = cos(u_theta);
                float sin_theta = sin(u_theta);
                vec2 rotated_uv = vec2(
                    uv.x * cos_theta - uv.y * sin_theta,
                    uv.x * sin_theta + uv.y * cos_theta
                );
                
                vec2 c = u_center + rotated_uv;
                vec2 z = vec2(0.0);
                int i = 0;
                
                for(int j = 0; j < 10000; j++) {
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
                
                if(i >= u_iterationDepth - 1) {
                    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
                } else {
                    float hue = float(i) / float(u_iterationDepth);
                    vec3 hsv = vec3(hue, 0.8, 1.0);
                    vec3 rgb = hsv2rgb(hsv);
                    fragColor = vec4(rgb, 1.0);
                }
            }
        `;

        // Create and compile shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        // Create program
        this.program = this.gl.createProgram();
        if (!this.program) return;

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        // Get attribute and uniform locations
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.centerUniformLocation = this.gl.getUniformLocation(this.program, 'u_center');
        this.scaleUniformLocation = this.gl.getUniformLocation(this.program, 'u_scale');
        this.thetaUniformLocation = this.gl.getUniformLocation(this.program, 'u_theta');
        this.iterationDepthUniformLocation = this.gl.getUniformLocation(this.program, 'u_iterationDepth');

        // Create position buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]), this.gl.STATIC_DRAW);
    }

    private createShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type);
        if (!shader) return null;

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    draw(parameters: MandelbrotParameters): void {
        const startTime = performance.now();

        if (!this.program) return;

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        // Set uniforms
        this.gl.uniform2f(this.resolutionUniformLocation!, this.width, this.height);
        this.gl.uniform2f(this.centerUniformLocation!, parameters.centre.re, -parameters.centre.im);
        this.gl.uniform1f(this.scaleUniformLocation!, parameters.scale);
        this.gl.uniform1f(this.thetaUniformLocation!, parameters.theta);
        this.gl.uniform1i(this.iterationDepthUniformLocation!, parameters.iterationDepth);

        // Set position attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        const endTime = performance.now();
        this.timeToRender = endTime - startTime;

        this.renderResultCallback(new RenderResult(this.timeToRender));
    }
}

export { MandelbrotWebGLRenderer }; 