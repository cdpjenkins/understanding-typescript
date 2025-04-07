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

    setValue(value: string) {
        this.element.value = value;
    }

    static of(document: Document,
                id: string,
                onEnter: (input: number) => any): InputComponent {
        return new InputComponent(document.getElementById(id) as HTMLInputElement, onEnter);
    }
}
