import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("TENANT"), rentalRequestController.createRentalRequest)
router.get("/", auth("LANDLORD"), rentalRequestController.getRentalRequests)


export const rentalRequestRoutes = router