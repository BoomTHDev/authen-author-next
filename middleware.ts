import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import * as jose from "jose"
import { headers } from "next/headers"

export async function middleware(request: NextRequest) {

    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL("/home", request.url))
    }

    const cookie = cookies()
    const tokenUser = cookie.get('token')

    if (tokenUser) {
        try {
            const secret = new TextEncoder().encode(process.env.SECRET_TOKEN)
            const jwt = tokenUser.value
            const { payload } = await jose.jwtVerify(jwt, secret, {})
            if (payload) {
                const response = NextResponse.next()
                response.headers.set("X-User-Sub", payload.sub as string)
                response.headers.set("X-User-Name", payload.username as string)
                response.headers.set("X-User-Email", payload.email as string)
                return response
            }

            if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")) {
                return NextResponse.redirect(new URL("/home", request.url))
            }
            return NextResponse.next()
        } catch (err) {
            console.log("Fail validate tokenn user:", err)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    } else {
        if (request.nextUrl.pathname.startsWith("/home")) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/", "/home", "/login", "/signup"]
}