import { NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import parseJson from "@/utils/parseJson";
import { cookies } from "next/headers";
import { loginSchema } from "@/prisma/validator/authSchema";



export async function POST(request: Request) {
    try{
        const body = await parseJson(request);
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

        const {password:_, ...tokenData} = user 
        const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {expiresIn: '24h'})
        cookies().set("token", token)
        
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