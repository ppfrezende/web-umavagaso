import Header from '@/components/header'
import { SidebarMentor } from '@/components/mentor-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <SidebarMentor />
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
