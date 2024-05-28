import prisma from "@/prisma/db";
import { candidateGroupScheme } from "@/prisma/validator/candidateGroupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function GET(request: NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const status = searchParams.get('status') == 'active' || searchParams.get('isActive') == 'true';
        const data = await prisma.candidateGroup.findMany({
            where:{status: status ? 'active' : 'inactive'},
            include:{
                candidate: true
            }
        })
        return NextResponse.json({
            message:"Retrieve Candidate Group Success",
            data
        }, {status:200})
    }catch(error){
        return NextResponse.json({
            message:"Internal Server Error",
            error
        }, {status:500})
    }
}

export async function POST(request: NextRequest) {
    try{
        const body = request.body
        const requestData = candidateGroupScheme.parse(body) 
        
        const candidate = await prisma.candidateGroup.create({
            data:{
                ...requestData,
            }
        })

        return NextResponse.json({
            message:"Create Candidate Success",
            date: candidate
        }, {status: 200})
    }catch(error){
        if(error instanceof ZodError) return NextResponse.json({
            message: "Invalid Input",
            error: error.errors
        }, {status: 422})

        return NextResponse.json({
            message:"Internal Server Error",
            error
        }, {status: 500})
    }
}