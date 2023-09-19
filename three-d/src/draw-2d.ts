//
// 2D drawing primitives
//

import { Vector2D } from "./linear-algebra";

export class Colour {
    constructor(
        public red: number,
        public green: number,
        public blue: number
        // what about alpha???
    ) {}

    static readonly WHITE = new Colour(255, 255, 255);
    static readonly RED = new Colour(255, 0, 0);

    rgb: string = `rgb(${this.red}, ${this.green}, ${this.blue})`;

    times(scalar: number) {
        return new Colour(this.red * scalar, this.green * scalar, this.blue * scalar);
    }
}

export abstract class Shape2D {
    abstract draw(ctx: CanvasRenderingContext2D): void;

    constructor(
        public z: number
    ) {}
}

export class Circle extends Shape2D {
    constructor(
        public centrePos: Vector2D,
        z: number,
        public radius: number,
        public colour: Colour
    ) {
        super(z);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.centrePos.x, this.centrePos.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.colour.rgb;

        ctx.fill();
    }
}
