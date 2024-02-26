import { RequestHandler, Request, Response } from "express" ;

import * as admin from "./admin-controller";

export const getShop: RequestHandler = (req, res, next) => {
    console.log(admin.products);
    const products = admin.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    })
};
