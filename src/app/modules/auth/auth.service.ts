/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"




const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Email does not Exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }
    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }
    // // const accessToken = jwt.sign(jwtPayload, 'secret', {
    // //     expiresIn: '30d'
    // // })
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRE)

    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    const userTokens = createUserToken(isUserExist)

    // delete isUserExist.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: PASS, ...rest } = isUserExist.toObject()
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
        // email: isUserExist.email
    }
}
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken:JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match")
    }

     user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
     user!.save()
}


export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword

}