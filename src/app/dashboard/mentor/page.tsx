'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/src/contexts/auth-context'

export default function MentorDashboard() {
  const { user, isAuthenticate, isLoadingAuth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isAuthenticate) {
        router.push('/auth/sign-in')
      } else if (user?.role !== 'MENTOR' && user?.role !== 'OWNER') {
        router.push('/dashboard/student')
      }
    }
  }, [isLoadingAuth, isAuthenticate, user, router])

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (
    !isAuthenticate ||
    !user ||
    (user.role !== 'MENTOR' && user.role !== 'OWNER')
  ) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Painel do Mentor - Aqui está um resumo das suas mentorias
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">
            Total de Vagas Criadas
          </p>
          <p className="text-3xl font-bold text-foreground">24</p>
          <p className="text-sm text-chart-2 mt-2">+12% este mês</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">
            Candidaturas Recebidas
          </p>
          <p className="text-3xl font-bold text-foreground">156</p>
          <p className="text-sm text-chart-2 mt-2">+8% este mês</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Mentorias Ativas</p>
          <p className="text-3xl font-bold text-foreground">12</p>
          <p className="text-sm text-primary mt-2">4 novas</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">
            Mentorias Finalizadas
          </p>
          <p className="text-3xl font-bold text-foreground">8</p>
          <p className="text-sm text-muted-foreground mt-2">Este mês</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Candidaturas Recentes
          </h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">Nenhuma candidatura recente</p>
        </div>
      </div>

      {/* Vagas Ativas */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Minhas Vagas Ativas
          </h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">Nenhuma vaga ativa no momento</p>
        </div>
      </div>
    </div>
  )
}
