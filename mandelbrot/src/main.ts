import { MandelbrotWebGLRenderer } from "./mandelbrot-webgl";
import { MandelbrotCPURenderer } from "./mandelbrot-cpu";
import {MandelbrotParameters} from "./mandelbrot";

let canvasWebGl = document.getElementById("mandieWebGlCanvas") as HTMLCanvasElement;
canvasWebGl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieWebGl = new MandelbrotWebGLRenderer(canvasWebGl, updateUI);
canvasWebGl.onmousedown = (e) => {
    if (e.button == 0) {
        mandieWebGl.zoomOutTo(e.x, e.y);
    } else if (e.button == 2) {
        mandieWebGl.zoomInTo(e.x, e.y);
    }
};

let canvasCpu = document.getElementById("mandieCpuCanvas") as HTMLCanvasElement;
canvasCpu.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandieCpu = new MandelbrotCPURenderer(canvasCpu.getContext("2d")!, updateUI);
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
    mandieWebGl.parameters.iterationDepth = newIterationDepth;
    drawMandies();
}

function setScale(newScale: number) {
    mandieWebGl.parameters.scale = newScale;
    drawMandies();
}



function updateUI(mandie: MandelbrotParameters) {
    iterationDepthTextInput.value = mandie.iterationDepth.toString();
    scaleTextInput.value = mandie.scale.toString();
    thetaTextInput.value = mandie.theta.toString();
    realInput.value = `${mandie.centre.re.toString()}`;
    imaginaryInput.value = `${mandie.centre.im.toString()}`;
    // timeToRenderSpan.textContent = `${mandie.timeToRender.toFixed(2)}ms`;
}

function increaseIterationDepth() {
    mandieWebGl.parameters.iterationDepth += 100;
    updateUI(mandieWebGl.getParameters());
    drawMandies();
}

function decreaseIterationDepth() {
    mandieWebGl.parameters.iterationDepth -= 100;
    updateUI(mandieWebGl.getParameters());
    drawMandies();
}

function zoomIn() {
    mandieWebGl.zoomIn();
    updateUI(mandieWebGl.getParameters());
    drawMandies();
}

function zoomOut() {
    mandieWebGl.zoomOut();
    updateUI(mandieWebGl.getParameters());
    drawMandies();
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
        mandieWebGl.parameters.centre.re = parseFloat(target.value);

        drawMandies();
    }
}

imaginaryInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        mandieWebGl.parameters.centre.im = parseFloat(target.value);

        drawMandies();
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

(document.getElementById("rotateLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.rotateLeft());
(document.getElementById("rotateRight") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.rotateRight());

(document.getElementById("scrollUp") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.scrollDown());
(document.getElementById("scrollLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.scrollLeft());
(document.getElementById("scrollRight") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.scrollRight());
(document.getElementById("scrollDown") as HTMLButtonElement)
    .addEventListener("click", (_) => mandieWebGl.scrollUp());


drawMandies();
updateUI(mandieWebGl.getParameters());

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
