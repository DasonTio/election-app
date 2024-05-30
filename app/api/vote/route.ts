import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const results = await prisma.voteResult.findMany({
            where:{candidate:{
                candidateGroup:{
                    status:"active"
                }
            }},
            include:{candidate:true}
        })
        return NextResponse.json({
            message:"Retrieve VoteResult Success",
            data: results
        }, {status:200})
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message:"Internal Server Error"
        }, {status:500})
    }
}
