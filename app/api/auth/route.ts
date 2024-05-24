import { NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { register } from "module";

// Sign In
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
export async function GET(request: Request) {
    try{
        const body = await request.json();
        const {email, password} = loginSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: {email}
        })
        
        if(!user){
            return NextResponse.json({
                message: "User Not Found"
            }, {status: 401})
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return NextResponse.json({
                message: "Unauthorized",
            }, {status: 401})
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET as string, {expiresIn: '24h'})
        return NextResponse.json({
            message:"Login Successful",
            token
        }, {status: 200})
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json({
                message: "Invalid Input",
                errors: error.errors, 
            }, {status: 422})
        }

        return NextResponse.json({
            message: "Internal Server Error", 
        }, {status: 500})
    }
}

// Sign Up
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
        
        const registeredUser = await prisma.user.create({
            data:requestData 
        })

        const token = jwt.sign({userId: registeredUser.id}, process.env.JWT_SECRET as string, {expiresIn: '24h'})
        return NextResponse.json({
            message: "Register Success",
            data: registeredUser,
            token,
        })
    }catch(error){
        return NextResponse.json({
            "message": "Internal server error",
        }, {status:500});
    }
}
