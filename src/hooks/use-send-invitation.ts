import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '@/src/services/api-client'

interface SendInvitationParams {
  tenantId: string
  email: string
}

interface SendInvitationError {
  message?: string
}

export function useSendInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tenantId, email }: SendInvitationParams) => {
      const response = await api.post(`/tenants/${tenantId}/invitations`, {
        email,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      toast.success('Convite enviado com sucesso!', {
        description: `Um email foi enviado para ${variables.email}`,
      })
      // Invalida as queries de convites para atualizar a listagem
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.tenantId] })
    },
    onError: (error: AxiosError<SendInvitationError>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao enviar convite'
      toast.error('Erro ao enviar convite', {
        description: errorMessage,
      })
    },
  })
}
