import prisma from "@/prisma/db";
import { candidateGroupScheme } from "@/prisma/validator/candidateGroupSchema";
import parseJson from "@/utils/parseJson";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

export async function GET(request: NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const status = searchParams.get('status') == 'active' || searchParams.get('isActive') == 'true';
        let data;

        if(status){
            data = await prisma.candidateGroup.findMany({
                where:{status: 'active'},
                include:{
                    candidate: true
                }
            })
        }
        data = await prisma.candidateGroup.findMany({
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
        const body = await parseJson(request)
        const requestData = candidateGroupScheme.parse({
            ...body,
            startAt: new Date(body.startAt),
            endAt: new Date(body.endAt),
        }) 

        const candidate = await prisma.candidateGroup.create({
            data:{
                ...requestData,
            }
        })

        return NextResponse.json({
            message:"Create Candidate Group Success",
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