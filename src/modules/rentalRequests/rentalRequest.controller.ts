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

// Tenant
const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const landLordId = req.user?.id; //  Getting the user id from req

    const result = await rentalRequestService.getRentalRequests(landLordId as string);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Rental requests retrieved successfully",
        data: result
    });
});

// // Tenant
// const getSingleRentalRequest = catchAsync(async (req: Request, res: Response) => {
//     const tenantId = req.user!.id;
//     const id = req.params.id;

//     if (!id) {
//         throw new Error("Rental request id is required");
//     }

//     const result = await rentalRequestService.getSingleRentalRequest(
//         id,
//         tenantId
//     );

//     res.status(httpStatus.OK).json({
//         success: true,
//         message: "Rental request retrieved successfully",
//         data: result
//     });
// });

// // Landlord
// const getLandlordRentalRequests = catchAsync(async (req: Request, res: Response) => {
//     const landlordId = req.user!.id;

//     const result = await rentalRequestService.getLandlordRentalRequests(
//         landlordId
//     );

//     res.status(httpStatus.OK).json({
//         success: true,
//         message: "Rental requests retrieved successfully",
//         data: result
//     });
// });

// // Landlord
// const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
//     const landlordId = req.user!.id;
//     const id = req.params.id;

//     if (!id) {
//         throw new Error("Rental request id is required");
//     }

//     const result = await rentalRequestService.updateRentalRequestStatus(
//         id,
//         landlordId,
//         req.body
//     );

//     res.status(httpStatus.OK).json({
//         success: true,
//         message: "Rental request updated successfully",
//         data: result
//     });
// });

export const rentalRequestController = {
    createRentalRequest,
    getRentalRequests,
    // getSingleRentalRequest,
    // getLandlordRentalRequests,
    // updateRentalRequestStatus
};