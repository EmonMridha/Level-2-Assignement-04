import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSession = async (
    userId: string,
    rentalRequestId: string
) => {

    // Find the rental request
    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            id: rentalRequestId,
            tenantId: userId,
            status: "APPROVED"
        },
        include: {
            property: true,
            payment: true
        }
    });

    if (!rentalRequest) {
        throw new Error("Approved rental request not found");
    }

    // Prevent duplicate payment
    if (rentalRequest.payment) {
        throw new Error("This rental request has already been paid");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
            {
                price_data: {
                    currency: "bdt", // or another Stripe-supported currency
                    product_data: {
                        name: rentalRequest.property.title,
                        description: rentalRequest.property.city
                    },
                    unit_amount: Number(rentalRequest.property.rent) * 100
                },
                quantity: 1
            }
        ],

        metadata: {
            rentalRequestId: rentalRequest.id,
            tenantId: userId
        },

        success_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
    });
    
    return {
        sessionId: session.id,
        checkoutUrl: session.url
    };
};

export const paymentService = {
    createCheckoutSession
}