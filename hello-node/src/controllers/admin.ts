
import { RequestHandler, Request, Response } from "express" ;

class Product {
    constructor(
        public title: string
    ) {}
}

export const products: Product[] = [];

export function addProduct(req: Request, res: Response) {
    res.render("add-product", {
        prods: products,
        pageTitle: "Add product innit like",
        path: '/admin/add-product',
        activeShop: true,
        productCSS: true
    });
}

export const actuallyAddProduct = (req: Request, res: Response) => {
    console.log(req.body);
    let title = req.body.title;
    products.push(new Product(title));
    res.redirect("/");
}
