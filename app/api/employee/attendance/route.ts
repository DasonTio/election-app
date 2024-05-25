import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import parseJson from "@/utils/parseJson";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request:NextRequest) {
    try{
        const data = await prisma.employeeAttendance.findMany()
        return NextResponse.json({
            message: "Retrieve Employee Attendance Success",
            data
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        },{status: 500})
    }
}


const attendanceSchema = z.object({
    time: z.date()
})
export async function POST(request:NextRequest){
    try{
        const body = await parseJson(request)
        const {time} = attendanceSchema.parse(body)

        const authUser = await fetchUser() as User
        const currentDate = Date.now().toLocaleString()

        const employee = await prisma.employee.findUnique({
            where: {userId : authUser.id}
        })
        if(!employee) return NextResponse.json({
            message: "Employee Invalid"
        }, {status: 422})

        // Check if already check-in
        const isClockedIn = await prisma.employeeAttendance.findFirst({
            where: {
                employeeId: employee.id,
                date: currentDate
            },
        })

        // Clock Out Function
        if(isClockedIn){
            await prisma.employeeAttendance.update({
                where: {employeeId: employee.id},
                data: {}
            })
            return NextResponse.json({
                message: "Clock Out Success",
            }, {status: 200})
        }

        // Clock In Function
        await prisma.employeeAttendance.create({
            data: {employeeId: employee.id}
        })
        return NextResponse.json({
            message: "Clock In Success",
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}