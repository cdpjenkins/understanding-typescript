import { RequestHandler, Request, Response } from "express" ;

import * as admin from "./admin-controller";
import { Product } from "../models/products-model";

export let getCart: RequestHandler = (req, res, _) => {
    res.render("shop/cart.ejs", {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

export const getIndex: RequestHandler = (req, res, _) => {
    res.render("shop/index.ejs", {
        pageTitle: 'Shop',
        path: '/',
    });
};

export const getShop: RequestHandler = (req, res, next) => {
    const products = Product.fetchAll((products: Product[]) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    });
};
