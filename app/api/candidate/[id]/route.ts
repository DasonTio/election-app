import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import { UploadFile } from "@/utils/uploadFile";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { number, z, ZodError } from "zod";

const candidateSchema = z.object({
    candidateGroupId: z.number(),
    chiefName: z.string(),
    deputyName: z.string(),
    vision: z.string(),
    mission: z.string(),
    status: z.enum(["active", "inactive"]),
})
export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())
        
        const isAvailable = await prisma.candidate.findUnique({
            where: {id}
        })

        if(!isAvailable) return NextResponse.json({
            "message": "Candidate Not Identified"
        }, {status: 422})

        const requestData = candidateSchema.parse(formDataObject) 
        const chiefImageFile = formData.get('chiefImage') as File
        const deputyImageFile = formData.get('deputyImage') as File
        if(!chiefImageFile || !deputyImageFile) return NextResponse.json({
            message:"Invalid Input",
            error: "File invalid"
        }, {status: 422})

        const chiefImagePath = await UploadFile(chiefImageFile)
        const deputyImagePath = await UploadFile(deputyImageFile)
        
        const candidate = await prisma.candidate.update({
            where: {id},
            data:{
                ...requestData,
                chiefImageUrl: chiefImagePath,
                deputyImageUrl: deputyImagePath
            }
        })
        
        return NextResponse.json({
            message: "Update Candidate Success",
            data: candidate
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
        const isAvailable = await prisma.candidate.findUnique({
            where: {id}
        })
        if(!isAvailable) return NextResponse.json({
            "message": "Candidate Not Identified"
        }, {status: 422})   

        await prisma.candidate.delete({
            where: {id}
        })
        
        return NextResponse.json({
            message:"Delete Candidate Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}