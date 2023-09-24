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

import { Matrix4x3, Vector4D, Vector2D } from "./linear-algebra";
import { Colour, Circle, Shape2D, Line2D, Triangle2D } from "./draw-2d";

export abstract class Object3D {
    public viewPos: Vector4D = Vector4D.ZERO;

    constructor(
        public worldPos: Vector4D
    ) {}

    abstract transformToViewSpace(transform: Matrix4x3): void;
    abstract projectToScreen(observer: Observer): void;
    abstract draw(observer: Observer, shapes: Shape2D[]): void;
}

export class Vertex {
    constructor(
        public pos: Vector4D,
        public viewPos: Vector4D = Vector4D.ZERO,
        public screenPos: Vector2D = Vector2D.ZERO
    ) {}

    transformToViewSpace(parentTransform: Matrix4x3): void {
        this.viewPos = parentTransform.transformVector(this.pos);
    }

    projectToScreen(observer: Observer): void {
        this.screenPos = observer.projectViewToScreen(this.viewPos)
    }
}

export abstract class Shape3D {
    constructor(
        public vertextReferences: number[],
        public colour: Colour = Colour.WHITE
    ) {}

    abstract draw(observer: Observer, vertices: Vertex[], shapes: Shape2D[]): void;

    distanceAdjustedColour(z: number) {
        return this.colour.times(1 * (1024 / z));
    }
}

export class ParticleShape extends Shape3D {
    constructor(
        vertexNumber: number,
        colour: Colour,
        public radius: number = 100
    ) {
        super([vertexNumber], colour);
    }

    override draw(observer: Observer, vertices: Vertex[], shapes: Shape2D[]) {
        const vertex = vertices[this.vertextReferences[0]];

        if (vertex.viewPos.z > 0 && observer.isWithinFrustumOfVisibility(vertex.viewPos)) {
            const screenPos = observer.projectViewToScreen(vertex.viewPos);

            // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
            // supposed to be a sphere) but hopefully something better will fall out eventually.
            const radius = this.radius * observer.PROJECTION_DEPTH / vertex.viewPos.z;
        
            shapes.push(new Circle(screenPos, vertex.viewPos.z, radius, this.distanceAdjustedColour(vertex.viewPos.z)));
        }
    }
}

export class LineShape3D extends Shape3D {
    constructor(
        private startVertex: number,
        private endVertex: number,
        colour: Colour
    ) {
        super([startVertex, endVertex], colour);
    }

    override draw(observer: Observer, vertices: Vertex[], shapes: Shape2D[]) {
        // TODO if a line intersects the z==0 plane then maybe we need to cut it, rather than having the line kind of disappear
        // if one end of the other end gets too close to the camera

        const startViewPos = vertices[this.startVertex].viewPos;
        const endViewPos = vertices[this.endVertex].viewPos;

        if (startViewPos.z > 0 && endViewPos.z > 0 &&
            !(!observer.isWithinFrustumOfVisibility(startViewPos) && !observer.isWithinFrustumOfVisibility(endViewPos))) {

            const z = (startViewPos.z + endViewPos.z) / 2;

            const startScreenpos = observer.projectViewToScreen(vertices[this.startVertex].viewPos);
            const endScreenPos = observer.projectViewToScreen(vertices[this.endVertex].viewPos);

            shapes.push(new Line2D(startScreenpos, endScreenPos, z, this.distanceAdjustedColour(z)));
        }
    }
}

export class TriangleShape3D extends Shape3D {
    constructor(
        private vertex1: number,
        private vertex2: number,
        private vertex3: number,
        colour: Colour
    ) {
        super([vertex1, vertex2, vertex3], colour);
    }

    override draw(observer: Observer, vertices: Vertex[], shapes: Shape2D[]) {
        // TODO again if a triangle intersects the boundaries of the frustum of visibility then maybe we should cut it
        
        const viewPos1 = vertices[this.vertex1].viewPos;
        const viewPos2 = vertices[this.vertex2].viewPos;
        const viewPos3 = vertices[this.vertex3].viewPos;

        if (viewPos1.z > 0 && viewPos1.z > 0 && viewPos3.z > 0 &&
            !(  !observer.isWithinFrustumOfVisibility(viewPos1) &&
                !observer.isWithinFrustumOfVisibility(viewPos2) &&
                !observer.isWithinFrustumOfVisibility(viewPos3)
            )) {

            const z = (viewPos1.z + viewPos2.z + viewPos3.z) / 3;

            const screenpos1 = observer.projectViewToScreen(vertices[this.vertex1].viewPos);
            const screenpos2 = observer.projectViewToScreen(vertices[this.vertex2].viewPos);
            const screenpos3 = observer.projectViewToScreen(vertices[this.vertex3].viewPos);

            shapes.push(new Triangle2D(screenpos1, screenpos2, screenpos3, z, this.distanceAdjustedColour(z)));
        }
    }
}


export class ObjectWithVertices extends Object3D {
    constructor(
        worldPos: Vector4D,
        public vertices: Vertex[],
        public shapes: Shape3D[],
        public yRotation: number = 0,
    ) {
        super(worldPos);
    }

    override transformToViewSpace(parentTransform: Matrix4x3): void {
        this.viewPos = parentTransform.transformVector(this.worldPos);

        const rotateObject = Matrix4x3.geometricTransformRotationAroundYAxis(this.yRotation);
        const translateToWorldPos = Matrix4x3.translation(this.worldPos);

        const thisTransform = parentTransform.transformMatrix(translateToWorldPos.transformMatrix(rotateObject));

        this.vertices.forEach ((v) => {
            v.transformToViewSpace(thisTransform);
        });
    }

    override projectToScreen(observer: Observer): void {
        this.vertices.forEach ((v) => {
            v.projectToScreen(observer);
        });
    }
    
    override draw(observer: Observer, shapes: Shape2D[]): void {
        this.shapes.forEach((shape) => {
            shape.draw(observer, this.vertices, shapes);
        });
    }
}

export class Particle extends ObjectWithVertices {
    constructor(
        worldPos: Vector4D,
        public radius: number,
        public screenPos: Vector2D
    ) {
        super(worldPos, [new Vertex(new Vector4D(0, 0, 0))], [new ParticleShape(0, Colour.WHITE, radius)]);
    }
}

export class CompoundParticleObject extends Object3D {
    constructor(
        worldPos: Vector4D,
        public children: Object3D[]
    ) {
        super(worldPos);
    }

    override transformToViewSpace(parentTransform: Matrix4x3): void {
        this.viewPos = parentTransform.transformVector(this.worldPos);

        const thisTransform = parentTransform.transformMatrix(Matrix4x3.translation(this.worldPos));

        this.children.forEach( (child) => {
            child.transformToViewSpace(thisTransform);
        });
    }
    
    override projectToScreen(observer: Observer): void {
        this.children.forEach( (child) => {
            child.projectToScreen(observer);
        });
    }

    override draw(observer: Observer, shapes: Shape2D[]): void {
        this.children.forEach( (child) => {
            child.draw(observer, shapes);
        });
    }
}

export class Observer {
    readonly PROJECTION_DEPTH = 1000;

    constructor(
        public pos: Vector4D,
        public yRotation: number,
        public coordinateTransform: Matrix4x3,
        public screenWidth: number,
        public screenHeight: number
    ) {}

    yRotate(dTheta: number) {
        this.yRotation += dTheta;

        this.coordinateTransform = Matrix4x3.coordinateTransformRotationAroundYAxis(this.yRotation);
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

    public projectViewToScreen(viewPos: Vector4D): Vector2D {
        // by similar triangles:
        //     screenX / projectionDepth = viewX / z
        // ==> screenX = viewX * projectionDepth / z
        //             = viewX * projectionDepth / z

        let factor = this.PROJECTION_DEPTH / viewPos.z;

        let projectedX = viewPos.x * factor;
        let projectedY = viewPos.y * factor;

        let screenX = this.screenWidth / 2 + projectedX;
        let screenY = this.screenHeight / 2 - projectedY;

        return new Vector2D(screenX, screenY);
    }

    public isWithinFrustumOfVisibility(v: Vector4D): boolean {
        if (v.z > 10000) {
            return false;
        }


        // In order to be off screen in the x direction:
        //     |viewX * projectionDepth / z| < screenWidth/2
        // ==> |viewX| * projectionDepth / z < screenWidth/2
        // ==> |viewX| * projectionDepth < screenWidth * z / 2
        // ==> |viewX| * projectDepth * 2 < screenWidth * z

        const p = v.x * this.PROJECTION_DEPTH * 2;
        const limit = this.screenWidth * v.z;

        if (p < -limit || p > limit) {
            return false;
        }

        return true;
    }
}
