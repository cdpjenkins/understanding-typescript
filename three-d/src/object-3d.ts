import { Colour } from "./draw-2d";
import { Vector2D, Vector4D } from "./linear-algebra";
import { CompoundParticleObject, LineShape3D, Object3D, ObjectWithVertices, Particle, ParticleShape, Shape3D, TriangleShape3D, Vertex } from "./scene-graph";


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

export function makeThingie(pos: Vector4D) {
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
        new TriangleShape3D(1, 2, 4, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(2, 3, 4, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(3, 0, 4, Colour.LIGHT_OFF_GREY),

        new TriangleShape3D(1, 0, 5, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(2, 1, 5, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(3, 2, 5, Colour.LIGHT_OFF_GREY),
        new TriangleShape3D(0, 3, 5, Colour.LIGHT_OFF_GREY),
    ];

    return ObjectWithVertices.make(pos, vertices, triangles, 0);
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

export function makeSolidPyramid(pos: Vector4D) {
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
            new TriangleShape3D(1, 2, 4, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(2, 3, 4, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(3, 0, 4, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(2, 1, 0, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(3, 2, 0, Colour.LIGHT_OFF_GREY),
        ],
        0
    );
}

export function makeSolidCube(pos: Vector4D) {
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
            new TriangleShape3D(1, 5, 6, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(1, 6, 2, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(5, 4, 7, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(5, 7, 6, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(4, 0, 3, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(4, 3, 7, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(3, 2, 6, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(3, 6, 7, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(0, 4, 5, Colour.LIGHT_OFF_GREY),
            new TriangleShape3D(0, 5, 1, Colour.LIGHT_OFF_GREY),
        ],
        0
    )
}

export function makeWireframeCube(pos: Vector4D) {
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

export function makeParticleFloor(): CompoundParticleObject {
    let childObjects: Object3D[] = [];
    for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
            childObjects.push(
                new Particle(
                    new Vector4D(
                        (x - 5) * 500,
                        -500,
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
