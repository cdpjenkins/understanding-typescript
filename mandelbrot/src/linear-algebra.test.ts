import { Vector2D, Matrix3D } from "./linear-algebra";

test("transforming by identity matrix leaves vector unchanged", () => {
    const result = Matrix3D.identity
            .transformVector(new Vector2D(1, 2));

    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
});

test("rotating anti-clockwise by 90 degrees works correctly", () => {
    const result = Matrix3D.rotation(Math.PI / 2)
            .transformVector(new Vector2D(1, 2));

    expect(result.x).toBeCloseTo(-2);
    expect(result.y).toBeCloseTo(1);
});

test("translating a vector works correctly", () => {
    const result = Matrix3D.translation(10, 20)
            .transformVector(new Vector2D(1, 2));

    expect(result.x).toBeCloseTo(11);
    expect(result.y).toBeCloseTo(22);
        
});

test("can translate and then rotate correctly using composed matrices", () => {
    const transform = Matrix3D.rotation(Math.PI / 2)
            .transformMatrix(Matrix3D.translation(10, 20));

    const result = transform.transformVector(new Vector2D(1, 2));

    expect(result.x).toBeCloseTo(-22);
    expect(result.y).toBeCloseTo(11);
});

test("can scale a vector correctly", () => {
    const result = Matrix3D.scale(1/100)
            .transformVector(new Vector2D(200, 300));

    expect(result.x).toBeCloseTo(2);
    expect(result.y).toBeCloseTo(3);
});
