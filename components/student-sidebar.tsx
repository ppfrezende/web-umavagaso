'use client'

import * as React from 'react'
import { BookOpen, Target, TrendingUp, LayoutDashboard } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AuthContext } from '@/src/contexts/auth-context'
import { TenantComponent } from './tenant-component'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard/student',
      icon: LayoutDashboard,
    },
    {
      title: 'Meu Progresso',
      url: '#',
      icon: TrendingUp,
      items: [
        {
          title: 'Visão Geral',
          url: '#',
        },
        {
          title: 'Fases Concluídas',
          url: '#',
        },
        {
          title: 'Métricas',
          url: '#',
        },
      ],
    },
    {
      title: 'Fases',
      url: '#',
      icon: Target,
      items: [
        {
          title: 'Fase Atual',
          url: '#',
        },
        {
          title: 'Próximas Fases',
          url: '#',
        },
        {
          title: 'Histórico',
          url: '#',
        },
      ],
    },
    {
      title: 'Materiais',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Recursos',
          url: '#',
        },
        {
          title: 'Atividades',
          url: '#',
        },
      ],
    },
  ],
  projects: [],
}

export function SidebarStudent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = React.useContext(AuthContext)
  const [currentTenantId, setCurrentTenantId] = React.useState<string>()

  // Define o tenant inicial quando o usuário estiver disponível
  React.useEffect(() => {
    if (user && user.userTenants && user.userTenants.length > 0 && !currentTenantId) {
      setCurrentTenantId(user.userTenants[0].tenantId)
    }
  }, [user, currentTenantId])

  const handleTenantChange = (tenantId: string) => {
    setCurrentTenantId(tenantId)
    // Aqui você pode adicionar lógica adicional, como recarregar dados específicos do tenant
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user && user.userTenants && (
          <TenantComponent
            userTenants={user.userTenants}
            currentTenantId={currentTenantId}
            onTenantChange={handleTenantChange}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
