import { Request, Response } from "express";
import httpStatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {

    const userData = await req.body; // Getting user data from req
    const createUser = await userService.createUser(userData) // creating user in database

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully!",
        data: createUser
    });
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const loginUser = userService.loginUser(payload)
    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User logged in successfully",
        data: loginUser
    })
})

export const userController = {
    createUser,
    loginUser
}