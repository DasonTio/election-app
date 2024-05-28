import prisma from "@/prisma/db"
import employeeDivisionSchema from "@/prisma/validator/employeeDivisionSchema"
import parseJson from "@/utils/parseJson"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"

export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const body = await parseJson(request)
        const {name} = employeeDivisionSchema.parse(body) 

        const isAvailable = await prisma.employeeDivision.findUnique({
            where:{id}
        })
        if(!isAvailable)return NextResponse.json({
            message: "Employee Division is Invalid"
        }, {status: 422})

        const employeeDivisionData = await prisma.employeeDivision.update({
            where: {id},
            data: {name}
        })

        return NextResponse.json({
            message: "Update Employee Division Success",
            data: employeeDivisionData
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
        const isAvailable = await prisma.employeeDivision.findUnique({where:{id}})
        if(!isAvailable)return NextResponse.json({
            message: "Employee Division is Invalid"
        },{status: 422})

        await prisma.employeeDivision.delete({where: {id}})
        
        return NextResponse.json({
            message:"Delete Employee Division Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}