import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("TENANT"), rentalRequestController.createRentalRequest)
router.get("/", auth("LANDLORD"), rentalRequestController.getRentalRequests)
router.get("/admin", auth("ADMIN"), rentalRequestController.getAllRequests)
router.get("/myRequests", auth("TENANT"), rentalRequestController.myRentalRequests)
router.get("/myRequests/:id", auth("TENANT"), rentalRequestController.mySingleRentalRequest)
router.patch("/:id", auth("LANDLORD"), rentalRequestController.updateRentalRequestStatus)

export const rentalRequestRoutes = router