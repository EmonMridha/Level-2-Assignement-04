import { Request, Response } from "express";
import { propertyService } from "./properties.service";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "../users/user.service";
import httpStatus from 'http-status'

const createProperty = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const landLordId = req.user?.id
    const createProperty = await propertyService.createProperty(landLordId as string, payload)
    res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: createProperty
    })
})

// Public
const getAllProperties = async (req: Request, res: Response) => {
    const properties = await propertyService.getAllProperty(req.query);
    res.status(200).json({
        success: true,
        message: "Property retrieved successfully",
        data: properties
    });
}

// Admin
const allProperties = catchAsync(async (req: Request, res: Response) => {
    const properties = await propertyService.getAllProperties()

    res.status(httpStatus.OK).json({
        success: true,
        message: "All properties for ADMIN retrieved successfully!",
        data: properties
    });
})

const getSingleProperty = async (req: Request, res: Response) => {

    const id = req.params.id // Getting id from url

    if (!id) {
        throw new Error("Property id is required");
    }

    const property = await propertyService.getSingleProperty(id as string);

    res.status(200).json({
        success: true,
        message: "Property retrieved successfully",
        data: property
    });
}

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
        throw new Error("Property id is required");
    }

    const landlordId = req.user!.id;

    const updatedProperty = await propertyService.updateProperty(
        id as string,
        landlordId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty
    });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const landlordId = req.user?.id

    if (!id) {
        throw new Error("Property id is required")
    }

    const result = await propertyService.deleteProperty(id as string, landlordId as string)

    res.status(200).json({
        success: true,
        message: "Property deleted successfully"
    });
})

export const propertyController = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
    allProperties
}