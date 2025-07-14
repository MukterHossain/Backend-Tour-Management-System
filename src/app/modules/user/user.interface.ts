import { Types } from "mongoose";

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN= "ADMIN",
    USER = "USER",
    GUIDE= "GUIDE"
}

// Auth Provides   password, google

export interface IAuthProvider{
    // provider: string;    // Google, Credential
    provider: "google" | "credential";    // Google, Credential
    providerId: string;
}

export enum IsActive{
    ACTIVE= "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser{
    _id?: Types.ObjectId; 
    name: string;
    email: string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isVarified ?: boolean;
    role: Role;
    auths: IAuthProvider[];
    bookings ?: Types.ObjectId[];
    guides ?: Types.ObjectId[];


}