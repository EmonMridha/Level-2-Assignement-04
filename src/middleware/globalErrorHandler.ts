// import { NextFunction, Request, Response } from "express";
// import httpStatus from 'http-status'
// import { Prisma } from "../../generated/prisma/client";
// import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/client";

// export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

//     let statusCode
//     let errorMessage = err.message || "Internal server Error"
//     let errorName = err.name || "Internal server Error"

//     if (err instanceof Prisma.PrismaClientValidationError) {
//         statusCode = httpStatus.BAD_REQUEST;
//         errorMessage = "You have provided incorrect field type or missing fields"
//     } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         if (err.code === "P2002") {
//             statusCode = httpStatus.BAD_REQUEST,
//                 errorMessage = "Foreign key constraint failed"
//         } else if (err.code === '2025') {
//             statusCode = httpStatus.BAD_REQUEST,
//                 errorMessage = "An operation failed"
//         }
//     }
//     else if (err instanceof Prisma.PrismaClientInitializationError) {
//         if (err.errorCode === "P1000") {
//             statusCode = httpStatus.UNAUTHORIZED;
//             errorMessage = "Authentication error"
//         } else if (err.errorCode === "P1001") {
//             statusCode = "Can't reach database server"
//         }
//     } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//         statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//         errorMessage = "Error occured during query execution"
//     }

//     res.status(500).json({
//         success: false,
//         statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
//         message: errorMessage,
//         name: errorName,
//         error: err.stack
//     });
// }