import Cookies from "js-cookie"
import {jwtDecode} from 'jwt-decode'

export type AuthUser = {
    id: string,
    email: string,
    name: string,
    role: string,
};

export function fetchUserClient() : AuthUser|null{
    const token = Cookies.get('token')

    if (!token) return null;

    return jwtDecode(token) as AuthUser
}