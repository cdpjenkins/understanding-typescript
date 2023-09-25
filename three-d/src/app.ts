//
// Application stuff here
//

import * as Collections from 'typescript-collections';

import { Matrix4x3, Vector4D, Vector2D } from "./linear-algebra";
import { Particle, CompoundParticleObject, Observer, Object3D, ObjectWithVertices, ParticleShape, Vertex, Shape3D, LineShape3D, TriangleShape3D, Scene } from "./scene-graph";
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

export function makeVerticalCircle(pos: Vector4D, radius: number = 500): ObjectWithVertices {
    const NUM_PARTICLES = 50;

    let vertices: Vertex[] = [];
    let particles: Shape3D[] = [];
    let i: number = 0;
    for (let theta = 0; theta < Math.PI*2; theta += Math.PI / NUM_PARTICLES, i++) {
        vertices.push(
            new Vertex(
                new Vector4D(
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
                    new Vector4D(
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
        Vector4D.ZERO,
        childObjects
    );
}

// @ts-ignore
function makeWireframeCube(pos: Vector4D) {
    return new ObjectWithVertices(
        pos,
        [
            new Vertex(new Vector4D(-100, -100, -100)),
            new Vertex(new Vector4D(100, -100, -100)),
            new Vertex(new Vector4D(100, 100, -100)),
            new Vertex(new Vector4D(-100, 100, -100)),
            new Vertex(new Vector4D(-100, -100, 100)),
            new Vertex(new Vector4D(100, -100, 100)),
            new Vertex(new Vector4D(100, 100, 100)),
            new Vertex(new Vector4D(-100, 100, 100)),
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

function makeSolidCube(pos: Vector4D) {
    return ObjectWithVertices.make(
        pos,
        [
            new Vertex(new Vector4D(-100, -100, -100)),
            new Vertex(new Vector4D(100, -100, -100)),
            new Vertex(new Vector4D(100, 100, -100)),
            new Vertex(new Vector4D(-100, 100, -100)),
            new Vertex(new Vector4D(-100, -100, 100)),
            new Vertex(new Vector4D(100, -100, 100)),
            new Vertex(new Vector4D(100, 100, 100)),
            new Vertex(new Vector4D(-100, 100, 100)),
        ],
        [
            new TriangleShape3D(0, 1, 2, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(0, 2, 3, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(1, 5, 6, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(1, 6, 2, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(5, 4, 7, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(5, 7, 6, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(4, 0, 3, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(4, 3, 7, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(3, 2, 6, Colour.DARK_OFF_GREY),
            new TriangleShape3D(3, 6, 7, Colour.DARK_OFF_GREY),
            new TriangleShape3D(0, 4, 5, Colour.DARK_OFF_GREY),
            new TriangleShape3D(0, 5, 1, Colour.DARK_OFF_GREY),
        ],
        0
    )
}

// @ts-ignore
function makeWireframePyramid(pos: Vector4D) {
    return new ObjectWithVertices(
        pos,
        [
            new Vertex(new Vector4D(-100, -100, -100)),
            new Vertex(new Vector4D(100, -100, -100)),
            new Vertex(new Vector4D(100, -100, 100)),
            new Vertex(new Vector4D(-100,-100, 100)),
            new Vertex(new Vector4D(0, 100, 0)),
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

function makeSolidPyramid(pos: Vector4D) {
    return ObjectWithVertices.make(
        pos,
        [
            new Vertex(new Vector4D(-100, -100, -100)),
            new Vertex(new Vector4D(100, -100, -100)),
            new Vertex(new Vector4D(100, -100, 100)),
            new Vertex(new Vector4D(-100,-100, 100)),
            new Vertex(new Vector4D(0, 100, 0)),
        ],
        [
            new TriangleShape3D(0, 1, 4, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(1, 2, 4, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(2, 3, 4, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(3, 0, 4, Colour.MEDIUM_OFF_GREY),
            new TriangleShape3D(2, 1, 0, Colour.DARK_OFF_GREY),
            new TriangleShape3D(3, 2, 0, Colour.DARK_OFF_GREY),
        ],
        0
    );
}

function makeThingie(pos: Vector4D) {
    const vertices = [
        new Vertex(new Vector4D(-100, 0, -100)),
        new Vertex(new Vector4D(100, 0, -100)),
        new Vertex(new Vector4D(100, 0, 100)),
        new Vertex(new Vector4D(-100, 0, 100)),
        new Vertex(new Vector4D(0, 100, 0)),
        new Vertex(new Vector4D(0, -100, 0)),
    ];

    const triangles = [
        new TriangleShape3D(0, 1, 4, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(1, 2, 4, Colour.MEDIUM_OFF_GREY),
        new TriangleShape3D(2, 3, 4, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(3, 0, 4, Colour.MEDIUM_OFF_GREY),

        new TriangleShape3D(1, 0, 5, Colour.MEDIUM_OFF_GREY),
        new TriangleShape3D(2, 1, 5, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(3, 2, 5, Colour.MEDIUM_OFF_GREY),
        new TriangleShape3D(0, 3, 5, Colour.LIGHT_OFF_GREY),
    ];

    return ObjectWithVertices.make(pos, vertices, triangles, 0);
}

const cube = makeSolidCube(new Vector4D(400, 250, 1000));
const thingie = makeThingie(new Vector4D(0, 250, 1000));
// const wireframePyramid = makeWireframePyramid(new Vector4D(-400, 250, 1000));
const solidPyramid = makeSolidPyramid(new Vector4D(-400, 250, 1000));

function setupObjects(): Object3D[] {
    let objects: Object3D[] = [];

    for (let z = 300; z < 12000; z += 200) {
        objects.push(makeVerticalCircle(new Vector4D(0, 300, z), 500));
        objects.push(makeVerticalCircle(new Vector4D(0, 300, z), 1000));
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
    // objects.push(wireframePyramid);
    objects.push(solidPyramid);
    objects.push(thingie);
    objects.push(makeFloor());

    return objects;
}

let objects = setupObjects();

const scene: Scene = new Scene(
    new Observer(
        new Vector4D(0, 300, 0),
        0,
        Matrix4x3.IDENTITY,
        canvas.width,
        canvas.height
    )
);

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
        scene.observer.yRotate(Math.PI / 512);
    }
    if (keysDown.get('e')) {
        scene.observer.yRotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        scene.observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        scene.observer.moveBackwards(4);
    }
    if (keysDown.get('a')) {
        scene.observer.moveLeft(4);
    }
    if (keysDown.get('d')) {
        scene.observer.moveRight(4);
    }
}

function updateObjects() {
    cube.yRotation += Math.PI / 1024;
    if (cube.yRotation >= Math.PI * 2) {
        cube.yRotation -= Math.PI * 2;
    }

    // wireframePyramid.yRotation -= Math.PI / 1024;
    // if (wireframePyramid.yRotation < 0) {
    //     wireframePyramid.yRotation += Math.PI * 2;
    // }

    thingie.yRotation += Math.PI / 1024;
    if (thingie.yRotation >= Math.PI * 2) {
        thingie.yRotation -= Math.PI * 2;
    }

    solidPyramid.yRotation += Math.PI / 1024;
    if (solidPyramid.yRotation >= Math.PI * 2) {
        solidPyramid.yRotation -= Math.PI * 2;
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

    const translationMatrix = Matrix4x3.translation(scene.observer.pos.negate());
    const rotationMatrix = Matrix4x3.coordinateTransformRotationAroundYAxis(scene.observer.yRotation);

    const transform = rotationMatrix.transformMatrix(translationMatrix);

    let shapes: Shape2D[] = [];

    for (const object of objects) {
        object.transformToViewSpace(transform);

        object.draw(scene.observer, shapes);
    }

    shapes.sort( (lhs, rhs) => rhs.z - lhs.z );

    for (const shape of shapes) {
        shape.draw(ctx)
    }

    const endTime = performance.now();
    let timeTaken = endTime - startTime;
    console.log(`One tick: ${timeTaken}ms`);
}
