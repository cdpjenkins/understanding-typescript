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

//
// Application stuff here
//

let keysDown = new Map<string, boolean>();

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown.set(e.key, true);
}, false);
document.addEventListener('keyup', function(e) {
    keysDown.set(e.key, false);
}, false);

var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

// let particles: Particle[] = [new Particle(new Vector3D(0, 0, 300), new Vector3D(0, 0, 0), 10)];
let particles: Particle[] = [];
for (let theta = 0; theta < Math.PI*2; theta += Math.PI / 10) {
    particles.push(
        new Particle(
            new Vector3D(
                Math.sin(theta) * 500,
                Math.cos(theta) * 500,
                700
            ),
            Vector3D.ZERO,
            5
        )
    )
}

let observer: Observer = new Observer(
    new Vector3D(0, 0, 0),
    0,
    Matrix3D.IDENTITY
)

setInterval(tick, 20)

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if ((<any> canvas).webkitRequestFullscreen) {
        /* Safari */
        (<any> canvas).webkitRequestFullscreen();
    } else if ((<any> canvas).msRequestFullscreen) {
        /* IE11 */
        (<any> canvas).msRequestFullscreen();
  }
}

function handleKeys() {
    if (keysDown.get('a')) {
        observer.rotate(Math.PI / 512);
    }
    if (keysDown.get('d')) {
        observer.rotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        observer.moveBackwards(4);
    }
    if (keysDown.get('z')) {
        observer.moveLeft(4);
    }
    if (keysDown.get('x')) {
        observer.moveRight(4);
    }
}

function tick() {
    handleKeys();
    // updateStars();
    draw();
}

function clear() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();

    const coordinateTransformMatrix = Matrix3D.coordinateTransformRotationAroundYAxis(observer.theta);

    for (const particle of particles) {
        particle.transformWorldToView(observer.pos, coordinateTransformMatrix);

        if (particle.viewPos.z > 0) {
            drawCircle(particle.viewPos, "rgb(255, 255, 255)", particle.radius);
        }
    }
}

function drawCircle(pos: Vector3D, rgb: string, radius: number) {
    let screenPos = projectViewToScreen(pos);

    // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
    // supposed to be a sphere) but hopefully something better will fall out eventually.
    radius = radius * PROJECTION_DEPTH / pos.z;

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();
}
