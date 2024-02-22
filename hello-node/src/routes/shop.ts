import { Router } from "express";
import path from "path";

const router = Router();

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
});

export default router;