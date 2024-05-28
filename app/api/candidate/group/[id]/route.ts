import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import { UploadFile } from "@/utils/uploadFile";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { number, z, ZodError } from "zod";

const candidateGroupScheme = z.object({
    startAt: z.date(),
    endAt: z.date()
})
export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())
        
        const isAvailable = await prisma.candidateGroup.findUnique({
            where: {id}
        })

        if(!isAvailable) return NextResponse.json({
            "message": "Candidate Group Not Identified"
        }, {status: 422})

        const requestData = candidateGroupScheme.parse(formDataObject) 
        const candidate = await prisma.candidateGroup.update({
            where: {id},
            data:{
                ...requestData,
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
        const isAvailable = await prisma.candidateGroup.findUnique({
            where: {id}
        })
        if(!isAvailable) return NextResponse.json({
            "message": "Candidate Group Not Identified"
        }, {status: 422})   

        await prisma.candidateGroup.delete({
            where: {id}
        })
        
        return NextResponse.json({
            message:"Delete Candidate Group Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}