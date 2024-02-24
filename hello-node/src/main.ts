import express from "express";
import { json } from "body-parser";
import path from "path";

import todosRouter from "./routes/todos";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import {rootDir} from "./util/path";

const app = express();

app.use(json());

app.use("/public", express.static( path.join(rootDir, "public")));

app.use("/todos", todosRouter);
app.use("/admin", adminRouter);
app.use(shopRouter);


app.use((req, res, _) => {
    res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.use((err: Error, req: express.Request, res: express.Response, _: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);

