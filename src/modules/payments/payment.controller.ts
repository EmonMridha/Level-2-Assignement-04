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
            checkoutUrl: result.checkoutUrl,
            sessionId: result.sessionId

        }
    })
})

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { sessionId } = req.body;

    if (!sessionId) {
        throw new Error("Session id is required");
    }

    const result = await paymentService.confirmPayment(
        userId as string,
        sessionId
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: "Payment verified successfully",
        data: result
    });
});

export const paymentController = {
    createCheckoutSession,
    confirmPayment
}