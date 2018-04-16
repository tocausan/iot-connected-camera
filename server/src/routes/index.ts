import {Router, Request, Response, NextFunction} from 'express';
import {UserRoutes} from "./users";
import {ErrorRoutes} from "./errors";

export const Routes = Router()

    .get('/', (req: Request, res: Response, next: NextFunction) => {
        res.json('index');
    })

    .use('/users', UserRoutes)
    .use(ErrorRoutes);
