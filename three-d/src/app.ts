// import Collections = require('typescript-collections');

/// <reference path="LinearAlgebra.ts"/>
/// <reference path="SceneGraph.ts"/>

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

function makeVerticalCircle(pos: Vector3D): CompoundParticleObject {
    const NUM_PARTICLES = 50;

    let childObjects: Object3D[] = [];
    for (let theta = 0; theta < Math.PI*2; theta += Math.PI / NUM_PARTICLES) {
        childObjects.push(
            new Particle(
                new Vector3D(
                    Math.sin(theta) * 500,
                    Math.cos(theta) * 500,
                    0
                ),
                5,
                Vector2D.ZERO
            )
        )
    }

    return new CompoundParticleObject(
        pos,
        childObjects
    );
}

function makeFloor(): CompoundParticleObject {

    let childObjects: Object3D[] = [];
    for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
            childObjects.push(
                new Particle(
                    new Vector3D(
                        (x - 5) * 500,
                        0,
                        (z) * 500
                    ),
                    5,
                    Vector2D.ZERO
                )
            )
        }
    }

    return new CompoundParticleObject(
        Vector3D.ZERO,
        childObjects
    );
}

function setupObjects(): Object3D[] {
    let objects: Object3D[] = [];

    for (let z = 300; z < 24000; z += 200) {
        objects.push(makeVerticalCircle(new Vector3D(0, 300, z)));
    }

    // let weirdTotemPoleThingie = new ObjectWithVertices(
    //     new Vector3D(0, 0, 1000),
    //     [
    //         new Vertex(new Vector3D(0, 0, 0)),
    //         new Vertex(new Vector3D(0, 200, 0)),
    //         new Vertex(new Vector3D(0, 400, 0)),
    //         new Vertex(new Vector3D(0, 600, 0)),
    //     ],
    //     [
    //         new ParticleShape(0, Colour.WHITE),
    //         new ParticleShape(1, Colour.RED),
    //         new ParticleShape(2, Colour.WHITE),
    //         new ParticleShape(3, Colour.RED)
    //     ]
    // );
    // objects.push(weirdTotemPoleThingie);

    objects.push(makeFloor());

    return objects;
}

let objects = setupObjects();

let observer: Observer = new Observer(
    new Vector3D(0, 300, 0),
    0,
    Matrix4x3.IDENTITY,
    canvas.width,
    canvas.height
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
    if (keysDown.get('q')) {
        observer.rotate(Math.PI / 512);
    }
    if (keysDown.get('e')) {
        observer.rotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        observer.moveBackwards(4);
    }
    if (keysDown.get('a')) {
        observer.moveLeft(4);
    }
    if (keysDown.get('d')) {
        observer.moveRight(4);
    }
}

function tick() {
    handleKeys();
    draw();
}

function clear() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();

    const translationMatrix = Matrix4x3.translation(observer.pos.negate());
    const rotationMatrix = Matrix4x3.coordinateTransformRotationAroundYAxis(observer.theta);

    const transform = rotationMatrix.transformMatrix(translationMatrix);

    for (const particle of objects) {
        particle.transformToViewSpace(transform);

        particle.draw(ctx, observer);
    }
}
