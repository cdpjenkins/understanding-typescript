import { Router } from "express";
import { addProduct as getProducts, actuallyAddProduct as addProduct } from "../controllers/admin";

export const router = Router();

router.get("/add-product", getProducts);
router.post("/add-product", addProduct);
