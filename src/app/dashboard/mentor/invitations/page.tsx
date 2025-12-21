'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

import { AuthContext } from '@/src/contexts/auth-context'
import { api } from '@/src/services/api-client'
import type { Invitation } from '@/src/types/invitation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InviteStudentDialog } from '@/components/invite-student-dialog'
import { InvitationsTable } from '@/components/invitations-table'

export default function InvitationsPage() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Pega o primeiro tenant do usuário (considerando que o mentor tem um tenant principal)
  const userTenant = user?.userTenants?.[0]
  const tenantId = userTenant?.tenantId
  const userRole = userTenant?.role

  const loadInvitations = useCallback(async () => {
    if (!tenantId) return

    setIsLoading(true)
    try {
      const response = await api.get<{ invitations: Invitation[] }>(
        `/tenants/${tenantId}/invitations`
      )
      setInvitations(response.data.invitations)
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao carregar convites'
        toast.error('Erro', {
          description: errorMessage,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    // Verifica se o usuário tem permissão (OWNER ou MENTOR)
    if (user && userRole && userRole !== 'OWNER' && userRole !== 'MENTOR') {
      toast.error('Acesso negado', {
        description: 'Apenas mentores e proprietários podem gerenciar convites',
      })
      router.push('/dashboard/mentor')
      return
    }

    if (tenantId) {
      loadInvitations()
    }
  }, [tenantId, user, userRole, router, loadInvitations])

  if (!user || !tenantId) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os convites enviados para alunos
          </p>
        </div>
        <InviteStudentDialog
          tenantId={tenantId}
          onInviteSent={loadInvitations}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Convites</CardTitle>
          <CardDescription>
            Visualize, reenvie ou cancele convites pendentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <InvitationsTable
              invitations={invitations}
              tenantId={tenantId}
              onUpdate={loadInvitations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
