import * as fs from "fs";
import * as path from "path";
import { rootDir } from "../util/path";

export class Product {
    constructor(
        public title: string,
        public description: string,
        public price: string
    ) {}

    save() {
        const p = path.join(rootDir, "data", "products.json");
        fs.readFile(p, (err, data) => {
            let products: Product[] = []
            if (!err) {
                products = JSON.parse(data.toString());
            } else {
                products = [];
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback: (products: Product[]) => void) {
        const p = path.join(rootDir, "data", "products.json");

        fs.readFile(p, (err, data) => {
            if (err) {
                console.log(`err is ${err}`);
                callback([]);
            } else {
                callback(JSON.parse(data.toString()));
            }
        });
    }
}
