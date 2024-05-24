import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'; 

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    if(pathname === "/" || pathname === "/login"){
        return NextResponse.next();
    }else{
        const token = request.cookies.get('token')?.value
        const jwtSecret = process.env.JWT_SECRET as string;

        if(!token) return NextResponse.redirect(new URL('/login', request.url));
        
        try{
            jwt.verify(token, jwtSecret);
            return NextResponse.next()
        }catch(error){
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}
 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }