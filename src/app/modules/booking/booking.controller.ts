import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";




const createBooking = catchAsync(async(req:Request, res: Response)=>{
    const decodeToken = ""
})





export const BookingController = {
    createBooking,
}