import { MandelbrotWebGLRenderer } from "./mandelbrot-webgl";
import { MandelbrotCPURenderer } from "./mandelbrot-cpu";
import {Complex, MandelbrotParameters} from "./mandelbrot";

let parameters: MandelbrotParameters = new MandelbrotParameters(
    1000,
    4,
    0,
    new Complex(0, 0),
    -1,
    640,
    480
);

let canvasWebGl = document.getElementById("mandieWebGlCanvas") as HTMLCanvasElement;
canvasWebGl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieWebGl = new MandelbrotWebGLRenderer(canvasWebGl, updateUI, parameters);
canvasWebGl.onmousedown = (e) => {
    if (e.button == 0) {
        mandieWebGl.zoomOutTo(e.x, e.y);
    } else if (e.button == 2) {
        mandieWebGl.zoomInTo(e.x, e.y);
    }
};

let canvasCpu = document.getElementById("mandieCpuCanvas") as HTMLCanvasElement;
canvasCpu.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieCpu = new MandelbrotCPURenderer(canvasCpu.getContext("2d")!, parameters);
canvasCpu.onmousedown = (e) => {
    if (e.button == 0) {
        mandieCpu.zoomOutTo(e.x, e.y);
    } else if (e.button == 2) {
        mandieCpu.zoomInTo(e.x, e.y);
    }
};

let iterationDepthTextInput = <HTMLInputElement>document.getElementById("iterationDepth");
let scaleTextInput = <HTMLInputElement>document.getElementById("scale");
let thetaTextInput = <HTMLInputElement>document.getElementById("theta");
let realInput = <HTMLInputElement>document.getElementById("real");
let imaginaryInput = <HTMLInputElement>document.getElementById("imaginary");
// let timeToRenderSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");

function setIterationDepth(newIterationDepth: number) {
    parameters.iterationDepth = newIterationDepth;
    parametersUpdated();
}

function setScale(newScale: number) {
    parameters.scale = newScale;
    parametersUpdated();
}

function updateUI(mandie: MandelbrotParameters) {
    iterationDepthTextInput.value = mandie.iterationDepth.toString();
    scaleTextInput.value = mandie.scale.toString();
    thetaTextInput.value = mandie.theta.toString();
    realInput.value = `${mandie.centre.re.toString()}`;
    imaginaryInput.value = `${mandie.centre.im.toString()}`;
    // timeToRenderSpan.textContent = `${mandie.timeToRender.toFixed(2)}ms`;
}

function parametersUpdated() {
    mandieWebGl.setParameters(parameters);
    mandieCpu.setParameters(parameters);

    updateUI(parameters);
    drawMandies();
}

function increaseIterationDepth() {
    parameters.iterationDepth += 100;
    parametersUpdated();
}

function decreaseIterationDepth() {
    parameters.iterationDepth -= 100;
    parametersUpdated();
}

function zoomIn() {
    parameters.scale /= 1.25;
    parametersUpdated();
}

function zoomOut() {
    parameters.scale *= 1.25;
    parametersUpdated();
}

iterationDepthTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const iterationDepthString = target.value
        const newIterationDepth = parseInt(iterationDepthString);

        setIterationDepth(newIterationDepth)
    }
}

scaleTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const scaleString = target.value
        const newScale = parseFloat(scaleString);

        setScale(newScale)
    }
}

realInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        parameters.centre.re = parseFloat(target.value);

        parametersUpdated();
    }
}

imaginaryInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        mandieWebGl.parameters.centre.im = parseFloat(target.value);

        parametersUpdated();
    }
}

(document.getElementById("decreaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => decreaseIterationDepth());
(document.getElementById("increaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => increaseIterationDepth());

(document.getElementById("zoomIn") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomOut());
(document.getElementById("zoomOut") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomIn());

function rotateLeft() {
    parameters.rotateLeft();
    parametersUpdated();
}


function rotateRight() {
    parameters.rotateRight();
    parametersUpdated();
}

(document.getElementById("rotateLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => rotateLeft());
(document.getElementById("rotateRight") as HTMLButtonElement)
    .addEventListener("click", (_) => rotateRight());

function scrollDown() {
    parameters.scrollDown();
    parametersUpdated();
}

function scrollLeft() {
    parameters.scrollLeft();
    parametersUpdated();
}

function scrollRight() {
    parameters.scrollRight();
    parametersUpdated();
}
function scrollUp() {
    parameters.scrollUp();
    parametersUpdated();
}

(document.getElementById("scrollUp") as HTMLButtonElement)
    .addEventListener("click", (_) => scrollDown());


(document.getElementById("scrollLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => scrollLeft());

(document.getElementById("scrollRight") as HTMLButtonElement)
    .addEventListener("click", (_) => scrollRight());


(document.getElementById("scrollDown") as HTMLButtonElement)
    .addEventListener("click", (_) => scrollUp());


parametersUpdated();

function drawMandies() {
    window.requestAnimationFrame( (timestamp) => {
        console.log(timestamp);
        mandieWebGl.draw();
        console.log("WebGL:")
        console.log(mandieWebGl.getParameters());

        mandieCpu.draw();
        console.log("CPU:")
        console.log(mandieCpu.getParameters());

        updateUI(mandieWebGl.getParameters());
    });
}
