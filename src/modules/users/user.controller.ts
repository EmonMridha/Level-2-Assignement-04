import { Request, Response } from "express";
import httpStatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

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
    const { accessToken, refreshToken } = await userService.loginUser(payload)

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
        data: { accessToken, refreshToken }
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        throw new Error("Access token is missing");
    }

    // verifyToken 
    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

    if (typeof verifiedToken === "string") {
        throw new Error("Invalid token")
    }

    const user = await userService.myProfile(verifiedToken.id)

    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        data: user
    })

})

export const userController = {
    createUser,
    loginUser,
    getMyProfile
}