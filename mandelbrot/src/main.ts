import {MandelbrotWebGLRenderer} from "./mandelbrot-webgl";
import {MandelbrotCPURenderer} from "./mandelbrot-cpu";
import {Complex, MandelbrotParameters} from "./mandelbrot";

// Although this file is called main.ts right now, its main responsibility is handling the UI.
// a) Maybe UI stuff should be split out into another file with that specific responsibility
// b) Maybe we should just use React or Vue or something...

let parameters: MandelbrotParameters = new MandelbrotParameters(
    1000,
    4,
    0,
    new Complex(0, 0),
    640,
    480
);

let canvasWebGl = document.getElementById("mandieWebGlCanvas") as HTMLCanvasElement;
canvasWebGl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieWebGl =
    new MandelbrotWebGLRenderer(canvasWebGl, (result => timeToRenderOnWebGLSpan.textContent = `${result.timeToRenderMs.toFixed(2)}ms`));
canvasWebGl.onmousedown = (e) => {
    const rect = canvasWebGl.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (e.button == 0) {
        parameters.zoomInTo(x, y);
        parametersUpdated();
    } else if (e.button == 2) {
        parameters.zoomOutTo(x, y);
        parametersUpdated();
    }
};

let canvasCpu = document.getElementById("mandieCpuCanvas") as HTMLCanvasElement;
canvasCpu.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieCpu =
    new MandelbrotCPURenderer(canvasCpu.getContext("2d")!, (result => timeToRenderOnCPUSpan.textContent = `${result.timeToRenderMs.toFixed(2)}ms`));
canvasCpu.onmousedown = (e) => {
    const rect = canvasCpu.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (e.button == 0) {
        parameters.zoomOutTo(x, y);
        parametersUpdated();
    } else if (e.button == 2) {
        parameters.zoomInTo(x, y);
        parametersUpdated();
    }
};

let iterationDepthTextInput = <HTMLInputElement>document.getElementById("iterationDepth");
let scaleTextInput = <HTMLInputElement>document.getElementById("scale");
let thetaTextInput = <HTMLInputElement>document.getElementById("theta");
let realInput = <HTMLInputElement>document.getElementById("real");
let imaginaryInput = <HTMLInputElement>document.getElementById("imaginary");
let timeToRenderOnWebGLSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");
let timeToRenderOnCPUSpan = <HTMLSpanElement>document.getElementById("timeToRenderOnCPUSpan");

function updateUI(mandie: MandelbrotParameters) {
    iterationDepthTextInput.value = mandie.iterationDepth.toString();
    scaleTextInput.value = mandie.scale.toString();
    thetaTextInput.value = mandie.theta.toString();
    realInput.value = `${mandie.centre.re.toString()}`;
    imaginaryInput.value = `${mandie.centre.im.toString()}`;
}

function parametersUpdated() {
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
    parameters.zoomIn();
    parametersUpdated();
}

function zoomOut() {
    parameters.zoomOut();
    parametersUpdated();
}

iterationDepthTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const iterationDepthString = target.value
        const newIterationDepth = parseInt(iterationDepthString);

        parameters.setIterationDepth(newIterationDepth);
        parametersUpdated();
    }
}

scaleTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        const scaleString = target.value
        const newScale = parseFloat(scaleString);

        parameters.setScale(newScale);
        parametersUpdated();
    }
}

thetaTextInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        let theta = parseFloat(target.value);
        parameters.setTheta(theta);
        parametersUpdated();
    }
}

realInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        let re = parseFloat(target.value);
        parameters.moveTo(new Complex(re, parameters.centre.im));
        parametersUpdated();
    }
}

imaginaryInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        let im = parseFloat(target.value);
        parameters.moveTo(new Complex(parameters.centre.re, im));
        parametersUpdated();
    }
}

(document.getElementById("decreaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => decreaseIterationDepth());
(document.getElementById("increaseIterationDepth") as HTMLButtonElement)
    .addEventListener("click", (_) => increaseIterationDepth());

(document.getElementById("zoomIn") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomIn());
(document.getElementById("zoomOut") as HTMLButtonElement)
    .addEventListener("click", (_) => zoomOut());

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
        mandieWebGl.draw(parameters);
        mandieCpu.draw(parameters);

        updateUI(parameters);
    });
}
