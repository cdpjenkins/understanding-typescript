import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
    res.status(200).send("yup, definitely a shop here\n");
});

export default router;