import { Router } from "express";
import { propertyController } from "./properties.controller";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.LANDLORD), propertyController.createProperty)

router.get("/", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), propertyController.getAllProperties)

router.get("/:id", propertyController.getSingleProperty)

export const propertyRoutes = router