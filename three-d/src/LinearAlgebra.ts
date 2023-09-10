//
// Linear algebra stuff here
//

// TODO learn how multiple source files / modules / whatever work so we don't have to have everything in
// the same source file.
class Vector3D {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}

    static ZERO: Vector3D = new Vector3D(0, 0, 0);

    translate(that: Vector3D): Vector3D {
        return new Vector3D(
            this.x + that.x,
            this.y + that.y,
            this.z + that.z
        );
    }

    minus(that: Vector3D): Vector3D {
        return new Vector3D(
            this.x - that.x,
            this.y - that.y,
            this.z - that.z
        )
    }

    times(factor: number): Vector3D {
        return new Vector3D(this.x * factor, this.y * factor, this.z * factor);
    }
}

class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}

    translate(that: Vector2D): Vector2D {
        return new Vector2D(this.x + that.x, this.y + that.y);
    }
}

class Matrix3D {
    constructor(
        public m11: number, public m21: number, public m31: number,
        public m12: number, public m22: number, public m32: number,
        public m13: number, public m23: number, public m33: number
    ) {}

    static IDENTITY: Matrix3D = new Matrix3D(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    );

    static geometricTransformRotationAroundYAxis(theta: number) {
        return new Matrix3D(
            Math.cos(theta), 0, -Math.sin(theta),
            0, 1, 0,
            Math.sin(theta), 0, Math.cos(theta)
        );
    }

    static coordinateTransformRotationAroundYAxis(theta: number) {
        return new Matrix3D(
            Math.cos(theta), 0, Math.sin(theta),
            0, 1, 0,
            -Math.sin(theta), 0, Math.cos(theta)
        );
    }

    transformVector(v: Vector3D): Vector3D {
        return new Vector3D(
            this.m11 * v.x + this.m21 * v.y + this.m31 * v.z,
            this.m12 * v.x + this.m22 * v.y + this.m32 * v.z,
            this.m13 * v.x + this.m23 * v.y + this.m33 * v.z            
        )
    }

    get zVector(): Vector3D {
        return new Vector3D(this.m13, this.m23, this.m33);
    }

    get xVector(): Vector3D {
        return new Vector3D(this.m11, this.m21, this.m31);
    }
}