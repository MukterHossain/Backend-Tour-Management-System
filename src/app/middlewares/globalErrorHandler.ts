/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";



const handleDuplicateError =(err: any) =>{
    const matchArray = err.message.match(/"([^"]*)"/)
        return {
            statusCode: 400,
        message:`${matchArray[1]} already exists!!`
        }
}
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    // const statusCode = 500;
    // const message = `Something went Wrong!! ${err.message}`
    let statusCode = 500;
    let message = `Something went Wrong!!`

    /**
     * Mongoose
     * - duplicate
     * - cast error
     */

    const errorSources :any =[]
    // Duplicate Error
    // if(err.code === 11000){
    //     console.log("Duplicate error")
    //     const matchArray = err.message.match(/"([^"]*)"/)
    //     statusCode= 400;
    //     message= `${matchArray[1]} already exists!!`
    // }
    if(err.code === 11000){
        const simplifiedError = handleDuplicateError(err)
        statusCode= simplifiedError.statusCode;
        message= `${matchArray[1]} already exists!!`
    }
    // Object Id error / cast Error
    else if(err.name === "CastError"){
        statusCode = 400;
        message= "Invalid MongoDB ObjectId. Please valid Id"
    }

    else if(err.name === "ZodError"){
        statusCode = 400
        message= "Zod Error"

        console.log(err.issues)
        err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
        })
    }

    // Mongoose validation Error
    else if(err.name === "ValidationError"){
        statusCode = 400;
        const errors = Object.values(err.errors)
        
        errors.forEach((errorObject:any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        // message= err.message
        message= "Validation Error"
    }

    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }
    else if(err instanceof Error){
        statusCode = 500
        message = err.message
    }
    res.status(500).json({
        success:false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}