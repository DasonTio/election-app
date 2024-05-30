import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import parseJson from "@/utils/parseJson";
import { UploadFile } from "@/utils/uploadFile";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { number, z, ZodError } from "zod";

const candidateGroupScheme = z.object({
    startAt: z.date(),
    endAt: z.date(),
    status: z.enum(['active', 'inactive'])
})
export async function PUT(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const body = await parseJson(request)
        const requestData = candidateGroupScheme.parse({
            ...body,
            startAt: new Date(body.startAt),
            endAt: new Date(body.endAt),
        }) 
        
        const candidateGroup = await prisma.candidateGroup.update({
            data:{
                ...requestData,
            },
            where:{id}
        })
        
        return NextResponse.json({
            message: "Update Candidate Group Success",
            data: candidateGroup
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
        const candidateGroup = await prisma.candidateGroup.findUnique({
            where: {id},
            include:{
                candidate: true
            }
        })
        if(!candidateGroup) return NextResponse.json({
            "message": "Candidate Group Not Identified"
        }, {status: 422})   

        const candidates = await prisma.candidate.findMany({
            where: { candidateGroupId: id },
        });

        for (const candidate of candidates) {
            // Delete vote results associated with the candidate
            await prisma.voteResult.deleteMany({
            where: { candidateId: candidate.id },
            });
    
            // Delete votes associated with the candidate
            await prisma.vote.deleteMany({
            where: { candidateId: candidate.id },
            });
    
            // Delete the candidate
            await prisma.candidate.delete({
            where: { id: candidate.id },
            });
        }
    
        // Delete the candidate group
        await prisma.candidateGroup.delete({
            where: { id },
        });
          
        
        return NextResponse.json({
            message:"Delete Candidate Group Success"
        }, {status:200}) 
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}