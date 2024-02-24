import { Router } from "express";
import path from "path";
import {rootDir} from "../util/path";

const router = Router();

router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res) => {
   console.log(req.body);
   res.redirect("/");
});

export default router;
