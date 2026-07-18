import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
                errorDetails: {
                    message: err.message,
                },
            })
        }
    }
}