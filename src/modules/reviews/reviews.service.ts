import { prisma } from "../../lib/prisma"
import { IReview } from "./reviews.interface";



const createReview = async (userId: string, payload: IReview) => {

    const { propertyId, rating, comment } = payload;

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    // Verify the tenant has successfully rented this property
    const completedRental = await prisma.rentalRequest.findFirst({
        where: {
            tenantId: userId,
            propertyId,
            payment: {
                status: "COMPLETED"
            }
        }
    });

    if (!completedRental) {
        throw new Error(
            "You can only review properties you have successfully rented"
        );
    }

    // Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
        where: {
            tenantId: userId,
            propertyId
        }
    });

    if (existingReview) {
        throw new Error("You have already reviewed this property");
    }

    const review = await prisma.review.create({
        data: {
            tenantId: userId,
            propertyId,
            rating,
            comment
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true
                }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true
                }
            }
        }
    });
    return review;
};

export const reviewService = {
    createReview
}