import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import httpStatus from "http-status"

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const { rentalRequestId } = req.body

    const result = await paymentService.createCheckoutSession(userId as string, rentalRequestId)

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Checkout session created successfully",
        data: {
            checkoutUrl: result.checkoutUrl
        }
    })
})

export const paymentController = {
    createCheckoutSession
}