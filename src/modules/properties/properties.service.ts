import { prisma } from "../../lib/prisma"
import { IProperty } from "./properties.interface";

const createProperty = async (
    landlordId: string,
    payload: IProperty
) => {

    const {
        title,
        description,
        address,
        city,
        rent,
        bedrooms,
        bathrooms,
        amenities,
        categoryId
    } = payload;

    // Required field validation
    if (!title || title.trim() === "") {
        throw new Error("Title is required");
    }

    if (!description || description.trim() === "") {
        throw new Error("Description is required");
    }

    if (!address || address.trim() === "") {
        throw new Error("Address is required");
    }

    if (!city || city.trim() === "") {
        throw new Error("City is required");
    }

    if (rent === undefined || rent === null) {
        throw new Error("Rent is required");
    }

    if (bedrooms === undefined || bedrooms === null) {
        throw new Error("Bedrooms are required");
    }

    if (bathrooms === undefined || bathrooms === null) {
        throw new Error("Bathrooms are required");
    }

    if (!amenities || amenities.length === 0) {
        throw new Error("At least one amenity is required");
    }

    if (!categoryId) {
        throw new Error("Category is required");
    }

    // Type validation
    if (typeof title !== "string") {
        throw new Error("Title must be a string");
    }

    if (typeof description !== "string") {
        throw new Error("Description must be a string");
    }

    if (typeof address !== "string") {
        throw new Error("Address must be a string");
    }

    if (typeof city !== "string") {
        throw new Error("City must be a string");
    }

    if (typeof rent !== "number") {
        throw new Error("Rent must be a number");
    }

    if (typeof bedrooms !== "number") {
        throw new Error("Bedrooms must be a number");
    }

    if (typeof bathrooms !== "number") {
        throw new Error("Bathrooms must be a number");
    }

    if (!Array.isArray(amenities)) {
        throw new Error("Amenities must be an array");
    }

    // Business validation
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // Create property
    const property = await prisma.property.create({
        data: {
            title,
            description,
            address,
            city,
            rent,
            bedrooms,
            bathrooms,
            amenities,
            landlordId,
            categoryId
        },
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            category: true
        }
    });

    return property;
};

const getAllProperty = async () => {
    const properties = await prisma.property.findMany({
        where: {
            isAvailable: true
        },
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true
        }
    })

    return properties
}

const getSingleProperty = async (id: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: id
        },
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true,
            reviews: {
                include: {
                    tenant: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    return property
}

export const propertyService = {
    createProperty,
    getAllProperty,
    getSingleProperty
}