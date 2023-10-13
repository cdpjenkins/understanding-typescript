export class ColourSupplier {
    static readonly period = 512;
    static readonly lookup: number[][] = [
        [0,   7,   100],
        [32,  107, 203],
        [237, 255, 255],
        [266, 170, 0]
    ];
    static readonly stepsPerColour = this.period / this.lookup.length;

    colourFor(iterations: number) {
        iterations = iterations % ColourSupplier.period;

        let current: number[];
        let next: number[];

        if (iterations >= ColourSupplier.stepsPerColour * 3) {
            current = ColourSupplier.lookup[3];
            next = ColourSupplier.lookup[0];
        } else if (iterations >= ColourSupplier.stepsPerColour * 2) {
            current = ColourSupplier.lookup[2];
            next = ColourSupplier.lookup[3];
        } else if (iterations >= ColourSupplier.stepsPerColour) {
            current = ColourSupplier.lookup[1];
            next = ColourSupplier.lookup[2];
        } else {
            current = ColourSupplier.lookup[0];
            next = ColourSupplier.lookup[1];
        }

        const dr = (next[0] - current[0]) / ColourSupplier.stepsPerColour;
        const dg = (next[1] - current[1]) / ColourSupplier.stepsPerColour;
        const db = (next[2] - current[2]) / ColourSupplier.stepsPerColour;

        const d = iterations % ColourSupplier.stepsPerColour;

        const r = (current[0] + dr * d) / 256;
        const g = (current[1] + dg * d) / 256;
        const b = (current[2] + db * d) / 256;

        return [r, g, b];
    }
}
