//
// Application stuff here
//

import * as Collections from 'typescript-collections';

import { Matrix4x3, Vector3D, Vector2D } from "./linear-algebra";
import { Particle, CompoundParticleObject, Observer, Object3D, ObjectWithVertices, ParticleShape, Vertex, Shape3D, LineShape3D } from "./scene-graph";
import { Colour, Shape2D } from "./draw-2d";

const tree = new Collections.BSTree<String>(
    (lhs: String, rhs: String) => {
        if (lhs < rhs) {
            return -1;
        } else if (lhs == rhs) {
            return 0;
        } else {
            return 1;
        }
    });

tree.add("delta");
tree.add("charlie");
tree.add("bravo");
tree.add("alpha");

tree.inorderTraversal( (element) => console.log(element) );
    
let keysDown = new Map<string, boolean>();

export var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown.set(e.key, true);
}, false);
document.addEventListener('keyup', function(e) {
    keysDown.set(e.key, false);
}, false);

var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export function makeVerticalCircle(pos: Vector3D, radius: number = 500): ObjectWithVertices {
    const NUM_PARTICLES = 50;

    let vertices: Vertex[] = [];
    let particles: Shape3D[] = [];
    let i: number = 0;
    for (let theta = 0; theta < Math.PI*2; theta += Math.PI / NUM_PARTICLES, i++) {
        vertices.push(
            new Vertex(
                new Vector3D(
                    Math.sin(theta) * radius,
                    Math.cos(theta) * radius,
                    0
                )
            )
        )

        particles.push(new ParticleShape(i, Colour.WHITE, 5));
    }

    return new ObjectWithVertices(
        pos,
        vertices,
        particles
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

function makeCube(pos: Vector3D) {
    return new ObjectWithVertices(
        pos,
        [
            new Vertex(new Vector3D(-100, -100, -100)),
            new Vertex(new Vector3D(100, -100, -100)),
            new Vertex(new Vector3D(100, 100, -100)),
            new Vertex(new Vector3D(-100, 100, -100)),
            new Vertex(new Vector3D(-100, -100, 100)),
            new Vertex(new Vector3D(100, -100, 100)),
            new Vertex(new Vector3D(100, 100, 100)),
            new Vertex(new Vector3D(-100, 100, 100)),
        ],
        [
            new LineShape3D(0, 1, Colour.WHITE),
            new LineShape3D(1, 2, Colour.WHITE),
            new LineShape3D(2, 3, Colour.WHITE),
            new LineShape3D(3, 0, Colour.WHITE),

            new LineShape3D(4, 5, Colour.WHITE),
            new LineShape3D(5, 6, Colour.WHITE),
            new LineShape3D(6, 7, Colour.WHITE),
            new LineShape3D(7, 4, Colour.WHITE),

            new LineShape3D(0, 4, Colour.WHITE),
            new LineShape3D(1, 5, Colour.WHITE),
            new LineShape3D(2, 6, Colour.WHITE),
            new LineShape3D(3, 7, Colour.WHITE),
        ],
        0
    )
}

function makePyramid(pos: Vector3D) {
    return new ObjectWithVertices(
        pos,
        [
            new Vertex(new Vector3D(-100, -100, -100)),
            new Vertex(new Vector3D(100, -100, -100)),
            new Vertex(new Vector3D(100, -100, 100)),
            new Vertex(new Vector3D(-100,-100, 100)),
            new Vertex(new Vector3D(0, 100, 0)),
        ],
        [
            new LineShape3D(0, 1, Colour.WHITE),
            new LineShape3D(1, 2, Colour.WHITE),
            new LineShape3D(2, 3, Colour.WHITE),
            new LineShape3D(3, 0, Colour.WHITE),

            new LineShape3D(0, 4, Colour.WHITE),
            new LineShape3D(1, 4, Colour.WHITE),
            new LineShape3D(2, 4, Colour.WHITE),
            new LineShape3D(3, 4, Colour.WHITE),
        ],
        0
    )
}

const cube = makeCube(new Vector3D(200, 250, 1000));
const pyramid = makePyramid(new Vector3D(-200, 250, 1000))

function setupObjects(): Object3D[] {
    let objects: Object3D[] = [];

    for (let z = 300; z < 12000; z += 200) {
        objects.push(makeVerticalCircle(new Vector3D(0, 300, z), 500));
        objects.push(makeVerticalCircle(new Vector3D(0, 300, z), 1000));
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

    objects.push(cube);
    objects.push(pyramid);
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

// ignore unused for now because we're referencing directly from the HTML
// @ts-ignore
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
        observer.yRotate(Math.PI / 512);
    }
    if (keysDown.get('e')) {
        observer.yRotate(-Math.PI / 512);
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

function updateObjects() {
    cube.yRotation += Math.PI / 1024;
    if (cube.yRotation >= Math.PI * 2) {
        cube.yRotation -= Math.PI * 2;
    }


    pyramid.yRotation -= Math.PI / 1024;
    if (pyramid.yRotation < 0) {
        pyramid.yRotation += Math.PI * 2;
    }
}

function tick() {
    handleKeys();
    updateObjects();
    draw();
}

function clear() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    const startTime = performance.now();
    clear();

    const translationMatrix = Matrix4x3.translation(observer.pos.negate());
    const rotationMatrix = Matrix4x3.coordinateTransformRotationAroundYAxis(observer.yRotation);

    const transform = rotationMatrix.transformMatrix(translationMatrix);

    let shapes: Shape2D[] = [];

    for (const object of objects) {
        object.transformToViewSpace(transform);

        object.draw(observer, shapes);
    }

    shapes.sort( (lhs, rhs) => rhs.z - lhs.z );

    for (const shape of shapes) {
        shape.draw(ctx)
    }

    const endTime = performance.now();
    let timeTaken = endTime - startTime;
    console.log(`One tick: ${timeTaken}ms`);
}
