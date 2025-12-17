'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../contexts/auth-context'

export default function Home() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'MENTOR':
          router.replace('/dashboard/mentor')
          break
        case 'STUDENT':
          router.replace('/dashboard/student')
          break
        default:
          router.replace('/auth/sign-in')
      }
    } else {
      router.replace('/auth/sign-in')
    }
  }, [router, user])

  return <></>
}
