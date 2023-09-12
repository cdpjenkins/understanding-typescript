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

abstract class Object3D {
    public viewPos: Vector3D = Vector3D.ZERO;

    constructor(
        public worldPos: Vector3D
    ) {}

    abstract transformToViewSpace(transform: Matrix4x3): void;
    abstract projectToScreen(observer: Observer): void;
    abstract draw(): void;
}

class Vertex {
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

abstract class Shape3D {
    constructor(
        public vertextReferences: number[]
    ) {}

    abstract draw(vertices: Vertex[]): void;
}

class ParticleShape extends Shape3D {
    constructor(
        vertexNumber: number
    ) {
        super([vertexNumber]);
    }

    override draw(vertices: Vertex[]) {
        const vertex = vertices[this.vertextReferences[0]];

        if (vertex.viewPos.z > 0) {
            drawCircle(vertex.viewPos, "rgb(255, 255, 255)", 100);
        }
    }
}

class ObjectWithVertices extends Object3D {
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

    override projectToScreen(): void {
        this.vertices.forEach ((v) => {
            v.projectToScreen(observer);
        });
    }
    
    override draw(): void {
        this.shapes.forEach((shape) => {
            shape.draw(this.vertices);
        });
    }
}

class Particle extends Object3D {
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

    override draw(): void {
        if (this.viewPos.z > 0) {
            drawCircle(this.viewPos, "rgb(255, 255, 255)", this.radius);
        }
    }
}

class CompoundParticleObject extends Object3D {
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


    override draw(): void {
        this.children.forEach( (child) => {
            child.draw();
        });
    }
}

class Observer {
    readonly PROJECTION_DEPTH = 1000;

    constructor(
        public pos: Vector3D,
        public theta: number,
        public coordinateTransform: Matrix4x3
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

        let screenX = canvas.width / 2 + projectedX;
        let screenY = canvas.height / 2 - projectedY;

        return new Vector2D(screenX, screenY);
    }
}
