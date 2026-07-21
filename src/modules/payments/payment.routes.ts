import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/create", auth("TENANT"), paymentController.createCheckoutSession)

router.post("/confirm", auth("TENANT"), paymentController.confirmPayment)

export const paymentRoutes = router