import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// Tenant
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

    if (message && message.trim() === "") {
        throw new Error("Message cannot be empty");
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

// Landlord
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

//ADMIN
const allRequests = async () => {
    const requests = await prisma.rentalRequest.findMany();

    return requests;
}

// Tenant
const myRequests = async (userId: string) => {
    const requests = await prisma.rentalRequest.findMany({
        where: {
            tenantId: userId
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    rent: true,
                    isAvailable: true
                }
            }
        }
    })

    return requests
}

// Tenant
const mySingleRequest = async (userId: string, requestId: string) => {
    const request = await prisma.rentalRequest.findFirst({
        where: {
            id: requestId,
            tenantId: userId
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    rent: true,
                    isAvailable: true
                }
            }
        }
    })

    return request
}

// Landlord
const updateRentalRequest = async (requestId: string, userId: string, status: RentalRequestStatus) => {

    if (!status) {
        throw new Error("Status is required");
    }

    if (!requestId) {
        throw new Error("Rental request ID is required");
    }

    // Convert status to uppercase
    const uppercaseStatus = status.toUpperCase() as RentalRequestStatus;

    // Check status
    if (uppercaseStatus !== "APPROVED" && uppercaseStatus !== "REJECTED") {
        throw new Error("Status must be APPROVED or REJECTED");
    }

    // Find rental request
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId
        },
        include: {
            property: true
        }
    });

    if (!rentalRequest) {
        throw new Error("Rental request not found");
    }

    // Check ownership
    if (rentalRequest.property.landlordId !== userId) {
        throw new Error("You are not authorized to update this rental request");
    }

    // Prevent updating twice (optional but recommended)
    if (rentalRequest.status !== "PENDING") {
        throw new Error("This rental request has already been processed");
    }

    // Update status
    const updatedRequest = await prisma.rentalRequest.update({
        where: {
            id: requestId
        },
        data: {
            status: uppercaseStatus
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

    return updatedRequest;
}

export const rentalRequestService = {
    getRentalRequests,
    createRentalRequest,
    updateRentalRequest,
    myRequests,
    mySingleRequest,
    allRequests
}