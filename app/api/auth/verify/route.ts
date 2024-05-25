import parseJson from "@/utils/parseJson";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from 'jsonwebtoken'

const tokenSchema = z.object({
    token: z.string()
})
export async function POST(request: NextRequest){
    try {
        console.log("ALSKDJALSKDJALSKDJASKLDASLKDJALSKDJlKSADJ")
        const body = await parseJson(request)
        const tokenData = tokenSchema.parse(body)

        const user = jwt.verify(tokenData.token, process.env.JWT_SECRET as string);
        return NextResponse.json({ 
            user
         }, {status:200});
    } catch (error) {
        return NextResponse.json({ 
            message: 'Invalid token'
        }, {status: 401});
    }
}