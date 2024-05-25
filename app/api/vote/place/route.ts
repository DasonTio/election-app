import prisma from "@/prisma/db";
import { Turret_Road } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import formidable from "formidable"
import { promises } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import parseJson from "@/utils/parseJson";

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

const votePlaceSchema = z.object({
    description: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
})
export async function POST(request: NextRequest) {
    try{
        const body = await parseJson(request)
        const formData = await request.formData()
        const requestData = votePlaceSchema.parse(body) 

        const file = formData.get('image') as File
        if(!file) return NextResponse.json({
            message:"Invalid Input",
            error: "File invalid"
        }, {status: 422})

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = file.name.replaceAll(" ","-")

        const storePath = path.join(process.cwd(), "public/assets/" + filename)
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
            message:"Internal Server Error"
        }, {status: 500})
    }
}