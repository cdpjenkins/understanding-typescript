import { Router } from "express";
import path from "path";

const router = Router();

router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
});

export default router;
