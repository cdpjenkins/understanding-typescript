import {MandelbrotWebGLRenderer} from "./mandelbrot-webgl";
import {MandelbrotCPURenderer} from "./mandelbrot-cpu";
import {Complex, MandelbrotParameters, RenderMode} from "./mandelbrot";
import { InputComponent } from "./components";

// Although this file is called main.ts right now, its main responsibility is handling the UI.
// a) Maybe UI stuff should be split out into another file with that specific responsibility
// b) Maybe we should just use React or Vue or something...

let parameters: MandelbrotParameters = new MandelbrotParameters(
    1000,
    4,
    0,
    new Complex(0, 0),
    640,
    480,
    RenderMode.CPU
);

function resetParameters() {
    parameters = new MandelbrotParameters(
        1000,
        4,
        0,
        new Complex(0, 0),
        640,
        480,
        RenderMode.CPU
    );
    parametersUpdated();

    return parameters;
}

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
        parameters.zoomInTo(x, y);
        parametersUpdated();
    } else if (e.button == 2) {
        parameters.zoomOutTo(x, y);
        parametersUpdated();
    }
};

function switchUIToCPURenderer() {
    cpuRadio.checked = true;
    webglRadio.checked = false;
    canvasCpu.style.display = "";
    canvasWebGl.style.display = "none";
}

function switchUIToWebGLRenderer() {
    cpuRadio.checked = false;
    webglRadio.checked = true;
    canvasCpu.style.display = "none";
    canvasWebGl.style.display = "";
}

let cpuRadio = <HTMLInputElement>document.getElementById("renderType-cpuRadio");
cpuRadio.onchange = () => {
    parameters.renderMode = RenderMode.CPU;
    parametersUpdated();
};

let webglRadio = <HTMLInputElement>document.getElementById("renderType-webglRadio");
webglRadio.onchange = () => {
    parameters.renderMode = RenderMode.WEB_GL;
    parametersUpdated();
};

let iterationDepthTextInput = InputComponent.of(document, "iterationDepth",
    (newIterationDepth) => {
        parameters.setIterationDepth(newIterationDepth);
        parametersUpdated();
    });

let scaleTextInput = InputComponent.of(document, "scale",
    (newScale) => {
        parameters.setScale(newScale);
        parametersUpdated();
    });

let thetaTextInput = InputComponent.of(document, "theta",
    (newTheta) => {
        parameters.setTheta(newTheta);
        parametersUpdated();
    });

let realInput = InputComponent.of(document, "real",
    (newReal) => {
        parameters.moveTo(new Complex(newReal, parameters.centre.im));
        parametersUpdated();
    });

let imaginaryInput = InputComponent.of(document, "imaginary",
    (newImaginary) => {
        parameters.moveTo(new Complex(parameters.centre.re, newImaginary));
        parametersUpdated();
    });

let timeToRenderOnWebGLSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");
let timeToRenderOnCPUSpan = <HTMLSpanElement>document.getElementById("timeToRenderOnCPUSpan");

function updateUI(parameters: MandelbrotParameters) {
    iterationDepthTextInput.setValue(parameters.iterationDepth);
    scaleTextInput.setValue(parameters.scale);
    thetaTextInput.setValue(parameters.theta);
    realInput.setValue(parameters.centre.re);
    imaginaryInput.setValue(parameters.centre.im);

    switch (parameters.renderMode) {
        case RenderMode.CPU:
            switchUIToCPURenderer();
            break;
        case RenderMode.WEB_GL:
            switchUIToWebGLRenderer();
            break;
    }
}

function parametersUpdated() {
    let url = new URL(window.location.href);

    url.searchParams.set("iterationDepth", parameters.iterationDepth.toString());
    url.searchParams.set("scale", parameters.scale.toString());
    url.searchParams.set("theta", parameters.theta.toString());
    url.searchParams.set("real", parameters.centre.re.toString());
    url.searchParams.set("imaginary", parameters.centre.im.toString());
    url.searchParams.set("renderMode", parameters.renderMode.toString());
    window.history.pushState({}, '', url);

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


const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
resetButton.addEventListener("click", (_) => resetParameters());

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

// TODO move me into an onload method
// which, incidentally, is where loads more startup stuff should go
const params = new URLSearchParams(window.location.search);
params.forEach((value, key) => {
    switch (key) {
        case "iterationDepth":
            if (value != null) parameters.setIterationDepth(parseFloat(value));
            break;
        case "scale":
            if (value != null) parameters.setScale(parseFloat(value));
            break;
        case "theta":
            if (value != null) parameters.setTheta(parseFloat(value));
            break;
        case "real":
            if (value != null) {
                const re = parseFloat(value);
                parameters.moveTo(new Complex(re, parameters.centre.im));
            }
            break;
        case "imaginary":
            if (value != null) {
                const im = parseFloat(value);
                    parameters.moveTo(new Complex(parameters.centre.re, im));
            }
            break;
        case "renderMode":
            if (value != null) {
                parameters.renderMode = parseInt(value);
            }
            break;
    }
});

parametersUpdated();

function drawMandies() {
    window.requestAnimationFrame( (timestamp) => {
        console.log(timestamp);

        if (webglRadio.checked) {
            mandieWebGl.draw(parameters);
        } else {
            mandieCpu.draw(parameters);
        }

        updateUI(parameters);
    });
}
