'use client'

import { useContext } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

import { useStudents } from '@/src/hooks/use-students'
import { AuthContext } from '@/src/contexts/auth-context'
import { StudentsTable } from '@/components/students-table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function StudentsPage() {
  const { user, isLoadingAuth } = useContext(AuthContext)
  const tenantId = user?.userTenants?.[0]?.tenantId

  const {
    data,
    isLoading: isLoadingStudents,
    error,
    refetch,
  } = useStudents({
    tenantId,
    enabled: !!tenantId,
  })

  if (isLoadingAuth || isLoadingStudents) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos da sua plataforma
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar alunos</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Ocorreu um erro ao carregar os alunos'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
          <CardDescription>
            Gerencie os alunos da sua plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStudents ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <StudentsTable
              students={data?.students || []}
              tenantId={tenantId || ''}
              refetch={refetch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
