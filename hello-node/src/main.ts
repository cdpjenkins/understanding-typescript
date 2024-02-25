import express from "express";
import * as bodyParser from "body-parser";
import path from "path";

import * as todos from "./routes/todos";
import * as admin from "./routes/admin";
import * as shop  from "./routes/shop";
import {rootDir} from "./util/path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static( path.join(rootDir, "public")));

app.use("/todos", todos.router);
app.use("/admin", admin.router);
app.use(shop.router);


app.use((req, res, _) => {
    res.status(404).render('404', { pageTitle: "Page totally not found!!!1" } );
});

app.use((err: Error, req: express.Request, res: express.Response, _: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);

