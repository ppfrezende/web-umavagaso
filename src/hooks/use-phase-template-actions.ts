import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '@/src/services/api-client'
import type { UpdatePhaseTemplateData, PhaseTemplateResponse } from '@/src/types/phase-template'

interface UpdatePhaseTemplateParams {
  phaseTemplateId: string
  data: UpdatePhaseTemplateData
}

interface DeletePhaseTemplateParams {
  phaseTemplateId: string
}

export function usePhaseTemplateActions(tenantId: string) {
  const queryClient = useQueryClient()

  const updatePhaseTemplate = useMutation({
    mutationFn: async ({ phaseTemplateId, data }: UpdatePhaseTemplateParams) => {
      const response = await api.put<PhaseTemplateResponse>(
        `/phase-templates/${phaseTemplateId}`,
        data
      )
      return response.data.phaseTemplate
    },
    onSuccess: () => {
      toast.success('Template atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['phase-templates', tenantId] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao atualizar template'
      toast.error('Erro', {
        description: errorMessage,
      })
    },
  })

  const deletePhaseTemplate = useMutation({
    mutationFn: async ({ phaseTemplateId }: DeletePhaseTemplateParams) => {
      await api.delete(`/phase-templates/${phaseTemplateId}`)
    },
    onSuccess: () => {
      toast.success('Template excluído com sucesso')
      queryClient.invalidateQueries({ queryKey: ['phase-templates', tenantId] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao excluir template'
      toast.error('Erro', {
        description: errorMessage,
      })
    },
  })

  return {
    updatePhaseTemplate,
    deletePhaseTemplate,
  }
}
