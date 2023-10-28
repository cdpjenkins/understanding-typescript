import express from "express";
import { json } from "body-parser";

import todosRouter from "./routes/todos";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";

const app = express();

app.use(json());

app.use("/todos", todosRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);

app.use((req, res, next) => {
    res.status(404).send("<html><body><h1>Not found!!!1</body></html>\n");
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);

