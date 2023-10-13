export class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}
}

/**
 * Homogeneous matrix implementing affine transformations in 2D
 */
export class Matrix3D {
    constructor(
        private m11: number,
        private m21: number,
        private m31: number,
        private m12: number,
        private m22: number,
        private m32: number
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
            this.m11 * that.m11 + this.m21 * that.m12 + this.m31,
            this.m11 * that.m21 + this.m21 * that.m22 + this.m31,
            this.m11 * that.m31 + this.m21 * that.m32 + this.m31,
            this.m12 * that.m11 + this.m22 * that.m12 + this.m32,
            this.m12 * that.m21 + this.m22 * that.m22 + this.m32,
            this.m12 * that.m31 + this.m22 * that.m32 + this.m32
        )
    }
}
