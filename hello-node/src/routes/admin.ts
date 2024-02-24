import { Router } from "express";
import path from "path";
import {rootDir} from "../util/path";

const router = Router();

class Product {
    constructor(
        public title: string
    ) {}
}

const products: Product[] = [];

router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res) => {
    console.log(req.body);
    let title = req.body.title;
    products.push(new Product(title));
    res.redirect("/");
});

// export default router;
export { router, products };
