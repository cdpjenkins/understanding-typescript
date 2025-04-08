import {Complex, MandelbrotParameters, RenderMode, RenderResult} from "./mandelbrot";
import {
    ButtonComponent, CPUCanvasComponent,
    InputComponent,
    MouseButton,
    RadioComponent,
    WebGLCanvasComponent
} from "./components";

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

    return parameters;
}

let onMouseClick = (x: number, y: number, button: MouseButton) => {
    switch (button) {
        case MouseButton.LEFT:
            parameters.zoomInTo(x, y);
            break;
        case MouseButton.RIGHT:
            parameters.zoomOutTo(x, y);
            break;
    }

    parametersUpdated();
};

function onRenderResult(result: RenderResult) {
    return timeToRenderSpan.textContent = `${result.timeToRenderMs.toFixed(2)}ms`;
}

let canvasWebGl = new WebGLCanvasComponent(
    document.getElementById("mandieWebGlCanvas") as HTMLCanvasElement,
    onRenderResult,
    onMouseClick
);

let canvasCPU = new CPUCanvasComponent(
    document.getElementById("mandieCpuCanvas") as HTMLCanvasElement,
    onRenderResult,
    onMouseClick
)

function switchUIToCPURenderer() {
    radioComponent.select("renderType-cpuRadio");
    canvasCPU.show();
    canvasWebGl.hide();
}

function switchUIToWebGLRenderer() {
    radioComponent.select("renderType-webglRadio");
    canvasCPU.hide();
    canvasWebGl.show();
}

const radioComponent = RadioComponent.of(document, ["renderType-cpuRadio", "renderType-webglRadio"],
    (id) => {
        switch (id) {
            case "renderType-cpuRadio":
                parameters.renderMode = RenderMode.CPU;
                parametersUpdated();
                break;
            case "renderType-webglRadio":
                parameters.renderMode = RenderMode.WEB_GL;
                parametersUpdated();
                break;
        }
    });

let iterationDepthTextInput = InputComponent.of(document, "iterationDepth",
    withUpdateParameters1((newIterationDepth) => parameters.setIterationDepth(newIterationDepth)));

let scaleTextInput = InputComponent.of(document, "scale",
    withUpdateParameters1((newScale) => parameters.setScale(newScale)));

let thetaTextInput = InputComponent.of(document, "theta",
    withUpdateParameters1((newTheta) => parameters.setTheta(newTheta)));

let realInput = InputComponent.of(document, "real",
    withUpdateParameters1((newReal) => parameters.moveTo(new Complex(newReal, parameters.centre.im))));

let imaginaryInput = InputComponent.of(document, "imaginary",
    withUpdateParameters1((newImaginary) => parameters.moveTo(new Complex(parameters.centre.re, newImaginary))));

let timeToRenderSpan = <HTMLSpanElement>document.getElementById("timeToRenderSpan");

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

function withUpdateParameters(f: () => void): () => void {
    return () => {
        f();
        parametersUpdated();
    };
}

function withUpdateParameters1<T>(f: (x: T) => void): (x: T) => void {
    return (x: T) => {
        f(x);
        parametersUpdated();
    };
}

ButtonComponent.of(document, "decreaseIterationDepth", withUpdateParameters(() => parameters.decreaseIterationDepth()));
ButtonComponent.of(document, "increaseIterationDepth", withUpdateParameters(() => parameters.increaseIterationDepth()));
ButtonComponent.of(document, "zoomIn", withUpdateParameters(() => parameters.zoomIn()));
ButtonComponent.of(document, "zoomOut", withUpdateParameters(() => parameters.zoomOut()));
ButtonComponent.of(document, "rotateLeft", withUpdateParameters(() => parameters.rotateLeft()));
ButtonComponent.of(document, "rotateRight", withUpdateParameters(() => parameters.rotateRight()));
ButtonComponent.of(document, "scrollDown", withUpdateParameters(() => parameters.scrollDown()));
ButtonComponent.of(document, "scrollLeft", withUpdateParameters(() => parameters.scrollLeft()));
ButtonComponent.of(document, "scrollRight", withUpdateParameters(() => parameters.scrollRight()));
ButtonComponent.of(document, "scrollUp", withUpdateParameters(() => parameters.scrollUp()));
ButtonComponent.of(document, "resetButton", withUpdateParameters(() => resetParameters()));

function drawMandies() {
    window.requestAnimationFrame( (timestamp) => {
        console.log(timestamp);

        switch (parameters.renderMode) {
            case RenderMode.WEB_GL:
                canvasWebGl.draw(parameters);
                break;
            default:
                canvasCPU.draw(parameters);
                break;
        }

        updateUI(parameters);
    });
}

let parameters: MandelbrotParameters =  MandelbrotParameters.of(new URLSearchParams(window.location.search));
parametersUpdated();