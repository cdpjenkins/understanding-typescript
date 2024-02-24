import { Router } from "express";
import path from "path";

import { rootDir } from "../util/path";

import * as admin from "./admin";

export const router = Router();

router.get("/", (req, res, next) => {
    console.log(admin.products);
    res.sendFile(path.join(rootDir, "views", "shop.html"));
});
