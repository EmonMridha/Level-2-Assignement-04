import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rentalRequest.service";

// Tenant
const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await rentalRequestService.createRentalRequest(userId as string, req.body);

    res.status(201).json({
        success: true,
        message: "Rental request submitted successfully",
        data: result
    });
});

// Public
const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const landLordId = req.user?.id; //  Getting the user id from req

    const result = await rentalRequestService.getRentalRequests(landLordId as string);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Rental requests retrieved successfully",
        data: result
    });
});

//  Landlords
const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const requestId = req.params.id;

    if (!requestId) {
        throw new Error("Rental request id is required");
    }

    const { status } = req.body;

    const result = await rentalRequestService.updateRentalRequest(requestId as string, userId as string, status);

    res.status(200).json({
        success: true,
        message: "Rental request updated successfully",
        data: result
    });
});

// Tenant
const myRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const requests = await rentalRequestService.myRequests(userId as string)

    res.status(httpStatus.OK).json({
        success: true,
        message: "Rental requests retrieved successfully",
        data: requests
    });
})

// Tenant 
const mySingleRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const requestId = req.params.id;
    const userId = req.user?.id;

    const singleRequest = await rentalRequestService.mySingleRequest(userId as string, requestId as string)

    res.status(httpStatus.OK).json({
        success: true,
        message: "Rental requests retrieved successfully",
        data: singleRequest
    });
})

export const rentalRequestController = {
    createRentalRequest,
    getRentalRequests,
    updateRentalRequestStatus,
    myRentalRequests,
    mySingleRentalRequest
};