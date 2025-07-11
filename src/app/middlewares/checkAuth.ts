/* eslint-disable no-console */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";


export const checkAuth = (...authRoles:string[]) =>  async (req:Request, res:Response, next:NextFunction)=>{
try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
        throw new AppError(403, "No Token Recieved")
    }
    // const verifiedToken = jwt.verify(accessToken, 'secret')
    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
    //  if(!verifiedToken){
    //     console.log(verifiedToken)
    //     throw new AppError(403, `You are not authorized ${verifiedToken}`)
    // }
    // if((verifiedToken as JwtPayload).role !== Role.ADMIN){
    //     throw new AppError(403, "You are not permitted to view this route!!!")
    // }
    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "You are not permitted to view this route!!!")
    }
    console.log(verifiedToken)
    req.user = verifiedToken
    next()
} catch (error) {
    console.log("verifie Error", error)
    next(error)
}
}