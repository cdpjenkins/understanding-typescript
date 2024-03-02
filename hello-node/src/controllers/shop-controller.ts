import { RequestHandler, Request, Response } from "express" ;

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

export const getProducts: RequestHandler = (req, res, next) => {
    Product.fetchAll((products: Product[]) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
            hasProducts: products.length > 0
        })
    });
};
