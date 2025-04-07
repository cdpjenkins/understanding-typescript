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
            if (element.id == idToSelect) {
                element.checked = true;
            } else {
                element.checked = false;
            }
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
