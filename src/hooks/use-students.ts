import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/services/api-client'

export type Role = 'OWNER' | 'MENTOR' | 'STUDENT'

// Baseado no modelo User do Prisma (sem password_hash, emailVerificationToken, emailVerificationExpiry)
export interface Student {
  id: string
  name: string
  email: string
  emailVerified: string | null
  avatar: string | null
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UseStudentsParams {
  tenantId: string | undefined
  page?: number
  limit?: number
  enabled?: boolean
}

interface StudentsResponse {
  students: Student[]
  pagination: Pagination
}

export function useStudents({
  tenantId,
  page = 1,
  limit = 10,
  enabled = true,
}: UseStudentsParams) {
  return useQuery({
    queryKey: ['students', tenantId, page, limit],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('Tenant ID é obrigatório')
      }

      const response = await api.get<StudentsResponse>(
        `/tenants/${tenantId}/students`,
        {
          params: { page, limit },
        }
      )
      return response.data
    },
    enabled: !!tenantId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: 'always', // Sempre busca dados frescos ao montar
  })
}
