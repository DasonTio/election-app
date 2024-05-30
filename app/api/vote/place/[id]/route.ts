import prisma from "@/prisma/db";
import votePlaceSchema from "@/prisma/validator/votePlaceSchema";
import { fetchUser } from "@/utils/fetchUser";
import { UploadFile } from "@/utils/uploadFile";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z, ZodError } from "zod";

export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())
        

        const requestData = votePlaceSchema.parse({
            ...formDataObject,
            latitude: parseFloat(formDataObject.latitude as string),
            longitude: parseFloat(formDataObject.longitude as string)
        }) 

        const votePlace = await prisma.votePlace.findUnique({
            where: {id}
        })
        if(!votePlace) return NextResponse.json({
            "message": "Vote Place Not Identified"
        }, {status: 422})

        const file = formData.get('image') as File
        let storePath = votePlace.imageUrl;
        if(file) {
            const path = await UploadFile(file)
            storePath = path
        }
        const votePlaceData = await prisma.votePlace.update({
            where: {id},
            data: {
                ...requestData,
                imageUrl: storePath
            }
        })

        return NextResponse.json({
            message: "Update Vote Place Success",
            data: votePlaceData
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
        const isAvailable = await prisma.votePlace.findUnique({
            where: {id}
        })
        if(!isAvailable) return NextResponse.json({
            "message": "Vote Place Not Identified"
        }, {status: 422})   

        await prisma.votePlace.delete({
            where: {id}
        })
        
        return NextResponse.json({
            message:"Delete Place Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}