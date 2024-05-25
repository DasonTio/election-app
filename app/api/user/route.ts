import { NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { register } from "module";
import { cookies } from "next/headers";

// Get All Users
export async function GET(request: Request) {
    try{
        const user = await prisma.user.findMany()
        
        if(!user || user.length == 0){
            return NextResponse.json({
                message: "User Data is Empty"
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

// Create a User
const registerSchema = z.object({
    id: z.string().length(16),
    email: z.string().email(),
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
export async function POST(request: Request){
    try{
        const body = await request.json();
        const requestData = registerSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: {email: requestData.email}
        })

        if(user) return NextResponse.redirect(new URL("/login", request.url))
        
        const newUser = await prisma.user.create({
            data:requestData 
        })

        return NextResponse.json({
            message: "User Successfully Created",
            data: newUser,
        })
    }catch(error){
        return NextResponse.json({
            "message": "Internal server error",
        }, {status:500});
    }
}
