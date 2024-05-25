import prisma from "@/prisma/db";
import parseJson from "@/utils/parseJson";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request:NextRequest) {
    try{
        const data = await prisma.employeeSchedule.findMany()
        return NextResponse.json({
            message: "Retrieve Employee Schedule Success",
            data
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}


const employeeScheduleSchema = z.object({
    divisionId: z.number(),
    name: z.string(),
    description: z.string(),
    startAt: z.date(),
    endAt: z.date()
})
export async function POST(request:NextRequest){
    try{
        const body = await parseJson(request)
        const requestData = employeeScheduleSchema.parse({
            ...body,
            startAt: new Date(body.startAt),
            endAt: new Date(body.endAt)
        })
        
        const employeeData = await prisma.employeeSchedule.create({
            data: requestData
        })

        return NextResponse.json({
            message: "Create Employee Schedule Success",
            data: employeeData
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}