import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import votePlaceSchema from "@/prisma/validator/votePlaceSchema";

export async function GET(){
    try{
        const results = await prisma.votePlace.findMany({
            include:{votes:true}
        })
        return NextResponse.json({
            message:"Retrieve Vote Places Success",
            data: results
        }, {status:200})
    }catch(error){
        return NextResponse.json({
            message:"Internal Server Error"
        }, {status:500})
    }
}

export async function POST(request: NextRequest) {
    try{
        const formData = await request.formData()
        const formDataObject = Object.fromEntries(formData.entries())

        const requestData = votePlaceSchema.parse({
            ...formDataObject,
            latitude: parseFloat(formDataObject.latitude as string),
            longitude: parseFloat(formDataObject.longitude as string)
        }) 
        const file = formData.get('image') as File
        if(!file) return NextResponse.json({
            message:"Invalid Input",
            error: "File invalid"
        }, {status: 422})

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = file.name.replaceAll(" ","-")

        const storePath = path.join("public/assets/" + filename)
        await writeFile(storePath, buffer)
        
        const votePlace = await prisma.votePlace.create({
            data:{
                ...requestData,
                imageUrl: storePath
            }
        })

        return NextResponse.json({
            message:"Create Vote Place Success",
            date: votePlace
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