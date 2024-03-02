import { Router } from "express";
import * as shop from "../controllers/shop-controller";

export const router = Router();

router.get("/", shop.getIndex)
router.get("/products", shop.getShop);
router.get("/cart", shop.getCart);

