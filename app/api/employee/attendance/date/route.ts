import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from 'luxon';
import { fetchUser } from "@/utils/fetchUser";

export async function GET(request:NextRequest) {
    try{
        const user = await fetchUser();
        if(!user){
            return NextResponse.json({
                message: "Unauthorized"
            },{status:401});
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: user.id }
        });

        if(!employee){
            return NextResponse.json({
                message: "Employee not found"
            },{status:404});
        }

        // format = yyyy-mm-dd
        const date = request.nextUrl.searchParams.get('date');
        if(!date){
            return NextResponse.json({
                message: "Date is required"
            },{status:400});
        }

        const startOfDay = DateTime
            .fromFormat(date, 'yyyy-MM-dd')
            .setZone('Asia/Bangkok')
            .startOf('day');
        const endOfDay = startOfDay.endOf('day');

        const data = await prisma.employeeAttendance.findFirst({
            where: {
                employeeId: employee.id,
                inTime: {
                    gte: startOfDay.toISO()!,
                    lt: endOfDay.toISO()!
                }
            }
        });

        return NextResponse.json({
            message: "Retrieve Employee Attendance Success",
            data
        },{status:200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
        },{status: 500})
    }
}