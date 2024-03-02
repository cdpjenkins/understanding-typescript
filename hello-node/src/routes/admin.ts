import { Router } from "express";
import { getProducts, addProduct } from "../controllers/admin-controller";

export const router = Router();

router.get("/products", getProducts);
router.post("/products", addProduct);
