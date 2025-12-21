'use client'

import { Building2, ChevronsUpDown, Check } from 'lucide-react'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserTenant } from '@/src/contexts/auth-context'

interface TenantComponentProps {
  userTenants: UserTenant[]
  currentTenantId?: string
  onTenantChange?: (tenantId: string) => void
}

export function TenantComponent({
  userTenants,
  currentTenantId,
  onTenantChange,
}: TenantComponentProps) {
  if (!userTenants || userTenants.length === 0) {
    return null
  }

  // Se não houver currentTenantId definido, usa o primeiro tenant
  const activeTenantId = currentTenantId || userTenants[0].tenantId
  const activeTenant = userTenants.find(
    (ut) => ut.tenantId === activeTenantId
  )?.tenant

  if (!activeTenant) {
    return null
  }

  const TenantLogo = activeTenant.logo || Building2

  // Se houver apenas um tenant, não mostra o dropdown
  if (userTenants.length === 1) {
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
              <span className="truncate font-medium">{activeTenant.name}</span>
              {activeTenant.description && (
                <span className="truncate text-xs text-muted-foreground">
                  {activeTenant.description}
                </span>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <TenantLogo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeTenant.name}
                </span>
                {activeTenant.description && (
                  <span className="truncate text-xs text-muted-foreground">
                    {activeTenant.description}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {userTenants.map((userTenant) => {
              const Logo = userTenant.tenant.logo || Building2
              const isActive = userTenant.tenantId === activeTenantId

              return (
                <DropdownMenuItem
                  key={userTenant.tenantId}
                  onClick={() => onTenantChange?.(userTenant.tenantId)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Logo className="size-4 shrink-0" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{userTenant.tenant.name}</span>
                    {userTenant.tenant.description && (
                      <span className="text-xs text-muted-foreground">
                        {userTenant.tenant.description}
                      </span>
                    )}
                  </div>
                  {isActive && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
