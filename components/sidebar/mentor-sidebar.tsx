'use client'

import * as React from 'react'
import { Settings2, Layers, Users, LayoutDashboard } from 'lucide-react'

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
import { TenantComponent } from '../tenant/tenant-component'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard/mentor',
      icon: LayoutDashboard,
    },
    {
      title: 'Gestão de Alunos',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Convites',
          url: '/dashboard/mentor/invitations',
        },
        {
          title: 'Lista de alunos',
          url: '/dashboard/mentor/students',
        },
        // {
        //   title: 'Acompanhar Progresso',
        //   url: '#',
        // },
        // {
        //   title: 'Aprovar Avanços',
        //   url: '#',
        // },
      ],
    },
    {
      title: 'Configuração de Fases',
      url: '#',
      icon: Layers,
      items: [
        {
          title: 'Templates de Fases',
          url: '/dashboard/mentor/phase-templates',
        },
        // {
        //   title: 'Métricas',
        //   url: '#',
        // },
        // {
        //   title: 'Regras de Avanço',
        //   url: '#',
        // },
      ],
    },

    {
      title: 'Configurações',
      url: '/dashboard/mentor/settings',
      icon: Settings2,
      items: [
        {
          title: 'Geral',
          url: '/dashboard/mentor/settings',
        },
        {
          title: 'Time',
          url: '#',
        },
      ],
    },
  ],
  projects: [],
}

export function SidebarMentor({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = React.useContext(AuthContext)

  // Verifica se o usuário é owner do tenant
  const isOwner = React.useMemo(() => {
    if (!user || !user.userTenants || user.userTenants.length === 0) {
      return false
    }
    const currentTenant = user.userTenants[0].tenant
    return currentTenant.ownerId === user.id
  }, [user])

  // Filtra os items do navMain baseado se é owner
  const filteredNavMain = React.useMemo(() => {
    return data.navMain.filter((item) => {
      // Se não for owner, remove a seção Settings
      if (!isOwner && item.title === 'Settings') {
        return false
      }
      return true
    })
  }, [isOwner])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user && user.userTenants && (
          <TenantComponent userTenants={user.userTenants} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
