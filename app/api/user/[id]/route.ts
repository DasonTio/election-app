import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'

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
            user
        }, {status: 200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error", 
        }, {status: 500})
    }
}

// Update Selected User
const userUpdateSchema = z.object({
    name: z.string().min(1),
    password: z.string().min(6),
    birthDate: z.date(),
    address: z.string().min(1),
    role: z.enum(['user', 'admin']).optional(),
    gender: z.enum(['male', 'female']),
    phoneNumber: z.string().min(12).max(15),
    ward: z.string().min(1),
    subDistrict: z.string().min(1),
    city: z.string().min(1),
    regency: z.string().min(1),
    province: z.string().min(1),
});

export async function POST(
    request: Request,  
    {params}: {params:{
        id:string
    }}
 ){
    
    try{
        const {id} = params
        const body = await request.json();
        const requestData = userUpdateSchema.parse(body)
        const user = await prisma.user.findUnique({
            where: {id}
        })

        if(!user) return NextResponse.json({
            message: "User Not Identified"
        }, {status: 422})
        
        const updatedUser = await prisma.user.update({
            data: requestData,
            where: {id}
        })

        return NextResponse.json({
            message: "User Successfully Updated",
            data: updatedUser,
        })
    }catch(error){
        return NextResponse.json({
            "message": "Internal server error",
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