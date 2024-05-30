import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import { registerSchema } from "@/prisma/validator/authSchema";
import parseJson from "@/utils/parseJson";
import bcrypt from 'bcryptjs'

// Get Selected User
export async function GET(
    request: NextRequest, 
    {params}: {params:{
        id:string
    }}
) {
    try{
        const {id} = params
        const user = await prisma.user.findUnique({
            where: {id: id}
        })
        
        if(!user){
            return NextResponse.json({
                message: "User Not Found"
            }, {status: 200})
        }

        return NextResponse.json({
            message:"User Data Found",
            data: user
        }, {status: 200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error", 
        }, {status: 500})
    }
}



export async function PUT(
    request: Request,  
    {params}: {params:{
        id:string
    }}
 ){
    
    try{
        const {id} = params
        const body = await parseJson(request);
        const requestData = registerSchema.omit({id:true}).parse({
            ...body,
            birthDate: new Date(body.birthDate)
        })

        const user = await prisma.user.findUnique({
            where: {id}
        })

        if(!user) return NextResponse.json({
            message: "User Not Identified"
        }, {status: 422})

        const hashedPassword = await bcrypt.hash(requestData.password, 10);
        const updatedUser = await prisma.user.update({
            data: {
                ...requestData,
                password: hashedPassword
            },
            where: {id}
        })

        return NextResponse.json({
            message: "User Successfully Updated",
            data: updatedUser,
        })
    }catch(error){
        return NextResponse.json({
            "message": "Internal server error",
            error
        }, {status:500});
    }
}

// Delete Selected User
export async function DELETE(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            return NextResponse.json({
                message: "User Not Identified"
            }, { status: 422 });
        }

        await prisma.user.delete({
            where: { id: id }
        });

        return NextResponse.json({
            message: "User Successfully Deleted"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}