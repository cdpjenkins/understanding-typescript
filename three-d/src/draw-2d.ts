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
    static readonly LIGHT_OFF_GREY = new Colour(200, 200, 230);
    static readonly DARK_OFF_GREY = new Colour(100, 100, 115);
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

export class Line2D extends Shape2D {
    constructor(
        public startPos: Vector2D,
        public endPos: Vector2D,
        z: number,
        public colour: Colour
    ) {
        super(z);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.colour.rgb;
        ctx.beginPath();
        ctx.moveTo(this.startPos.x, this.startPos.y);
        ctx.lineTo(this.endPos.x, this.endPos.y);
        ctx.stroke();
    }
}

export class Triangle2D extends Shape2D {
    constructor(
        public pos1: Vector2D,
        public pos2: Vector2D,
        public pos3: Vector2D,
        z: number,
        public colour: Colour
    ) {
        super(z);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colour.rgb;
        ctx.beginPath();
        ctx.moveTo(this.pos1.x, this.pos1.y);
        ctx.lineTo(this.pos2.x, this.pos2.y);
        ctx.lineTo(this.pos3.x, this.pos3.y);
        ctx.closePath();
        ctx.fill();
    }
}
