import {  Router } from "express";

import { userController } from "./user.controller";

const router = Router()

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

export const userRoutes = router