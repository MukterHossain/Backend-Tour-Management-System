import { Router } from "express";
import { UserControllers } from "./user.controller";
// import { AnyZodObject } from "zod";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";



const router = Router()




router.post("/register",  validateRequest(createUserZodSchema),  UserControllers.createUser)
router.get("/all-users",checkAuth(...Object.values(Role)), UserControllers.getAllUsers)
router.get("/me", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER), UserControllers.getMe)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)



export const UserRoutes = router