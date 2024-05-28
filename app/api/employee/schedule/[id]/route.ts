import prisma from "@/prisma/db"
import employeeScheduleSchema from "@/prisma/validator/employeeScheduleSchema"
import parseJson from "@/utils/parseJson"
import { NextRequest, NextResponse } from "next/server"
import { z, ZodError } from "zod"

export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const body = await parseJson(request)
        const requestData = employeeScheduleSchema.parse({
            ...body,
            startAt: new Date(body.startAt),
            endAt: new Date(body.endAt)
        })

        const isAvailable = await prisma.employeeSchedule.findUnique({where:{id}})
        if(!isAvailable)return NextResponse.json({
            message: "Employee Schedule is Invalid"
        }, {status: 422})

        const employeeScheduleData = await prisma.employeeSchedule.update({
            where: {id},
            data: requestData
        })

        return NextResponse.json({
            message: "Update Employee Schedule Success",
            data: employeeScheduleData
        }, {status: 200})
    }catch(error){
        if(error instanceof ZodError){
            return NextResponse.json({
                message:"Invalid Input",
                error: error.errors
            }, {status: 422})
        }

        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}

export async function DELETE(
    request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const isAvailable = await prisma.employeeSchedule.findUnique({where:{id}})
        if(!isAvailable)return NextResponse.json({
            message: "Employee Schedule is Invalid"
        },{status: 422})

        await prisma.employeeSchedule.delete({where: {id}})
        
        return NextResponse.json({
            message:"Delete Employee Schedule Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}