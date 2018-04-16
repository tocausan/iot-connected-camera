import {Router, Request, Response, NextFunction} from 'express';

export const UserRoutes = Router()

    .get('/', (req: Request, res: Response, next: NextFunction) => {
        res.json('users');
    });


