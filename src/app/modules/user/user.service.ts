import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpstatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) =>{
    // const {name, email, password} = payload;
    const {email, password, ...rest} = payload;
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpstatus.BAD_REQUEST, "User Alreday Exist")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    // const isPasswordMatched = await bcrypt.compare(password as string, hashedPassword)
    // console.log(isPasswordMatched)
    // console.log(password, hashedPassword)

    const authProvider: IAuthProvider = {provider: "credential", providerId: email as string}

        const user = await User.create({
            // name,
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        })
        return user  
}

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload)=>{

    const ifUserExist = await User.findById(userId)
    if(!ifUserExist){
        throw new AppError(httpstatus.NOT_FOUND, "User not Found")
    }
    


    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized")
        }
        if(payload.role === Role.SUPER_ADMIN &&  decodedToken.role === Role.ADMIN){
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized")
        }
    }
    if(payload.isActive || payload.isDeleted || payload.isVarified){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized")
        }
    }
    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})
    return newUpdatedUser
}




const getAllUsers = async () => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}


export const userService = {
    createUser,
    getAllUsers,
    updateUser
}