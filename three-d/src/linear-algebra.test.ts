import { Matrix4x3, Vector4D } from "./linear-algebra"

test("basic arithmetic works", () => {
        expect(1+1).toBe(2);
    }
);

test("multiplying vector by identity matrix doesn't change it", () => {
    expectVectorToBe(
        Matrix4x3.IDENTITY.transformVector(Vector4D.position(1, 2, 3)),
        Vector4D.position(1, 2, 3)
    )
});

test("position vector is affected by rotations", () => {
    expectVectorToBe(
        Matrix4x3.coordinateTransformRotationAroundYAxis(Math.PI / 2)
                    .transformVector(Vector4D.position(1, 0, 1)),
        Vector4D.position(1, 0, -1)
    );
});

test("position vector is affected by translations", () => {
    expectVectorToBe(
        Matrix4x3.translation(new Vector4D(10, 20, 30))
                    .transformVector(Vector4D.position(1, 2, 3)),
        Vector4D.position(11, 22, 33)
    );
});

test("direction vector is affected by rotations", () => {
    expectVectorToBe(
        ROTATION_ROUND_Y_AXIS.transformVector(Vector4D.direction(1, 0, 1)),
        Vector4D.direction(1, 0, -1)
    );
});

test("direction vector is *NOT* affected by translations", () => {
    const originalDirectionVector = Vector4D.direction(1, 2, 3);    
    expectVectorToBe(
        TRANSLATION_MATRIX.transformVector(originalDirectionVector),
        originalDirectionVector
    );
});

test("can normalise a vector", () => {
    expectVectorToBe(
        Vector4D.direction(10, 0, 0).normalise(),
        Vector4D.direction(1, 0, 0)
    );
});

test("calculates cross product of two direction vectors", () => {
    expectVectorToBe(
        Vector4D.direction(1, 0, 0).crossProduct(Vector4D.direction(0, 1, 0)),
        Vector4D.direction(0, 0, 1)
    )
});

test("dot product of orthogonal vectors is zero", () => {
    expect(Vector4D.direction(1, 0, 0).dotProduct(Vector4D.direction(0, 1, 0)))
            .toBe(0);
});

test("dot product of non-orthogonal vectors is projection of one onto the other", () => {
    expect(Vector4D.direction(1, 1, 0).dotProduct(Vector4D.direction(0, 1, 0)))
            .toBe(1);
});

test("dot product of two unit vectors is cos of angle between them", () => {
    expect(Vector4D.direction(1, 1, 0).normalise().dotProduct(Vector4D.direction(0, 1, 0)))
            .toBeCloseTo(Math.cos(Math.PI / 4));
});

function expectVectorToBe(actual: Vector4D, expected: Vector4D) {
    console.log("expected:");
    console.log(expected);

    console.log("actual:");
    console.log(actual);

    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
    expect(actual.z).toBeCloseTo(expected.z);
    expect(actual.w).toBeCloseTo(expected.w);
}

const TRANSLATION_MATRIX = Matrix4x3.translation(new Vector4D(10, 20, 30));
const ROTATION_ROUND_Y_AXIS = Matrix4x3.coordinateTransformRotationAroundYAxis(Math.PI / 2);