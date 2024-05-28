import prisma from "@/prisma/db";
import { candidateGroupScheme } from "@/prisma/validator/candidateGroupSchema";
import parseJson from "@/utils/parseJson";
import { UploadFile } from "@/utils/uploadFile";
import { Status } from "@prisma/client";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z, ZodError } from "zod";

export async function GET(){
    try{
        const data = await prisma.candidateGroup.findMany({
            include:{candidate: true}
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
        const body = await parseJson(request)
        const requestData = candidateGroupScheme.parse(body) 
        
        const candidateGroup = await prisma.candidateGroup.create({
            data:{
                ...requestData,
            }
        })

        return NextResponse.json({
            message:"Create Candidate Group Success",
            date: candidateGroup
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