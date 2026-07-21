import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSession = async (
    userId: string,
    rentalRequestId: string
) => {

    if (!rentalRequestId) {
        throw new Error("Rental request id is required");
    }

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

const confirmPayment = async (
    userId: string,
    sessionId: string
) => {

    if (!sessionId) {
        throw new Error("Session id is required");
    }
    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment
    if (session.payment_status !== "paid") {
        throw new Error("Payment has not been completed");
    }

    // Read metadata
    const rentalRequestId = session.metadata?.rentalRequestId;
    const tenantId = session.metadata?.tenantId;

    if (!rentalRequestId || !tenantId) {
        throw new Error("Invalid payment session");
    }

    // Ensure the logged-in tenant owns this payment
    if (tenantId !== userId) {
        throw new Error("You are not authorized to verify this payment");
    }

    // Check rental request
    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            id: rentalRequestId,
            tenantId: userId,
            status: "APPROVED"
        }
    });

    if (!rentalRequest) {
        throw new Error("Rental request not found");
    }

    // Prevent duplicate payment
    const existingPayment = await prisma.payment.findUnique({
        where: {
            rentalRequestId
        }
    });

    if (existingPayment) {
        throw new Error("Payment has already been recorded");
    }

    // Save payment
    const payment = await prisma.payment.create({
        data: {
            rentalRequestId,
            transactionId: session.payment_intent as string,
            amount: Number(session.amount_total!) / 100,
            provider: "STRIPE",
            status: "COMPLETED",
            paidAt: new Date()
        },
        include: {
            rentalRequest: {
                include: {
                    property: true
                }
            }
        }
    });

    return payment;
};

export const paymentService = {
    createCheckoutSession,
    confirmPayment
}