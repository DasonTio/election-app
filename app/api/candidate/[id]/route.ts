import prisma from "@/prisma/db";
import candidateSchema from "@/prisma/validator/candidateSchema";
import { fetchUser } from "@/utils/fetchUser";
import { UploadFile } from "@/utils/uploadFile";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { number, z, ZodError } from "zod";

export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())
        
        const candidate = await prisma.candidate.findUnique({
            where: {id}
        })

        if(!candidate) return NextResponse.json({
            "message": "Candidate Not Identified"
        }, {status: 422})

        const requestData = candidateSchema.parse({
            ...formDataObject,
            candidateGroupId: parseInt(formDataObject.candidateGroupId as string)
        }) 
        const chiefImageFile = formData.get('chiefImage') as File
        const deputyImageFile = formData.get('deputyImage') as File

        let chiefImagePath, deputyImagePath;
        if(chiefImageFile) chiefImagePath = await UploadFile(chiefImageFile)
        if(deputyImageFile)deputyImagePath = await UploadFile(deputyImageFile)

        const updatedCandidate = await prisma.candidate.update({
            where: {id},
            data:{
                ...requestData,
                chiefImageUrl: chiefImagePath ?? candidate.chiefImageUrl,
                deputyImageUrl: deputyImagePath ?? candidate.deputyImageUrl
            }
        })

        return NextResponse.json({
            message: "Update Candidate Success",
            data: updatedCandidate
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

        await prisma.vote.deleteMany({
            where: { candidateId: id },
        });

        await prisma.voteResult.deleteMany({
            where: { candidateId: id },
        });

        await prisma.candidate.delete({
            where: { id },
        });
        
        return NextResponse.json({
            message:"Delete Candidate Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            error
        }, {status: 500})
    }
}