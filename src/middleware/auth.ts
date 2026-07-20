import { Request, Response } from "express"
import { Role } from "../../generated/prisma/enums"
import { catchAsync } from "../utils/catchAsync"
import { jwtUtils } from "../utils/jwt"
import config from "../config"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma"

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


export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: Function) => {
        const accessToken = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization

        if (!accessToken) {
            throw new Error("Your are not logged in. Please login first")
        }

        // finding the jwt payload of the accessToken
        const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

        if (!verifiedToken.success) {
            throw new Error("Problem occured verifying token")
        }

        const { email, name, id, role } = verifiedToken.data as JwtPayload

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this route")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        if (user.status === "BLOCKED") {
            throw new Error("Your account is blocked. Please contact support")
        }

        req.user = {
            email: user.email,
            name: user.name,
            id: user.id,
            role: user.role
        }
        next()
    }

    )
}
