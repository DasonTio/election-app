import { NextResponse } from "next/server";

import prisma from "@/prisma/db"
import {z} from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { register } from "module";
import { cookies } from "next/headers";
import parseJson from "@/utils/parseJson";
import { registerSchema } from "@/prisma/validator/authSchema";


export async function POST(request: Request){
    try{
        const body = await parseJson(request);
        const requestData = registerSchema.parse({
            ...body, 
            birthDate: new Date(body.birthDate)
        })

        const user = await prisma.user.findUnique({
            where: {email: requestData.email}
        })

        if(user) return NextResponse.redirect(new URL("/login", request.url))
        
        const hashedPassword = await bcrypt.hash(requestData.password, 10);
        const newUser = await prisma.user.create({
            data: { ...requestData, password: hashedPassword }
        });

        if(requestData.role == "employee"){
            await prisma.employee.create({
                data:{userId: newUser.id}
            })
        }

        const {password:_, ...tokenData} = newUser 
        const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {expiresIn: '24h'})
        cookies().set("token", token)
        return NextResponse.json({
            message: "Register Success",
            data: newUser,
            token,
        })
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json({
                message: "Invalid Input",
                errors: error.errors, 
            }, {status: 422})
        }

        return NextResponse.json({
            "message": "Internal server error",
            "error": error
        }, {status:500});
    }
}
