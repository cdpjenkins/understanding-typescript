//
// Linear algebra stuff here
//

// 4D vector using homogenous coordinates
//
// Homogenous coordinates enable all sorts of cleverness but we're likely to use it in two ways:
//
// w == 1 => a position vector that is affected by both rotations and translations
// w == 0 => a direction vector that is affected by rotations but not by translations
export class Vector4D {
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number = 1
    ) {}

    static readonly ZERO: Vector4D = new Vector4D(0, 0, 0);

    static position(x: number, y: number, z: number) {
        return new Vector4D(x, y, z, 1);
    }

    static direction(x: number, y: number, z: number) {
        return new Vector4D(x, y, z, 0);
    }

    translate(that: Vector4D): Vector4D {
        return new Vector4D(
            this.x + that.x,
            this.y + that.y,
            this.z + that.z
        );
    }

    minus(that: Vector4D): Vector4D {
        return new Vector4D(
            this.x - that.x,
            this.y - that.y,
            this.z - that.z,
            this.w - that.w
        )
    }

    times(factor: number): Vector4D {
        return new Vector4D(this.x * factor, this.y * factor, this.z * factor, this.w);
    }

    negate(): Vector4D {
        return new Vector4D(-this.x, -this.y, -this.z);
    }

    normalise(): Vector4D {
        const magnitude = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        const magnitudeReciprocal = 1 / magnitude;

        return this.times(magnitudeReciprocal);
    }
}

export class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}

    translate(that: Vector2D): Vector2D {
        return new Vector2D(this.x + that.x, this.y + that.y);
    }

    static readonly ZERO: Vector2D = new Vector2D(0, 0);
}

// 
// Homogeneous coords matrix
//
// The matrix is 4x3 because the fourth term of the vector is assumed to always be 1 and
// we still use Vector3D for that reason.
export class Matrix4x3 {
    constructor(
        public m11: number, public m21: number, public m31: number, public m41: number,
        public m12: number, public m22: number, public m32: number, public m42: number,
        public m13: number, public m23: number, public m33: number, public m43: number
    ) {}

    static IDENTITY: Matrix4x3 = new Matrix4x3(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0
    );

    static translation(vector: Vector4D): Matrix4x3 {
        return new Matrix4x3(
            1, 0, 0, vector.x,
            0, 1, 0, vector.y,
            0, 0, 1, vector.z
        );
    }

    get zVector(): Vector4D {
        return new Vector4D(this.m13, this.m23, this.m33, this.m43);
    }

    get xVector(): Vector4D {
        return new Vector4D(this.m11, this.m21, this.m31, this.m41);
    }

    static geometricTransformRotationAroundYAxis(theta: number) {
        return new Matrix4x3(
            Math.cos(theta),   0,   -Math.sin(theta),  0,
            0,                 1,   0,                 0,
            Math.sin(theta),   0,   Math.cos(theta),   0
        );
    }

    static coordinateTransformRotationAroundYAxis(theta: number) {
        return new Matrix4x3(
            Math.cos(theta),    0,   Math.sin(theta),  0,
            0,                  1,   0,                0,
            -Math.sin(theta),   0,   Math.cos(theta),  0
        );
    }

    transformVector(v: Vector4D): Vector4D {
        return new Vector4D(
            this.m11 * v.x + this.m21 * v.y + this.m31 * v.z + this.m41 * v.w,
            this.m12 * v.x + this.m22 * v.y + this.m32 * v.z + this.m42 * v.w,
            this.m13 * v.x + this.m23 * v.y + this.m33 * v.z + this.m43 * v.w,
            v.w            
        )
    }

    transformMatrix(that: Matrix4x3): Matrix4x3 {
        return new Matrix4x3(
            this.m11 * that.m11 + this.m21 * that.m12 + this.m31 * that.m13,
            this.m11 * that.m21 + this.m21 * that.m22 + this.m31 * that.m23,
            this.m11 * that.m31 + this.m21 * that.m32 + this.m31 * that.m33,
            this.m11 * that.m41 + this.m21 * that.m42 + this.m31 * that.m43 + this.m41,

            this.m12 * that.m11 + this.m22 * that.m12 + this.m32 * that.m13,
            this.m12 * that.m21 + this.m22 * that.m22 + this.m32 * that.m23,
            this.m12 * that.m31 + this.m22 * that.m32 + this.m32 * that.m33,
            this.m12 * that.m41 + this.m22 * that.m42 + this.m32 * that.m43 + this.m42,

            this.m13 * that.m11 + this.m23 * that.m12 + this.m33 * that.m13,
            this.m13 * that.m21 + this.m23 * that.m22 + this.m33 * that.m23,
            this.m13 * that.m31 + this.m23 * that.m32 + this.m33 * that.m33,
            this.m13 * that.m41 + this.m23 * that.m42 + this.m33 * that.m43 + this.m43
        );
    }
}
