import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/users", auth('ADMIN'), userController.getAllUsers)
router.get("/me", auth('ADMIN', 'LANDLORD', 'TENANT'), userController.getMyProfile)
router.get("/properties", auth("ADMIN"), userController.allProperties)
router.patch("/users/:id", auth('ADMIN'), userController.updateUser)
export const userRoutes = router