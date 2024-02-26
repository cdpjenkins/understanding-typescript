import { RequestHandler, Request, Response, NextFunction } from "express" ;

export const handle404: RequestHandler = (req, res, _) => {
    res.status(404).render('404', {
        pageTitle: "Page totally not found!!!1",
        path: ""
    } );
}

export const handleServerError = (err: Error, req: Request, res: Response, _: NextFunction) => {
    res.status(500).json({message: err.message});
}
