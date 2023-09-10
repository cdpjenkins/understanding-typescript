//
// 3D stuff here
//

// Spaces:
// - Object space - object is at origin
// - World space - global origin, objects and observer have position and orientation in this space
// - View space - observer is at origin, z axis points forward
// - Screen space - 2D space, x axis points right, y axis points down
//
// There is kind of a missing space where we have projected a 3D vector into 2D space but haven't
// yet flipped the y axis and turned it into actual coordinates on the screen.

// We use a left-handed coordinate system for all 3D spaces where:
// x points right
// y points up
// z points forwards

const PROJECTION_DEPTH = 300;

function projectViewToScreen(viewPos: Vector3D): Vector2D {
    // by similar triangles:
    //     screenX / projectionDepth = viewX / z
    // ==> screenX = viewX * projectionDepth / z
    //             = viewX * projectionDepth / z

    let factor = PROJECTION_DEPTH / viewPos.z;

    let projectedX = viewPos.x * factor;
    let projectedY = viewPos.y * factor;

    let screenX = canvas.width / 2 + projectedX;
    let screenY = canvas.height / 2 + projectedY;

    return new Vector2D(screenX, screenY);
}

class Particle {
    constructor(
        public worldPos: Vector3D,
        public viewPos: Vector3D,
        public radius: number
    ) {}

    transformWorldToView(observerPos: Vector3D, observerCoordinateTransformMatrix: Matrix3D) {
        const translatedPos = this.worldPos.minus(observerPos);
        const rotatedPos = observerCoordinateTransformMatrix.transformVector(translatedPos);

        this.viewPos =  rotatedPos;
    }
}

class Observer {
    constructor(
        public pos: Vector3D,
        public theta: number,
        public coordinateTransform: Matrix3D
    ) {}

    rotate(dTheta: number) {
        this.theta += dTheta;

        this.coordinateTransform = Matrix3D.coordinateTransformRotationAroundYAxis(this.theta);
    }

    moveForwards(displacement: number) {
        this.pos = this.pos.translate(this.coordinateTransform.zVector.times(displacement));
    }

    moveBackwards(displacement: number) {
        this.pos = this.pos.minus(this.coordinateTransform.zVector.times(displacement));
    }

    moveLeft(displacement: number) {
        this.pos = this.pos.minus(this.coordinateTransform.xVector.times(displacement));
    }

    moveRight(displacement: number) {
        this.pos = this.pos.translate(this.coordinateTransform.xVector.times(displacement));
    }
}
