import prisma from "@/prisma/db";
import parseJson from "@/utils/parseJson";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request:NextRequest) {
    try{
        const data = await prisma.employee.findMany()
        return NextResponse.json({
            message: "Retrieve Employee Success",
            data
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}


const employeeDivisionSchema = z.object({
    userId: z.string(),
    divisionId: z.number()
})
export async function POST(request:NextRequest){
    try{
        const body = await parseJson(request)
        const {userId, divisionId}= employeeDivisionSchema.parse(body)

        const isAvailable = await prisma.employee.findUnique({
            where: {userId}
        })
        if(isAvailable) return NextResponse.json({
            message: "Employee Duplicate Entry"
        }, {status: 422})
        
        const employeeData = await prisma.employee.create({
            data: {
                divisionId,
                userId
            }
        })

        return NextResponse.json({
            message: "Retrieve Employee Division Success",
            data: employeeData
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}