import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IUser } from "./userInterface";


const createUser = async (payload: IUser) => {
    const { name, email, password } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExists) {
        throw new Error("This user already exists")
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    // creating user
    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
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
    const userInDb = await prisma.user.findUniqueOrThrow({
        where: { email: email }
    })

    const isPasswordMatched = await bcrypt.compare(password, userInDb.password)

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect")
    }

    // Creating jwt payLoad using user data
    // const jwtPayload = {
    //     id: userInDb.id,
    //     name: userInDb.name,
    //     email: userInDb.email,
    //     role: userInDb.role
    // }

    // Creating accessToken
}

export const userService = {
    createUser,
    loginUser
}