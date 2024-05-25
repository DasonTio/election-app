import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fetchUser } from './utils/fetchUser'



export async function middleware(request: NextRequest) {

    const result = await fetchUser()
    if (!result) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token. Paths starting with `/api/v1/`' 
      }, { status: 401 })
    }

    return NextResponse.next()
}
 
export const config = {
  matcher: ['/api/vote/:path*','/api/user/:path*'],
}