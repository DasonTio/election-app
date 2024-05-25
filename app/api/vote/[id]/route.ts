import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request:NextRequest, 
    {params}:{
    params:{id: string}
}){
    try{
        const id = parseInt(params.id)
        const authUser = await fetchUser()
        if(!authUser) return NextResponse.json({
            "message": "Unauthorized"
        }, {status: 401}) 

        const isCandidateAvailable = await prisma.candidate.findUnique({
            where: {id}
        })
        if(!isCandidateAvailable) return NextResponse.json({
            "message": "Candidate Not Available"
        }, {status: 422})

        const isVoted = await prisma.vote.findUnique({
            where: {
                userId_candidateId:{
                    userId: authUser.id,
                    candidateId: id,
                }
            }
        });
        if(isVoted)return NextResponse.json({
            "message": "Already Voted"
        }, {status: 200})

        await prisma.vote.create({
            data: {
                userId: authUser.id,
                candidateId: id
            }
        })

        const voteResult = await prisma.voteResult.upsert({
            where: { candidateId: id },
            update: {
                total: {
                    increment: 1
                }
            },
            create: {
                candidateId: id,
                total: 1
            }
        });

        return NextResponse.json({
            "message": "Voting Success",
            data: voteResult
        }, {status: 200})
    }catch(error){
        if(error instanceof ZodError){
            return NextResponse.json({
                "message":"Invalid Input",
                "error": error.errors
            }, {status: 422})
        }

        return NextResponse.json({
            "message": "Internal Server Error"
        }, {status: 500})
    }
}