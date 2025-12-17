'use client'

import * as React from 'react'
import {
  GalleryVerticalEnd,
  Settings2,
  Building2,
  Layers,
  Users,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AuthContext } from '@/src/contexts/auth-context'

// This is sample data.
const data = {
  teams: [
    {
      name: 'OQF',
      logo: GalleryVerticalEnd,
      // plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Onboarding',
      url: '#',
      icon: Building2,
      isActive: true,
      items: [
        {
          title: 'Criar Tenant',
          url: '#',
        },
        {
          title: 'Configurar Mentoria',
          url: '#',
        },
      ],
    },
    {
      title: 'Configuração de Fases',
      url: '#',
      icon: Layers,
      items: [
        {
          title: 'Templates de Fases',
          url: '#',
        },
        {
          title: 'Métricas',
          url: '#',
        },
        {
          title: 'Regras de Avanço',
          url: '#',
        },
      ],
    },
    {
      title: 'Gestão de Alunos',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Convidar Alunos',
          url: '#',
        },
        {
          title: 'Acompanhar Progresso',
          url: '#',
        },
        {
          title: 'Aprovar Avanços',
          url: '#',
        },
        {
          title: 'Concursos',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
