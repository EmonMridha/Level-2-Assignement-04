import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { propertyController } from "../properties/properties.controller";

const router = Router()

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/users", auth('ADMIN'), userController.getAllUsers)
router.get("/me", auth('ADMIN', 'LANDLORD', 'TENANT'), userController.getMyProfile)
router.get("/admin/properties", auth("ADMIN"), propertyController.allProperties)
router.patch("/updateMe", auth('ADMIN', 'LANDLORD', 'TENANT'), userController.manageUser)
router.patch("/users/:id", auth('ADMIN'), userController.updateUser)
export const userRoutes = router