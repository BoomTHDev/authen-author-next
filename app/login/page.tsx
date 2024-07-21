import React from 'react'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import * as jose from "jose"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

type Props = {}

export default function Login({}: Props) {

    async function login(formData: FormData) {
        "use server"
        const username = formData.get("username") as string | null
        const password = formData.get("password") as string | null

        // Find User
        if (username && password) {
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            })
            
            // Check User
            if (!user) {
                return { message: "User Not Found" }
            }

            // Compare Password
            const correctPass = bcrypt.compare(password, user.password)
            if (!correctPass) {
                return { message: "Password incorrect" }
            }

            // Create JWT Token
            const secret = new TextEncoder().encode(process.env.SECRET_TOKEN)
            const alg = "HS256"
            const jwt = await new jose.SignJWT({
                username: user.username,
                email: user.email
            })
                .setProtectedHeader({ alg })
                .setExpirationTime("72h")
                .setSubject(user.id.toString())
                .sign(secret)

            cookies().set("token", jwt, {
                secure: true,
                httpOnly: true,
                expires: Date.now() + 24 * 60 * 60 * 1000 * 3,
                path: '/',
                sameSite: 'strict'
            })

            redirect('/')
        }
    }

  return (
    <>
        <div>Login</div>
        <form action={login}>
            <label>Username</label>
            <input type="text" name="username" className='ml-2' />
            <label>Password</label>
            <input type="password" name="password" className='ml-2' />
            <button className='bg-blue-500 p-2'>login</button>
        </form>
    </>
  )
}