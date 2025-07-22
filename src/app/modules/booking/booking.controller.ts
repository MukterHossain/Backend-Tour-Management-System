import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";




const createBooking = catchAsync(async(req:Request, res: Response)=>{
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodeToken.userId);


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking
    })
})


const getUserBookings = catchAsync(async(req:Request, res: Response)=>{
    //  const bookings = await BookingService.getUserBookings();
     const bookings ="";


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings retrived successfully",
        data: bookings
    })
})
const getSingleBooking = catchAsync(async(req:Request, res: Response)=>{
    // const booking = await BookingService.getBookingById();
    const booking = ''


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking ritrieved successfully",
        data: booking
    })
})
const getAllBookings = catchAsync(async(req:Request, res: Response)=>{
    //  const bookings = await BookingService.getAllBookings();
     const bookings =""


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings
    })
})
const updateBookingStatus = catchAsync(async(req:Request, res: Response)=>{
    // const updated = await BookingService.updateBookingStatus();
    const updated = ""


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking status updated successfully",
        data: updated
    })
})





export const BookingController = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus
}