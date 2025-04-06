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
}
export class CanvasComponent extends Component<HTMLCanvasElement> {
    constructor(element: HTMLCanvasElement) {
        super(element);
    }
}
