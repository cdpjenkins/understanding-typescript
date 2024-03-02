import {Request, Response} from "express";
import {Product} from "../models/products-model"

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
    new Product(req.body.title, req.body.description, req.body.price).save();
    res.redirect("/products");
}
