import { prisma } from "../../lib/prisma"
import { IProperty, IUpdateProperty } from "./properties.interface";

const createProperty = async (landlordId: string, payload: IProperty) => {
    const {
        title,
        description,
        address,
        city,
        rent,
        bedrooms,
        bathrooms,
        amenities,
        categoryId,
        images,
    } = payload;

    // ---- Type validation FIRST ----
    if (typeof title !== "string" || title.trim() === "") {
        throw new Error("Title is required and must be a string");
    }
    if (typeof description !== "string" || description.trim() === "") {
        throw new Error("Description is required and must be a string");
    }
    if (typeof address !== "string" || address.trim() === "") {
        throw new Error("Address is required and must be a string");
    }
    if (typeof city !== "string" || city.trim() === "") {
        throw new Error("City is required and must be a string");
    }
    if (typeof rent !== "number" || rent <= 0) {
        throw new Error("Rent must be a number greater than 0");
    }
    if (typeof bedrooms !== "number" || bedrooms < 1) {
        throw new Error("Bedrooms must be a number >= 1");
    }
    if (typeof bathrooms !== "number" || bathrooms < 1) {
        throw new Error("Bathrooms must be a number >= 1");
    }
    if (!Array.isArray(amenities) || amenities.length === 0) {
        throw new Error("At least one amenity is required");
    }
    if (amenities.some((a) => typeof a !== "string" || a.trim() === "")) {
        throw new Error("Amenities cannot contain empty values");
    }
    if (typeof categoryId !== "string" || categoryId.trim() === "") {
        throw new Error("Category is required");
    }

    // ---- Image validation ----
    if (!Array.isArray(images) || images.length === 0) {
        throw new Error("At least one image is required");
    }
    if (images.length > 10) {
        throw new Error("Maximum 10 images allowed");
    }
    for (const img of images) {
        if (!img || typeof img.url !== "string" || img.url.trim() === "") {
            throw new Error("Each image must have a valid url");
        }
    }

    // check if category exists
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new Error("Category not found");
    }

    // ---- Create ----
    const property = await prisma.property.create({
        data: {
            title: title.trim(),
            description: description.trim(),
            address: address.trim(),
            city: city.trim(),
            rent,
            bedrooms,
            bathrooms,
            amenities,
            landlordId,
            categoryId,
            images: {
                create: images.map((img, index) => ({
                    url: img.url,
                    publicId: img.publicId,
                    isPrimary: index === 0,
                    order: index,
                })),
            },
        },
        include: {
            landlord: {
                select: { id: true, name: true, email: true },
            },
            category: true,
            images: {
                select: { url: true, publicId: true, isPrimary: true, order: true } // returns all image fields
            }
        },
    });
    return property;
};

// Public
const getAllProperty = async (query: {
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: string;
    amenities?: string[];
}) => {

    const filter: any = {
        isAvailable: true
    };

    // Filter by city
    if (query.city) {
        filter.city = {
            contains: query.city,
            mode: "insensitive"
        };
    }

    // Filter by price
    if (query.minPrice || query.maxPrice) {
        filter.rent = {};

        if (query.minPrice) {
            filter.rent.gte = Number(query.minPrice);
        }

        if (query.maxPrice) {
            filter.rent.lte = Number(query.maxPrice);
        }
    }

    // Filter by category
    if (query.category) {
        filter.category = {
            name: {
                equals: query.category,
                mode: "insensitive"
            }
        };
    }

    // Filter by amenities
    if (query.amenities) {
        const amenities = Array.isArray(query.amenities)
            ? query.amenities
            : [query.amenities];

        filter.amenities = {
            hasSome: amenities,
        };
    }

    const properties = await prisma.property.findMany({
        where: filter,
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true,
            images: true
        }
    });

    return properties;
};

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

const updateProperty = async (id: string, landlordId: string, updates: IUpdateProperty) => {

    if (!id) {
        throw new Error("Property ID is required");
    }

    if (updates.amenities !== undefined) {
        if (!Array.isArray(updates.amenities)) {
            throw new Error("Amenities must be an array");
        }

        if (updates.amenities.length === 0) {
            throw new Error("At least one amenity is required");
        }

        if (
            updates.amenities.some(
                amenity => typeof amenity !== "string" || amenity.trim() === ""
            )
        ) {
            throw new Error("Amenities must contain non-empty strings");
        }
    }

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: id
        }
    });

    if (property.landlordId !== landlordId) {
        throw new Error("You are not authorized to update this property");
    }
    if (updates.title !== undefined) {
        if (!updates.title.trim()) {
            throw new Error("Title cannot be empty");
        }
    }

    if (updates.description !== undefined) {
        if (!updates.description.trim()) {
            throw new Error("Description cannot be empty");
        }
    }

    if (updates.address !== undefined) {
        if (!updates.address.trim()) {
            throw new Error("Address cannot be empty");
        }
    }

    if (updates.city !== undefined) {
        if (!updates.city.trim()) {
            throw new Error("City cannot be empty");
        }
    }

    if (updates.rent !== undefined) {
        if (typeof updates.rent !== "number" || updates.rent <= 0) {
            throw new Error("Rent must be a positive number");
        }
    }

    if (updates.bedrooms !== undefined) {
        if (typeof updates.bedrooms !== "number" || updates.bedrooms < 1) {
            throw new Error("Bedrooms must be at least 1");
        }
    }

    if (updates.bathrooms !== undefined) {
        if (typeof updates.bathrooms !== "number" || updates.bathrooms < 1) {
            throw new Error("Bathrooms must be at least 1");
        }
    }

    if (updates.categoryId !== undefined) {
        const category = await prisma.category.findUnique({
            where: { id: updates.categoryId }
        });

        if (!category) {
            throw new Error("Category not found");
        }
    }

    if (
        updates.isAvailable !== undefined &&
        typeof updates.isAvailable !== "boolean"
    ) {
        throw new Error("isAvailable must be a boolean");
    }

    // Updating property
    const result = await prisma.property.update({
        where: { id },
        data: updates,
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true
        }
    });
    return result;
};

const deleteProperty = async (id: string, landlordId: string) => {

    const property = await prisma.property.findUnique({
        where: {
            id: id
        }
    });

    if (!property) {
        throw new Error("Property not found");
    }

    if (property.landlordId !== landlordId) {
        throw new Error("You are not authorized to delete this property");
    }

    const deleteProp = await prisma.property.delete({
        where: {
            id
        }
    })
    return;
}


// Admin
const getAllProperties = async () => {
    const properties = await prisma.property.findMany()
    return properties
}

// landlord
const getMyProperties = async (userId: string) => {
    const properties = await prisma.property.findMany({
        where: {
            landlordId: userId
        }
    })
    return properties
}

export const propertyService = {
    createProperty,
    getAllProperty,
    getSingleProperty,
    updateProperty,
    deleteProperty,
    getAllProperties,
    getMyProperties
}