import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("TENANT"), rentalRequestController.createRentalRequest)
router.get("/", auth("LANDLORD"), rentalRequestController.getRentalRequests)
router.get("/myRequests", auth("TENANT"), rentalRequestController.myRentalRequests)
router.patch("/:id", auth("LANDLORD"), rentalRequestController.updateRentalRequestStatus)

export const rentalRequestRoutes = router