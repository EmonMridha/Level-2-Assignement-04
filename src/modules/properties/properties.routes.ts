import { Router } from "express";
import { propertyController } from "./properties.controller";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";


const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role
            }
        }
    }
}

router.post("/", auth(Role.ADMIN, Role.LANDLORD), propertyController.createProperty)

router.get("/", propertyController.getAllProperties)

router.get("/:id", propertyController.getSingleProperty)

export const propertyRoutes = router