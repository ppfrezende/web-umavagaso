'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/src/contexts/auth-context'

export default function StudentDashboard() {
  const { user, isAuthenticate, isLoadingAuth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isAuthenticate) {
        router.push('/auth/sign-in')
      } else if (user?.role !== 'STUDENT') {
        router.push('/dashboard/mentor')
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

  if (!isAuthenticate || !user || user.role !== 'STUDENT') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Painel do Estudante - Acompanhe suas candidaturas e oportunidades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Vagas Disponíveis</p>
          <p className="text-3xl font-bold text-foreground">48</p>
          <p className="text-sm text-chart-2 mt-2">+15 novas</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Minhas Candidaturas</p>
          <p className="text-3xl font-bold text-foreground">7</p>
          <p className="text-sm text-primary mt-2">2 em análise</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Mentorias Ativas</p>
          <p className="text-3xl font-bold text-foreground">3</p>
          <p className="text-sm text-chart-2 mt-2">1 nova esta semana</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Mentorias Concluídas</p>
          <p className="text-3xl font-bold text-foreground">2</p>
          <p className="text-sm text-muted-foreground mt-2">Total</p>
        </div>
      </div>

      {/* Vagas Recomendadas */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Vagas Recomendadas para Você
          </h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">Nenhuma vaga recomendada no momento</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Minhas Candidaturas
          </h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">Você ainda não se candidatou a nenhuma vaga</p>
        </div>
      </div>
    </div>
  )
}
