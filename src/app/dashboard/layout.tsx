'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import { SidebarMentor } from '@/components/mentor-sidebar'
import { SidebarStudent } from '@/components/student-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMentorRoute = pathname?.startsWith('/dashboard/mentor')

  return (
    <div className="min-h-screen">
      <SidebarProvider>
        {isMentorRoute ? <SidebarMentor /> : <SidebarStudent />}
        <main className="flex w-full flex-col px-6">
          <div className="sticky top-0 z-50">
            {/* Blur overlay - camada de fundo */}
            <div className="pointer-events-none absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <Header />
          </div>

          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
