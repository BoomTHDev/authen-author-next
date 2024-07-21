import React from 'react'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

type Props = {}

export default function Signup({}: Props) {
    async function signup(formData: FormData) {
        "use server"
            const username = formData.get("username") as string | null
            const email = formData.get("email") as string | null
            const password = formData.get("password") as string | null
            if (username && email && password) {
                const hashPass = bcrypt.hashSync(password, 10)
                const newUser = await prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hashPass,
                    }
                })
                redirect('/')
            }
    }

  return (
    <>
        <div>Signup</div>
        <form action={signup}>
            <label>Username</label>
            <input type="text" name="username" className='ml-2' />
            <label>Email</label>
            <input type="email" name="email" className='ml-2' />
            <label>Password</label>
            <input type="password" name="password" className='ml-2' />
            <button className='bg-blue-500 p-2' type="submit">signup</button>
        </form>
    </>
  )
}