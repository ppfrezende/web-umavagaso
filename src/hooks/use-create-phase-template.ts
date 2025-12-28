import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '@/src/services/api-client'
import type { CreatePhaseTemplateData, PhaseTemplateResponse } from '@/src/types/phase-template'

interface CreatePhaseTemplateParams {
  tenantId: string
  data: CreatePhaseTemplateData
}

interface CreatePhaseTemplateError {
  message?: string
}

export function useCreatePhaseTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tenantId, data }: CreatePhaseTemplateParams) => {
      const response = await api.post<PhaseTemplateResponse>(
        `/tenants/${tenantId}/phase-templates`,
        data
      )
      return response.data.phaseTemplate
    },
    onSuccess: (_, variables) => {
      toast.success('Template de fase criado com sucesso!')
      queryClient.invalidateQueries({
        queryKey: ['phase-templates', variables.tenantId]
      })
    },
    onError: (error: AxiosError<CreatePhaseTemplateError>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao criar template de fase'
      toast.error('Erro ao criar template', {
        description: errorMessage,
      })
    },
  })
}
