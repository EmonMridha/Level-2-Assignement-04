import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), userController.getMyProfile)

export const userRoutes = router