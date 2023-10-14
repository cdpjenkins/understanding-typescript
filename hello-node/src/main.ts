import express from "express";
import { json } from "body-parser";

import router from "./routes/todos";

const app = express();

app.use(json());

app.use("/todos", router);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3000);

