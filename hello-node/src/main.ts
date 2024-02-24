import express from "express";
import { json } from "body-parser";
import path from "path";

import * as todos from "./routes/todos";
import * as admin from "./routes/admin";
import * as shop  from "./routes/shop";
import {rootDir} from "./util/path";

const app = express();

app.use(json());

app.use(express.static( path.join(rootDir, "public")));

app.use("/todos", todos.router);
app.use("/admin", admin.router);
app.use(shop.router);


app.use((req, res, _) => {
    res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.use((err: Error, req: express.Request, res: express.Response, _: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);

