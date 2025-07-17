import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";


const createDivision = catchAsync(async(req:Request, res:Response)=>{
    const result = await DivisionService.createDivision(req.body)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Division Created Successfully",
            data: result
        })
})
const getAllDivisions = catchAsync(async(req:Request, res:Response)=>{
    const result = await DivisionService.getAllDivision()

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Divisions retrieved Successfully",
            data: result.data,
            meta: result.meta
        })
})
const getSingleDivision = catchAsync(async(req:Request, res:Response)=>{
    const slug = req.params.slug
    const result = await DivisionService.getSingleDivision(slug)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Division Created Successfully",
            data: result.data
        })
})
const updateDivision = catchAsync(async(req:Request, res:Response)=>{
    const id = req.params.id
    const result = await DivisionService.updateDivision(id, req.body)

     sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Division update Successfully",
            data: result
        })
})
const deleteDivision = catchAsync(async(req:Request, res:Response)=>{
    const id = req.params.id
    const result = await DivisionService.deleteDivision(id)

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Division delete Successfully",
            data: result
        })
})



export const DivisionController ={
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}