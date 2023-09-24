import { Matrix4x3, Vector3D } from "./linear-algebra"

test("basic arithmetic works", () => {
        expect(1+1).toBe(2);
    }
);

test("multiplying vector by identity matrix doesn't change it", () => {
        const vector = new Vector3D(1, 2, 3);
        
        const result = Matrix4x3.IDENTITY.transformVector(vector);

        expect(result.x).toBe(1);
        expect(result.y).toBe(2);
        expect(result.z).toBe(3);
    }
);
