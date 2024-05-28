import prisma from "@/prisma/db";
import candidateSchema from "@/prisma/validator/candidateSchema";
import { UploadFile } from "@/utils/uploadFile";
import { Status } from "@prisma/client";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z, ZodError } from "zod";

export async function GET(){
    try{
        const data = await prisma.candidate.findMany({
            where:{status: "active"}
        })
        return NextResponse.json({
            message:"Retrieve Candidate Success",
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
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())

        const requestData = candidateSchema.parse({
            ...formDataObject,
            candidateGroupId: parseInt(formDataObject.candidateGroupId as string)
        }) 
        const chiefImageFile = formData.get('chiefImage') as File
        const deputyImageFile = formData.get('deputyImage') as File
        if(!chiefImageFile || !deputyImageFile) return NextResponse.json({
            message:"Invalid Input",
            error: "File invalid"
        }, {status: 422})

        const chiefImagePath = await UploadFile(chiefImageFile)
        const deputyImagePath = await UploadFile(deputyImageFile)
        
        const candidate = await prisma.candidate.create({
            data:{
                ...requestData,
                candidateGroupId: requestData.candidateGroupId,
                chiefImageUrl: chiefImagePath,
                deputyImageUrl: deputyImagePath
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