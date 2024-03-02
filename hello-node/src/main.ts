import express from "express";
import * as bodyParser from "body-parser";
import path from "path";

import * as todos from "./routes/todos";
import * as admin from "./routes/admin";
import * as shop  from "./routes/shop";
import {rootDir} from "./util/path";
import * as errorController from "./controllers/error-controller";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static( path.join(rootDir, "public")));

app.use("/todos", todos.router);
app.use("/admin", admin.router);
app.use(shop.router);

app.use(errorController.handle404);

app.use(errorController.handleServerError);

app.listen(3000);
