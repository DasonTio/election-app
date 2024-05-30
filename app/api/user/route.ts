import { NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { register } from "module";
import { cookies } from "next/headers";
import { registerSchema } from "@/prisma/validator/authSchema";

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
            data: user
        }, {status: 200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error", 
        }, {status: 500})
    }
}

export async function POST(request: Request){
    try{
        const body = await request.json();
        const requestData = registerSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: {email: requestData.email}
        })

        if(user) return NextResponse.redirect(new URL("/login", request.url))
        
        const hashedPassword = await bcrypt.hash(requestData.password, 10);
        const newUser = await prisma.user.create({
            data:{
                ...requestData,
                password: hashedPassword
            } 
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
