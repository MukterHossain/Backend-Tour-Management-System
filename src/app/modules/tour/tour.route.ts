import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";


const router = Router()
// const router = express.Router()


/** ******------------------ TOUR TYPE ROUTES --------- */
router.post("/create-tour-type",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.createTourType)
router.get("/tour-types",  TourController.getAllTourTypes)
router.patch("/tour-types/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.updateTourType)
router.delete("/tour-types/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.deleteTourType)


/** ******------------------ TOUR ROUTES --------- */
router.post("/create",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.createTour)
router.get("/",  TourController.getAllTours)
router.patch("/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.updateTour)
router.delete("/:id",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.deleteTour)





export const TourRoutes = router