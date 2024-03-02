import { Router } from "express";
import * as shopController from "../controllers/shop-controller";

export const router = Router();

router.get("/", shopController.getIndex)
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);

