import { Router } from "express";

const router = Router();

router.post("/product", (req, res, next) => {
    console.log(req.body);
    return res.redirect("/");
});

export default router;
