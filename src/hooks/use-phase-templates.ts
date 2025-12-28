import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/services/api-client'
import type { PhaseTemplatesListResponse } from '@/src/types/phase-template'

interface UsePhaseTemplatesParams {
  tenantId: string | undefined
  activeOnly?: boolean
  enabled?: boolean
}

export function usePhaseTemplates({
  tenantId,
  activeOnly = false,
  enabled = true
}: UsePhaseTemplatesParams) {
  return useQuery({
    queryKey: ['phase-templates', tenantId, activeOnly],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('Tenant ID é obrigatório')
      }

      const response = await api.get<PhaseTemplatesListResponse>(
        `/tenants/${tenantId}/phase-templates`,
        {
          params: {
            activeOnly: activeOnly.toString()
          }
        }
      )
      return response.data.phaseTemplates
    },
    enabled: !!tenantId && enabled,
  })
}
