'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { AuthContext } from '@/src/contexts/auth-context'
import { usePhaseTemplates } from '@/src/hooks/use-phase-templates'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PhaseTemplatesTable } from '@/components/phase-templates-table'

export default function PhaseTemplatesPage() {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const userTenant = user?.userTenants?.[0]
  const tenantId = userTenant?.tenantId
  const userRole = userTenant?.role

  const {
    data: phaseTemplates = [],
    isLoading,
  } = usePhaseTemplates({
    tenantId,
    enabled: !!tenantId && !!user,
  })

  useEffect(() => {
    if (user && userRole && userRole !== 'OWNER' && userRole !== 'MENTOR') {
      toast.error('Acesso negado', {
        description: 'Apenas mentores e proprietários podem gerenciar templates de fase',
      })
      router.push('/dashboard/mentor')
      return
    }
  }, [user, userRole, router])

  if (!user || !tenantId) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Templates de Fase</CardTitle>
          <CardDescription>
            Gerencie os templates de fase para estruturar o progresso dos alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <PhaseTemplatesTable
              phaseTemplates={phaseTemplates}
              tenantId={tenantId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
