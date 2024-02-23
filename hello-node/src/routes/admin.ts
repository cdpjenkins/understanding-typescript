import { Router } from "express";
import path from "path";
import {rootDir} from "../util/path";

const router = Router();

router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

export default router;
