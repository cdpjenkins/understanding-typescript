import { RequestHandler, Request, Response } from "express" ;

import * as admin from "./admin-controller";
import { Product } from "../models/products-model";

export const getShop: RequestHandler = (req, res, next) => {
    const products = Product.fetchAll((products: Product[]) => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    });
};
