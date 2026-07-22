import { Router } from "express";
import { propertyController } from "./properties.controller";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { userController } from "../users/user.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.LANDLORD), propertyController.createProperty)
router.get("/", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), propertyController.getAllProperties)
router.get("/:id", propertyController.getSingleProperty)
router.patch("/:id", auth(Role.LANDLORD), propertyController.updateProperty)
router.delete("/:id", auth(Role.LANDLORD, Role.ADMIN), propertyController.deleteProperty)

export const propertyRoutes = router