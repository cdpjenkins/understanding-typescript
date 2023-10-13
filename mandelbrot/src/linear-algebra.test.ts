import { Vector2D, Matrix2D } from "./linear-algebra";

test("transforming by identity matrix leaves vector unchanged", () => {
    const result = Matrix2D.identity
            .transformVector(new Vector2D(1, 2));

    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
});

test("rotating anti-clockwise by 90 degrees works correctly", () => {
    const result = new Matrix2D(
        0, -1,
        1, 0
    ).transformVector(new Vector2D(1, 2))

    expect(result.x).toBe(-2);
    expect(result.y).toBe(1);
});
