import { Request, Response } from "express";
import { propertyService } from "./properties.service";
import { catchAsync } from "../../utils/catchAsync";

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

const getAllProperties = async (req: Request, res: Response) => {
    const properties = await propertyService.getAllProperty(req.query);
    res.status(200).json({
        success: true,
        message: "Property retrieved successfully",
        data: properties
    });
}

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

export const propertyController = {
    createProperty,
    getAllProperties,
    getSingleProperty,
}