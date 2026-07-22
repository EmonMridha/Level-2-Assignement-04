import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import httpStatus from "http-status"


// Tenant
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


// Tenant
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
        message: "Payment verified and completed successfully! Congrats, you have successfully rented the property",
        data: result
    });
});


// Tenant
const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const histories = await paymentService.paymentHistory(userId as string)

    res.status(httpStatus.OK).json({
        success: true,
        message: "Payment history retrieved successfully!!!",
        data: histories
    });
})


const getSinglePaymentHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const paymentId = req.params.id;
    const history = await paymentService.singlePaymentHistory(paymentId as string, userId as string)

    res.status(httpStatus.OK).json({
        success: true,
        message: "Payment verified and completed successfully! Congrats, you have successfully rented the property",
        data: history
    });
})

export const paymentController = {
    createCheckoutSession,
    confirmPayment,
    getPaymentHistory,
    getSinglePaymentHistory
}