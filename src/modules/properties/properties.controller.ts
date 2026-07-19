import { Request, Response } from "express";
import { propertyService } from "./properties.service";

const getAllProperties = async (req: Request, res: Response) => {
    const properties = await propertyService.getAllProperty();
    res.status(200).json({
        success: true,
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
    getAllProperties,
    getSingleProperty
}