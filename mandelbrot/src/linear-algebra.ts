export class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}
}

export class Matrix2D {
    constructor(
        private m11: number,
        private m21: number,
        private m12: number,
        private m22: number
    ) {}

    static readonly identity = new Matrix2D(
        1, 0,
        0, 1
    );

    transformX(x: number, y: number) {
        return this.m11 * x + this.m21 * y;
    }

    transformY(x: number, y: number) {
        return this.m12 * x + this.m22 * y;
    }

    transformVector(v: Vector2D) {
        return new Vector2D(this.transformX(v.x, v.y), this.transformY(v.x, v.y));
    }
}
