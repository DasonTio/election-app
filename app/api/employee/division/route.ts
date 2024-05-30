import prisma from "@/prisma/db";
import employeeDivisionSchema from "@/prisma/validator/employeeDivisionSchema";
import parseJson from "@/utils/parseJson";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request:NextRequest) {
    try{
        const data = await prisma.employeeDivision.findMany({
            include:{
                employee: true
            }
        })
        return NextResponse.json({
            message: "Retrieve Employee Division Success",
            data
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}



export async function POST(request:NextRequest){
    try{
        const body = await parseJson(request)
        const {name}= employeeDivisionSchema.parse(body)

        const isAvailable = await prisma.employeeDivision.findUnique({
            where: {name}
        })
        if(isAvailable) return NextResponse.json({
            message: "Employee Division Duplicate Entry"
        }, {status: 422})
        
        const employeeDivisionData = await prisma.employeeDivision.create({
            data: {name}
        })

        return NextResponse.json({
            message: "Create Employee Division Success",
            data: employeeDivisionData
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}