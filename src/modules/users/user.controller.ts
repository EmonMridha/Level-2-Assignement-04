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
    const payload = await req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(payload)

    // Sending the accessToken to cookie
    res.cookie(
        "accessToken",
        accessToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 // 24 hour
        }
    )

    // Sending the refreshToken to cookie
    res.cookie(
        "refreshToken",
        refreshToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        }
    )


    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User logged in successfully",
        data: { user }
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new Error("Unauthorized");
    }

    const id = req.user?.id; // Getting the user id from the request

    const user = await userService.myProfile(id as string)

    res.status(httpStatus.OK).json({
        success: true,
        message: "User data retrieved successfully",
        data: user
    })

})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.status(httpStatus.OK).json({
        success: true,
        message: "All users retrieved successfully",
        data: users
    })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body.status;
    const update = await userService.updateUser(id as string, status)

    res.status(httpStatus.OK).json({
        success: true,
        message: "User updated successfully!",
        data: update
    });
})


export const userController = {
    createUser,
    loginUser,
    getMyProfile,
    getAllUsers,
    updateUser
}