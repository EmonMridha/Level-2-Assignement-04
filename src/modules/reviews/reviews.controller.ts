import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./reviews.service";
import httpStatus from "http-status"

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await reviewService.createReview(userId as string, payload)

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Review submitted successfully",
        data: result
    });
})

export const reviewController = {
    createReview
}