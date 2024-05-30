import prisma from "@/prisma/db";
import { fetchUser } from "@/utils/fetchUser";
import parseJson from "@/utils/parseJson";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DateTime } from "luxon";

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

export async function POST(request: NextRequest) {
    try {
        const authUser = await fetchUser() as User;

        const startOfDay = DateTime
            .now()
            .setZone('Asia/Bangkok')
            .startOf('day');
        const endOfDay = startOfDay.endOf('day');

        const employee = await prisma.employee.findUnique({
            where: { userId: authUser.id }
        });

        if (!employee) {
            return NextResponse.json({
                message: "Employee Invalid"
            }, { status: 422 });
        }

        const isClockedIn = await prisma.employeeAttendance.findFirst({
            where: {
                employeeId: employee.id,
                inTime: {
                    gte: startOfDay.toISO()!,
                    lt: endOfDay.toISO()!
                }
            }
        });

        if (isClockedIn) {
            await prisma.employeeAttendance.update({
                where: { 
                    employeeId: isClockedIn.employeeId, 
                    inTime: isClockedIn.inTime 
                },
                data: {
                    outTime: DateTime.now().setZone('Asia/Bangkok').toISO()!
                }
            });

            return NextResponse.json({
                message: "Clock Out Success",
            }, { status: 200 });
        }

        // Clock In Function
        await prisma.employeeAttendance.create({
            data: {
                employeeId: employee.id,
                inTime: DateTime.now().setZone('Asia/Bangkok').toISO()!
            }
        });

        return NextResponse.json({
            message: "Clock In Success",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error
        }, { status: 500 });
    }
}