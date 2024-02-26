
import { RequestHandler, Request, Response } from "express" ;
import { Product } from "../models/products-model"

export function addProduct(req: Request, res: Response) {
    const products = Product.fetchAll((products: Product[]) => {
        res.render("add-product", {
            prods: products,
            pageTitle: "Add product innit like",
            path: '/admin/add-product',
            activeShop: true,
            productCSS: true
        });
    });
}

export const actuallyAddProduct = (req: Request, res: Response) => {
    console.log(req.body);
    let title = req.body.title;
    new Product(title).save();
    res.redirect("/");
}
