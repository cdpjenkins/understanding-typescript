import { Router } from "express";
import path from "path";

import { rootDir } from "../util/path";

import * as admin from "./admin";

export const router = Router();

router.get("/", (req, res, next) => {
    console.log(admin.products);
    // res.sendFile(path.join(rootDir, "views", "shop.html"));
    const products = admin.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});
