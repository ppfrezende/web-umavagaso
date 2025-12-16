'use client'

import { useContext } from 'react'
import { AuthContext } from '@/src/contexts/auth-context'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div>
      <p>{user?.name}</p>
    </div>
  )
}
