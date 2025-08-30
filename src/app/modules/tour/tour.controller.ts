
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";



const createTour = catchAsync(async(req:Request, res:Response)=>{
    
    //   console.log({
    //         files: req.files,
    //         body: req.body
    //     })
        const payload: ITour = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        }
    const result = await TourService.createTour(payload)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Tour Created Successfully",
            data:result
        })
})

const getAllTours = catchAsync(async(req:Request, res:Response)=>{
    const query = req.query
    const result = await TourService.getAllTours(query as Record<string, string>)

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Tours retrieved Successfully",
            data: result.data,
            meta: result.meta
        })
})
const updateTour = catchAsync(async(req:Request, res:Response)=>{
    const id = req.params.id
    const payload: ITour = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        }
    const result = await TourService.updateTour(id, payload)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Tour update Successfully",
            data: result
        })
})
const deleteTour = catchAsync(async(req:Request, res:Response)=>{
    const {id }= req.params
    const result = await TourService.deleteTour(id)

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Tour deleted Successfully",
            data: result
        })
})


const createTourType = catchAsync(async(req:Request, res:Response)=>{
    // const {name} = req.body
    const result = await TourService.createTourType(req.body)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Tour type Created Successfully",
            data: result
        })
})

const getAllTourTypes = catchAsync(async(req:Request, res:Response)=>{
    const query = req.query;
    const result = await TourService.getAllTourTypes(query as Record<string, string>);

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Tour types retrieved Successfully",
            data: result
        })
})
const updateTourType = catchAsync(async(req:Request, res:Response)=>{
    const {id }= req.params
    const {name} = req.body
    const result = await TourService.updateTourType(id, name)

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Tour type update Successfully",
            data: result
        })
})
const deleteTourType = catchAsync(async(req:Request, res:Response)=>{
    const {id }= req.params
    const result = await TourService.deleteTourType(id)

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Tour type deleted Successfully",
            data: result
        })
})



export const TourController ={
    createTour,
    getAllTours,
    updateTour,
    deleteTour,
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType

}