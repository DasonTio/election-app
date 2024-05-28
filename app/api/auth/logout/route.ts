import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    try{
        cookies().delete("token")
        return NextResponse.json({
            message:"Logout Successful",
        }, {status: 200})
    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error", 
        }, {status: 500})
    }
}