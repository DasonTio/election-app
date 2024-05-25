import axios from "axios";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import axiosInstance from "./axiosInstance";

import * as jose from 'jose'

type User = {
    id: string,
    email: string,
    name: string,
    role: string,
};

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
}

export async function fetchUser() : Promise<User|null>{ 
    let token = cookies().get('token')?.value
    try {
        const decoded = await jose.jwtVerify(token!, jwtConfig.secret)
        return decoded.payload as User
    } catch (err) {
        return null
    }  
}