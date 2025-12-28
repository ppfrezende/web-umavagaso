import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/services/api-client'
import type { Invitation } from '@/src/types/invitation'

interface UseInvitationsParams {
  tenantId: string | undefined
  enabled?: boolean
}

interface InvitationsResponse {
  invitations: Invitation[]
}

export function useInvitations({ tenantId, enabled = true }: UseInvitationsParams) {
  return useQuery({
    queryKey: ['invitations', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('Tenant ID é obrigatório')
      }

      const response = await api.get<InvitationsResponse>(
        `/tenants/${tenantId}/invitations`
      )
      return response.data.invitations
    },
    enabled: !!tenantId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: 'always', // Sempre busca dados frescos ao montar
  })
}
