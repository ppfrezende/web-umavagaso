'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/src/contexts/auth-context'

export default function Dashboard() {
  const { user, isAuthenticate, isLoadingAuth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isAuthenticate) {
        router.push('/auth/sign-in')
      } else if (user) {
        // Redireciona baseado no role do usuário
        if (user.role === 'MENTOR' || user.role === 'OWNER') {
          router.replace('/dashboard/mentor')
        } else if (user.role === 'STUDENT') {
          router.replace('/dashboard/student')
        } else {
          // Role desconhecido, redireciona para sign-in
          router.push('/auth/sign-in')
        }
      }
    }
  }, [isLoadingAuth, isAuthenticate, user, router])

  // Mostra loading enquanto redireciona
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  )
}
