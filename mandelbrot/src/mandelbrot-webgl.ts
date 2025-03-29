import {MandelbrotParameters, MandelbrotRenderer} from "./mandelbrot";

class Complex {
    constructor(
        public re: number,
        public im: number
    ) {
    }
}

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

    parameters: MandelbrotParameters = new MandelbrotParameters(
        1000,
        4,
        0,
        new Complex(0, 0),
        -1
    );

    width: number;
    height: number;
    private updateUICallback: (renderer: MandelbrotParameters) => void;

    constructor(canvas: HTMLCanvasElement, updateUICallback: (renderer: MandelbrotParameters) => void) {
        this.gl = canvas.getContext('webgl2')!;
        this.width = canvas.width;
        this.height = canvas.height;
        this.updateUICallback = updateUICallback;

        this.initWebGL();
    }

    setParameters(parameters: MandelbrotParameters): void {
        this.parameters = parameters;
    }
    getParameters(): MandelbrotParameters {
        return this.parameters;
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
                vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / (u_resolution.y * u_scale);
                
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

    draw() {
        const startTime = performance.now();

        if (!this.program) return;

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        // Set uniforms
        this.gl.uniform2f(this.resolutionUniformLocation!, this.width, this.height);
        this.gl.uniform2f(this.centerUniformLocation!, this.parameters.centre.re, this.parameters.centre.im);
        this.gl.uniform1f(this.scaleUniformLocation!, this.parameters.scale);
        this.gl.uniform1f(this.thetaUniformLocation!, this.parameters.theta);
        this.gl.uniform1i(this.iterationDepthUniformLocation!, this.parameters.iterationDepth);

        // Set position attribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        const endTime = performance.now();
        this.timeToRender = endTime - startTime;
    }

    // Navigation methods
    scrollLeft() {
        this.parameters.centre.re -= (1/4) / this.parameters.scale;
        this.draw();
        this.updateUI();
    }

    scrollRight() {
        this.parameters.centre.re += (1/4) / this.parameters.scale;
        this.draw();
        this.updateUI();
    }

    scrollDown() {
        this.parameters.centre.im += (1/4) / this.parameters.scale;
        this.draw();
        this.updateUI();
    }

    scrollUp() {
        this.parameters.centre.im -= (1/4) / this.parameters.scale;
        this.draw();
        this.updateUI();
    }
    
    rotateLeft() {
        this.parameters.theta -= 1/16;
        if (this.parameters.theta < 0) {
            this.parameters.theta += Math.PI * 2;
        }
        this.draw();
        this.updateUI();
    }

    rotateRight() {
        this.parameters.theta += 1/16;
        if (this.parameters.theta >= Math.PI * 2) {
            this.parameters.theta -= Math.PI * 2;
        }
        this.draw();
        this.updateUI();
    }

    zoomIn() {
        this.parameters.scale /= 1.25;
        this.draw();
        this.updateUI();
    }

    zoomOut() {
        this.parameters.scale *= 1.25;
        this.draw();
        this.updateUI();
    }

    zoomInTo(x: number, y: number) {
        const screenToComplex = (x: number, y: number): Complex => {
            // Convert screen coordinates to complex plane coordinates
            // Flip y coordinate since canvas has y increasing downward
            const uv = [
                (x - this.width / 2) / (this.height * this.parameters.scale),
                -(y - this.height / 2) / (this.height * this.parameters.scale)
            ];
            
            // Apply rotation
            const cos_theta = Math.cos(this.parameters.theta);
            const sin_theta = Math.sin(this.parameters.theta);
            
            return new Complex(
                this.parameters.centre.re + uv[0] * cos_theta - uv[1] * sin_theta,
                this.parameters.centre.im + uv[0] * sin_theta + uv[1] * cos_theta
            );
        };

        this.parameters.centre = screenToComplex(x, y);
        this.parameters.scale /= 1.25;
        this.draw();
        this.updateUI();
    }

    zoomOutTo(x: number, y: number) {
        const screenToComplex = (x: number, y: number): Complex => {
            // Convert screen coordinates to complex plane coordinates
            // Flip y coordinate since canvas has y increasing downward
            const uv = [
                (x - this.width / 2) / (this.height * this.parameters.scale),
                -(y - this.height / 2) / (this.height * this.parameters.scale)
            ];
            
            // Apply rotation
            const cos_theta = Math.cos(this.parameters.theta);
            const sin_theta = Math.sin(this.parameters.theta);
            
            return new Complex(
                this.parameters.centre.re + uv[0] * cos_theta - uv[1] * sin_theta,
                this.parameters.centre.im + uv[0] * sin_theta + uv[1] * cos_theta
            );
        };

        this.parameters.centre = screenToComplex(x, y);
        this.parameters.scale *= 1.25;
        this.draw();
        this.updateUI();
    }

    private updateUI() {
        this.updateUICallback(this.getParameters());
    }
}

export { MandelbrotWebGLRenderer }; 