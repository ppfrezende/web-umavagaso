'use client'

import * as React from 'react'
import { Building2 } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { Tenant } from '@/src/contexts/auth-context'

export function TenantComponent({ tenant }: { tenant: Tenant }) {
  if (!tenant) {
    return null
  }

  const TenantLogo = tenant.logo || Building2

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <TenantLogo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{tenant.name}</span>
            {tenant.description && (
              <span className="truncate text-xs text-muted-foreground">
                {tenant.description}
              </span>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
