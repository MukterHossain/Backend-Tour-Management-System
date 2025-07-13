/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookies"

const credentialsLogin = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
        
        const loginInfo = await AuthServices.credentialsLogin(req.body)

        // res.cookie("accessToken", loginInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })

        // res.cookie("refreshToken", loginInfo.refreshToken, {
        //     httpOnly: true,
        //     secure: false
        // })
        setAuthCookie(res, loginInfo)
        

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Logged In Successfully",
            data: loginInfo
        })
})
const getNewAccessToken = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
        const refreshToken = req.cookies.refreshToken
        // const refreshToken = req.headers.authorization
        if(!refreshToken){
            throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
        }
        const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)
        // res.cookie("accessToken", tokenInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })

        setAuthCookie(res, tokenInfo)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "New Access Token Retrived  Successfully",
            data: tokenInfo
        })
})
const logout = catchAsync(async (req:Request, res:Response, next:NextFunction) => {

        res.clearCookie("accessToken",  {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.clearCookie("refreshToken",  {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Logged Out Successfully",
            data: null
        })
})




export const AuthControllers ={
    credentialsLogin,
    getNewAccessToken,
    logout,
}