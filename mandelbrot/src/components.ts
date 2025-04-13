import {MandelbrotWebGLRenderer} from "./mandelbrot-webgl";
import {MandelbrotParameters, MandelbrotRenderer, RenderResult} from "./mandelbrot";
import {MandelbrotCPURenderer} from "./mandelbrot-cpu";
import {MandelbrotCPUParallelRenderer} from "./mandelbrot-cpu-parallel";

export enum MouseButton {
    LEFT = 0,
    RIGHT = 2,
    UNKNOWN = -1
}

export abstract class Component<T extends HTMLElement> {
    constructor(protected element: T) {}

    public getElement(): T {
        return this.element;
    }
}

export class ButtonComponent extends Component<HTMLButtonElement> {
    constructor(element: HTMLButtonElement, onClick: () => void) {
        super(element);
        this.element.addEventListener('click', onClick);
    }

    static of(document: Document,
                id: string,
                onClick: () => void): ButtonComponent {
        return new ButtonComponent(document.getElementById(id) as HTMLButtonElement, onClick);
    }
}

export abstract class CanvasComponent extends Component<HTMLCanvasElement> {
    constructor(element: HTMLCanvasElement,
                private mandie: MandelbrotRenderer,
                private onMouseClick: (x: number, y: number, button: MouseButton) => void) {
        super(element);

        element.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };

        element.onmousedown = (e) => {
            const rect = element.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            var button: MouseButton
            if (e.button == 0) {
                button = MouseButton.LEFT;
            } else if (e.button == 2) {
                button = MouseButton.RIGHT;
            } else {
                button = MouseButton.UNKNOWN;
            }

            this.onMouseClick(x, y, button);
        }
    }

    public show() {
        this.element.style.display = "";
    }

    public hide() {
        this.element.style.display = "none";
    }

    public draw(parameters: MandelbrotParameters) {
        this.mandie.draw(parameters);
    }
}

export class WebGLCanvasComponent extends CanvasComponent {
    constructor(element: HTMLCanvasElement,
                onRenderResult: (result: RenderResult) => void,
                onMouseClick: (x: number, y: number, button: MouseButton) => void) {
        super(element, new MandelbrotWebGLRenderer(element, onRenderResult), onMouseClick);
    }
}

export class CPUCanvasComponent extends CanvasComponent {
    constructor(element: HTMLCanvasElement, onRenderResult: (result: RenderResult) => void,
                onMouseClick: (x: number, y: number, button: MouseButton) => void) {
        super(element, new MandelbrotCPURenderer(element, onRenderResult), onMouseClick);
    }
}

export class CPUParallelCanvasComponent extends CanvasComponent {
    constructor(element: HTMLCanvasElement, onRenderResult: (result: RenderResult) => void,
                onMouseClick: (x: number, y: number, button: MouseButton) => void) {
        super(element, new MandelbrotCPUParallelRenderer(element, onRenderResult), onMouseClick);
    }
}

export class InputComponent extends Component<HTMLInputElement> {
    constructor(element: HTMLInputElement,
                public onEnter: (input: number) => any) {
        super(element);
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                const newValueString = target.value
                const newValue = parseFloat(newValueString);

                this.onEnter(newValue);
            }
        });
    }

    setValue(value: number) {
        this.element.value = value.toString();
    }

    static of(document: Document,
                id: string,
                onEnter: (input: number) => any): InputComponent {
        return new InputComponent(document.getElementById(id) as HTMLInputElement, onEnter);
    }
}

export class RadioComponent extends Component<HTMLInputElement> {
    constructor(private elements: Map<string, HTMLInputElement>) {
        super(elements.get("renderType-cpuRadio") as HTMLInputElement);
    }

    select(idToSelect: string) {
        this.elements.forEach((element) => {
            element.checked = element.id == idToSelect;
        });
    }

    static of(document: Document,
                ids: string[],
                onSelected: (id: string) => void): RadioComponent {
        let elements = ids.map(id => document.getElementById(id) as HTMLInputElement);

        elements.forEach(element => {
            element.onchange = (_) => {
                onSelected(element.id);
            };
        });

        const elementsMap = new Map(elements.map((element) => [element.id, element]));

        return new RadioComponent(elementsMap);
    }
}
