/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError"
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"




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
const resetPassword = async (payload: Record<string, any>, decodedToken:JwtPayload) => {
    if(payload.id != decodedToken.userId){
        throw new AppError(401, "You can not reset your password")
    }
    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not Exist")
    }
    const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    isUserExist.password = hashedPassword;
    await isUserExist.save()


}
const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email})
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }
    if (!isUserExist.isVarified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not deleted")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }
    const jwtPayload ={
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {expiresIn: "20m"})

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
    /**
     * http://localhost:5173/reset-password?id=6883a804d9402f7a739653b2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgzYTgwNGQ5NDAyZjdhNzM5NjUzYjIiLCJlbWFpbCI6Im11a3Rlcmhvc3NhaW4zMDc1QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzNDYyMTE4LCJleHAiOjE3NTM0NjMzMTh9.yBZ_ESNjY91oRiauhYP2p6hp_qQNGhIzUfMlFbJWxKQ     */
}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId)

    if(!user){
        throw new AppError(404, "User not found")
    }
    if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password upate")
    }

    const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))

    const credentialProvider: IAuthProvider = {
        provider: "credential",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]
    user.password = hashedPassword
    user.auths = auths
    await user.save()
}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken:JwtPayload) => {
    return {}
    // const user = await User.findById(decodedToken.userId)
    
    // const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    // if(!isOldPasswordMatch){
    //     throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match")
    // }

    //  user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    //  user!.save()
}



export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    forgotPassword,
    changePassword,
    resetPassword,
    setPassword,

}