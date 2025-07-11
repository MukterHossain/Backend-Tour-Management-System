/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../errorHelpers/AppError";

// type AsyncHandler = (req:Request, res:Response, next:NextFunction) => Promise<void>

// const catchAsync = (fn: AsyncHandler) => (req:Request, res:Response, next:NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any) =>{
//         console.log(err)
//         next(err)
//     })
// }


// const createUser = async (req:Request, res:Response, next:NextFunction) => {
//     try {
//         // throw new Error("Fack error")
//         // throw new AppError(httpStatus.BAD_REQUEST, "Fack Error")
//         const user = await userService.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: "User Created Successfully",
//             user
//         })
//     } catch (err:any) {
//         console.log(err)
//         next(err)
//     }
// }
const createUser = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const user = await userService.createUser(req.body)
        // res.status(httpStatus.CREATED).json({
        //     message: "User Created Successfully",
        //     user
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Created Successfully",
            data: user
        })
})


// const getAllUsers = async (req:Request, res:Response, next:NextFunction) => {
//     try {
//         const users = await userService.getAllUsers()
//         return users
//         // res.status(httpStatus.CREATED).json({
//         //     message: "User Created Successfully",
//         //     users
//         // })
//     } catch (err:any) {
//         console.log(err)
//         next(err)
//     }
// }

const getAllUsers = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const result = await userService.getAllUsers()
        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "All Users Retrived Successfully",
        //     users
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "All Users Retrived Successfully",
            data: result.data,
            meta: result.meta
        })
})


const updateUser = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body
    const user = await userService.updateUser(userId, payload, verifiedToken)
        // res.status(httpStatus.CREATED).json({
        //     message: "User Created Successfully",
        //     user
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Updated Successfully",
            data: user
        })
})



export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}