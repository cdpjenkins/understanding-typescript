import { Router } from "express";
import { getShop } from "../controllers/shop";

export const router = Router();

router.get("/", getShop);
