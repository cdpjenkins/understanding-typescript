import { MandelbrotWebGLRenderer } from "./mandelbrot-webgl";

let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.onmousedown = (e) => {
    if (e.button == 0) {
        mandie.zoomOutTo(e.x, e.y);
    } else if (e.button == 2) {
        mandie.zoomInTo(e.x, e.y);
    }
};

let iterationDepthTextInput = <HTMLInputElement>document.getElementById("iterationDepth");
let scaleTextInput = <HTMLInputElement>document.getElementById("scale");
let thetaTextInput = <HTMLInputElement>document.getElementById("theta");
let realInput = <HTMLInputElement>document.getElementById("real");
let imaginaryInput = <HTMLInputElement>document.getElementById("imaginary");
let timeToRenderSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");

function setIterationDepth(newIterationDepth: number) {
    mandie.iterationDepth = newIterationDepth;
    drawMandie();
}

function setScale(newScale: number) {
    mandie.scale = newScale;
    drawMandie();
}

function updateUI(mandie: MandelbrotWebGLRenderer) {
    iterationDepthTextInput.value = mandie.iterationDepth.toString();
    scaleTextInput.value = mandie.scale.toString();
    thetaTextInput.value = mandie.theta.toString();
    realInput.value = `${mandie.centre.re.toString()}`;
    imaginaryInput.value = `${mandie.centre.im.toString()}`;
    timeToRenderSpan.textContent = `${mandie.timeToRender.toFixed(2)}ms`;
}

function increaseIterationDepth() {
    mandie.iterationDepth += 100;
    updateUI(mandie);
    drawMandie();
}

function decreaseIterationDepth() {
    mandie.iterationDepth -= 100;
    updateUI(mandie);
    drawMandie();
}

function zoomIn() {
    mandie.zoomIn();
    updateUI(mandie);
    drawMandie();
}

function zoomOut() {
    mandie.zoomOut();
    updateUI(mandie);
    drawMandie();
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
        mandie.centre.re = parseFloat(target.value);

        drawMandie();
    }
}

imaginaryInput.onkeydown = (e) => {
    if (e.key == "Enter") {
        const target = e.target as HTMLInputElement;
        mandie.centre.im = parseFloat(target.value);

        drawMandie();
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
    .addEventListener("click", (_) => mandie.rotateLeft());
(document.getElementById("rotateRight") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.rotateRight());

(document.getElementById("scrollUp") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.scrollDown());
(document.getElementById("scrollLeft") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.scrollLeft());
(document.getElementById("scrollRight") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.scrollRight());
(document.getElementById("scrollDown") as HTMLButtonElement)
    .addEventListener("click", (_) => mandie.scrollUp());

canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let mandie = new MandelbrotWebGLRenderer(canvas, updateUI);

drawMandie();
updateUI(mandie);

function drawMandie() {
    window.requestAnimationFrame( (timestamp) => {
        console.log(timestamp);
        mandie.draw();
        updateUI(mandie);
    });
}

