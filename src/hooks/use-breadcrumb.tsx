'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage: boolean
}

// Mapeamento de rotas para labels personalizados
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  mentor: 'Mentor',
  student: 'Estudante',
  settings: 'Configurações',
  profile: 'Perfil',
  courses: 'Cursos',
  students: 'Alunos',
  mentors: 'Mentores',
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Remove barra inicial e divide o caminho em segmentos
    const segments = pathname?.split('/').filter(Boolean) || []

    if (segments.length === 0) {
      return []
    }

    // Constrói os breadcrumbs
    const items: BreadcrumbItem[] = []
    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Pega o label personalizado ou usa o segmento formatado
      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1)

      items.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      })
    })

    return items
  }, [pathname])

  return breadcrumbs
}
