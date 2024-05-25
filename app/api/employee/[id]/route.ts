import prisma from "@/prisma/db"
import parseJson from "@/utils/parseJson"
import { NextRequest, NextResponse } from "next/server"
import { z, ZodError } from "zod"


const employeeSchema = z.object({
    divisionId: z.number()
})
export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const body = await parseJson(request)
        const {divisionId} = employeeSchema.parse(body)

        const isAvailable = await prisma.employee.findUnique({
            where:{id}
        })
        if(!isAvailable)return NextResponse.json({
            message: "Employee is Invalid"
        }, {status: 422})

        const employeeData = await prisma.employee.update({
            where: {id},
            data: {
                divisionId
            }
        })

        return NextResponse.json({
            message: "Update Employee Success",
            data: employeeData
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
        const isAvailable = await prisma.employee.findUnique({where:{id}})
        if(!isAvailable)return NextResponse.json({
            message: "Employee is Invalid"
        },{status: 422})

        await prisma.employee.delete({where: {id}})
        
        return NextResponse.json({
            message:"Delete Employee Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}