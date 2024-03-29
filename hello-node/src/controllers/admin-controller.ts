
import { RequestHandler, Request, Response } from "express" ;
import { Product } from "../models/products-model"

export function getProducts(req: Request, res: Response) {
    Product.fetchAll((products: Product[]) => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin products",
            path: '/admin/products',
            activeShop: true,
            productCSS: true
        });
    });
}

export const addProduct = (req: Request, res: Response) => {
    console.log(req.body);
    let title = req.body.title;
    new Product(title).save();
    res.redirect("/products");
}
