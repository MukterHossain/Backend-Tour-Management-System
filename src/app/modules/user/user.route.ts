import { Router } from "express";
import { UserControllers } from "./user.controller";
// import { AnyZodObject } from "zod";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
// import AppError from "../../errorHelpers/AppError";
// import { JwtPayload } from "jsonwebtoken"
// import { Role } from "./user.interface";
// import { verifyToken } from "../../utils/jwt";
// import { envVars } from "../../config/env";


const router = Router()




router.post("/register",  validateRequest(createUserZodSchema),  UserControllers.createUser)
router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)



export const UserRoutes = router