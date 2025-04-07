export class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}
}

/**
 * Homogeneous matrix implementing affine transformations in 2D.
 * 
 * Note we don't bother with the bottom row, all elements of which we assume are always going to be 0, 0, 1.
 */
export class Matrix3D {
    constructor(
        public m11: number,
        public m21: number,
        public m31: number,
        public m12: number,
        public m22: number,
        public m32: number
    ) {}

    static readonly identity = new Matrix3D(
        1, 0, 0,
        0, 1, 0
    );

    static rotation(theta: number): Matrix3D {
        return new Matrix3D(
            Math.cos(theta), -Math.sin(theta), 0,
            Math.sin(theta), Math.cos(theta), 0
        );
    }

    static translation(dx: number, dy: number): Matrix3D {
        return new Matrix3D(
            1, 0, dx,
            0, 1, dy
        );
    }

    static scale(factor: number) {
        return new Matrix3D(
            factor, 0, 0,
            0, factor, 0
        );
    }

    transformX(x: number, y: number) {
        return this.m11 * x + this.m21 * y  + this.m31;
    }

    transformY(x: number, y: number) {
        return this.m12 * x + this.m22 * y + this.m32;
    }

    transformVector(v: Vector2D) {
        return new Vector2D(this.transformX(v.x, v.y), this.transformY(v.x, v.y));
    }

    transformMatrix(that: Matrix3D): Matrix3D {
        return new Matrix3D(
            this.m11 * that.m11 + this.m21 * that.m12,
            this.m11 * that.m21 + this.m21 * that.m22,
            this.m11 * that.m31 + this.m21 * that.m32 + this.m31,
            this.m12 * that.m11 + this.m22 * that.m12,
            this.m12 * that.m21 + this.m22 * that.m22,
            this.m12 * that.m31 + this.m22 * that.m32 + this.m32
        )
    }

    printOut() {
        console.log(`${this.m11} ${this.m21} ${this.m31}`);
        console.log(`${this.m12} ${this.m22} ${this.m32}`);
    }
}
