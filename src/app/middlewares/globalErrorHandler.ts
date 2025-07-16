/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";



export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(envVars.NODE_ENV === "development"){
        console.log(err)
    }
    
    // const statusCode = 500;
    // const message = `Something went Wrong!! ${err.message}`
    let statusCode = 500;
    let message = `Something went Wrong!!`

    /**
     * Mongoose
     * - duplicate
     * - cast error
     */

    let errorSources: TErrorSources[] = []
    // Duplicate Error
    // if(err.code === 11000){
    //     console.log("Duplicate error")
    //     const matchArray = err.message.match(/"([^"]*)"/)
    //     statusCode= 400;
    //     message= `${matchArray[1]} already exists!!`
    // }
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object Id error / cast Error
    // else if(err.name === "CastError"){
    //     statusCode = 400;
    //     message= "Invalid MongoDB ObjectId. Please valid Id"
    // }
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }

    // Zod error
    // else if (err.name === "ZodError") {
    //     statusCode = 400
    //     message = "Zod Error"

    //     console.log(err.issues)
    //     err.issues.forEach((issue: any) => {
    //         errorSources.push({
    //             path: issue.path[issue.path.length - 1],
    //             message: issue.message
    //         })
    //     })
    // }
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }

    // Mongoose validation Error
    // else if (err.name === "ValidationError") {
    //     statusCode = 400;
    //     const errors = Object.values(err.errors)

    //     errors.forEach((errorObject: any) => errorSources.push({
    //         path: errorObject.path,
    //         message: errorObject.message
    //     }))
    //     // message= err.message
    //     message = "Validation Error"
    // }
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }


    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(500).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}