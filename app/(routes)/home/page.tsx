import React from 'react'
import { headers } from 'next/headers'

type Props = {}

export default function Home({}: Props) {

  const id = headers().get("X-User-Sub")
  const username = headers().get("X-User-Name")
  const email = headers().get("X-User-Email")

  return (
    <div>
      <div>User ID: {id}</div>
      <div>User Name: {username}</div>
      <div>User Email: {email}</div>
    </div>
  )
}