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

export class Colour {
    constructor(
        public red: number,
        public green: number,
        public blue: number
        // what about alpha???
    ) {}

    static readonly WHITE = new Colour(255, 255, 255);
    static readonly RED = new Colour(255, 0, 0);

}

export abstract class Object3D {
    public viewPos: Vector3D = Vector3D.ZERO;

    constructor(
        public worldPos: Vector3D
    ) {}

    abstract transformToViewSpace(transform: Matrix4x3): void;
    abstract projectToScreen(observer: Observer): void;
    abstract draw(ctx: CanvasRenderingContext2D, observer: Observer): void;
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

    abstract draw(ctx: CanvasRenderingContext2D, observer: Observer, vertices: Vertex[]): void;
}

export class ParticleShape extends Shape3D {
    constructor(
        vertexNumber: number,
        colour: Colour
    ) {
        super([vertexNumber], colour);
    }

    override draw(ctx: CanvasRenderingContext2D, observer: Observer, vertices: Vertex[]) {
        const vertex = vertices[this.vertextReferences[0]];

        if (vertex.viewPos.z > 0) {
            drawCircle(
                ctx,
                observer,
                vertex.viewPos,
                `rgb(${this.colour.red}, ${this.colour.green}, ${this.colour.blue})`,
                100
            );
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
    
    override draw(ctx: CanvasRenderingContext2D, observer: Observer): void {
        this.shapes.forEach((shape) => {
            shape.draw(ctx, observer, this.vertices);
        });
    }
}

export class Particle extends Object3D {
    constructor(
        worldPos: Vector3D,
        public radius: number,
        public screenPos: Vector2D
    ) {
        super(worldPos);
    }

    override transformToViewSpace(parentTransform: Matrix4x3): void {
        this.viewPos = parentTransform.transformVector(this.worldPos);
    }

    override projectToScreen(observer: Observer): void {
        this.screenPos = observer.projectViewToScreen(this.viewPos)
    }

    override draw(ctx: CanvasRenderingContext2D, observer: Observer): void {
        if (this.viewPos.z > 0) {
            drawCircle(ctx, observer, this.viewPos, "rgb(255, 255, 255)", this.radius);
        }
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


    override draw(ctx: CanvasRenderingContext2D, observer: Observer): void {
        this.children.forEach( (child) => {
            child.draw(ctx, observer);
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

function drawCircle(ctx: CanvasRenderingContext2D, observer: Observer, pos: Vector3D, rgb: string, radius: number) {
    let screenPos = observer.projectViewToScreen(pos);

    // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
    // supposed to be a sphere) but hopefully something better will fall out eventually.
    radius = radius * observer.PROJECTION_DEPTH / pos.z;

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;

    ctx.fill();
}
