import { prisma } from "../../lib/prisma";


const createRentalRequest = async (
    userId: string,
    payload: {
        propertyId: string;
        moveInDate: Date;
        message?: string;
    }
) => {

    const { propertyId, moveInDate, message } = payload;

    // Validation
    if (!propertyId) {
        throw new Error("Property id is required");
    }

    if (!moveInDate) {
        throw new Error("Move in date is required");
    }

    // Check property exists
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    });

    if (!property) {
        throw new Error("Property not found");
    }

    // Check availability
    if (!property.isAvailable) {
        throw new Error("This property is not available");
    }

    // Tenant cannot request own property
    if (property.landlordId === userId) {
        throw new Error("You cannot submit a rental request for your own property");
    }

    // Prevent duplicate pending request
    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId: userId,
            propertyId,
            status: "PENDING"
        }
    });

    if (existingRequest) {
        throw new Error("You already have a pending request for this property");
    }

    // Create rental request
    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId: userId,
            propertyId,
            moveInDate,
            message
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    rent: true
                }
            }
        }
    });

    return rentalRequest;
};

const getRentalRequests = async (landlordId: string) => {

    const requests = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            }
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    rent: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return requests;
};


export const rentalRequestService = {
    getRentalRequests,
    createRentalRequest
}