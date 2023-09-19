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

import { Matrix4x3, Vector3D, Vector2D } from "./linear-algebra";
import { Colour, Circle, Shape2D, Line2D } from "./draw-2d";

export abstract class Object3D {
    public viewPos: Vector3D = Vector3D.ZERO;

    constructor(
        public worldPos: Vector3D
    ) {}

    abstract transformToViewSpace(transform: Matrix4x3): void;
    abstract projectToScreen(observer: Observer): void;
    abstract draw(observer: Observer, shapes: Shape2D[]): void;
}

export class Vertex {
    constructor(
        public pos: Vector3D,
        public viewPos: Vector3D = Vector3D.ZERO,
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

        if (vertex.viewPos.z > 0) {
            const screenPos = observer.projectViewToScreen(vertex.viewPos);

            // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
            // supposed to be a sphere) but hopefully something better will fall out eventually.
            const radius = this.radius * observer.PROJECTION_DEPTH / vertex.viewPos.z;

            const distanceAdjustedColour = this.colour.times(1 / (vertex.viewPos.z / 1024 ));
        
            shapes.push(new Circle(screenPos, vertex.viewPos.z, radius, distanceAdjustedColour));
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

        if (startViewPos.z > 0 && endViewPos.z > 0) {

            const z = (startViewPos.z + endViewPos.z) / 2;

            const startScreenpos = observer.projectViewToScreen(vertices[this.startVertex].viewPos);
            const endScreenPos = observer.projectViewToScreen(vertices[this.endVertex].viewPos);

            const distanceAdjustedColour = this.colour.times(1 / (z / 1024 ));

            shapes.push(new Line2D(startScreenpos, endScreenPos, z, distanceAdjustedColour));
        }
    }
}

export class ObjectWithVertices extends Object3D {
    constructor(
        worldPos: Vector3D,
        public vertices: Vertex[],
        public shapes: Shape3D[]
    ) {
        super(worldPos);
    }

    override transformToViewSpace(parentTransform: Matrix4x3): void {
        this.viewPos = parentTransform.transformVector(this.worldPos);

        const thisTransform = parentTransform.transformMatrix(Matrix4x3.translation(this.worldPos));

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
        worldPos: Vector3D,
        public radius: number,
        public screenPos: Vector2D
    ) {
        super(worldPos, [new Vertex(new Vector3D(0, 0, 0))], [new ParticleShape(0, Colour.WHITE, radius)]);
    }
}

export class CompoundParticleObject extends Object3D {
    constructor(
        worldPos: Vector3D,
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
        public pos: Vector3D,
        public theta: number,
        public coordinateTransform: Matrix4x3,
        public screenWidth: number,
        public screenHeight: number
    ) {}

    rotate(dTheta: number) {
        this.theta += dTheta;

        this.coordinateTransform = Matrix4x3.coordinateTransformRotationAroundYAxis(this.theta);
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

    public projectViewToScreen(viewPos: Vector3D): Vector2D {
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
}
