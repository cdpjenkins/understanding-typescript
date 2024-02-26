import { Router } from "express";
import { getShop } from "../controllers/shop-controller";

export const router = Router();

router.get("/", getShop);
