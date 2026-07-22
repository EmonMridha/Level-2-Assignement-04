import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IUser } from "./userInterface";
import { SignOptions } from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwt";
import { Role, UserStatus } from "../../../generated/prisma/enums";


const createUser = async (payload: IUser) => {
    const { name, email, password, phone } = payload;
    const role = payload.role?.toUpperCase() as Role;

    if (!Object.values(Role).includes(role)) {
        throw new Error("Invalid role");
    }

    if (role === Role.ADMIN) {
        throw new Error("You cannot register as an admin");
    }

    if (!name || name.trim() === "") {
        throw new Error("Name is required");
    }

    if (!email || email.trim() === "") {
        throw new Error("Email is required");
    }

    if (phone && phone.trim() === "") {
        throw new Error("Phone number cannot be empty");
    }

    if (!password || password.trim() === "") {
        throw new Error("Password is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
    }

    // Check if user already exists
    const isUserExists = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExists) {
        throw new Error("This user already exists")
    }

    // Hashing the pass
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    // creating user
    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone
        }
    });

    // Getting created user data
    const user = await prisma.user.findUnique({
        where: { email },
        omit: { password: true }
    })
    return user
}

const loginUser = async (payload: { email: string, password: string }) => {
    const { email, password } = payload

    if (!email || email.trim() === "") {
        throw new Error("Email is required");
    }

    if (!password || password.trim() === "") {
        throw new Error("Password is required");
    }

    // Finding user by email
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: email }
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    // Creating accessToken
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    // Creating refreshToken
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    return { user, accessToken, refreshToken }
}

const myProfile = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true }
    })
    return user
}

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        }
    });

    return users
}

const updateUser = async (id: string, status: UserStatus) => {

    const uppercaseStatus = status.toUpperCase()
    if (
        uppercaseStatus !== UserStatus.ACTIVE &&
        uppercaseStatus !== UserStatus.BLOCKED
    ) {
        throw new Error("Status must be ACTIVE or BLOCKED");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            status: uppercaseStatus as UserStatus
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return updatedUser;
};


export const userService = {
    createUser,
    loginUser,
    myProfile,
    getAllUsers,
    updateUser
}