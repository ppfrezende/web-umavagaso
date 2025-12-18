'use client'

import * as React from 'react'
import { AuthContext } from '@/src/contexts/auth-context'
import { TenantForm } from '@/components/tenant-description-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const { user, setUser } = React.useContext(AuthContext)

  if (!user || !user.userTenants || user.userTenants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const currentTenant = user.userTenants[0].tenant
  const isOwner = currentTenant.ownerId === user.id

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    )
  }

  const handleTenantUpdate = (updatedTenant: typeof currentTenant) => {
    // Atualiza o tenant no contexto do usuário
    if (user) {
      const updatedUser = {
        ...user,
        userTenants: user.userTenants.map((ut) =>
          ut.tenantId === updatedTenant.id
            ? { ...ut, tenant: updatedTenant }
            : ut
        ),
      }
      setUser(updatedUser)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu tenant.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Informações do Tenant</CardTitle>
          <CardDescription>
            Atualize as informações básicas do seu tenant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm tenant={currentTenant} onUpdate={handleTenantUpdate} />
        </CardContent>
      </Card>
    </div>
  )
}
