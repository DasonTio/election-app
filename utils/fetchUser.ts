

import * as jose from 'jose'
import { cookies } from "next/headers";

export type AuthUser = {
    id: string,
    email: string,
    name: string,
    role: string,
};

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
}

export async function fetchUser() : Promise<AuthUser|null>{ 
    try {
        const token = cookies().get('token')?.value
        const decoded = await jose.jwtVerify(token!, jwtConfig.secret)
        return decoded.payload as AuthUser
    } catch (err) {
        return null
    }
}

