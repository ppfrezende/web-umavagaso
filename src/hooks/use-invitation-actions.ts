import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { api } from '@/src/services/api-client'

interface ResendInvitationParams {
  invitationId: string
  email: string
}

interface CancelInvitationParams {
  invitationId: string
}

export function useInvitationActions(tenantId: string) {
  const queryClient = useQueryClient()

  const resendInvitation = useMutation({
    mutationFn: async ({ invitationId }: ResendInvitationParams) => {
      await api.post(`/invitations/${invitationId}/resend`)
    },
    onSuccess: (_, variables) => {
      toast.success('Convite reenviado!', {
        description: `Um novo email foi enviado para ${variables.email}`,
      })
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao reenviar convite'
      toast.error('Erro', {
        description: errorMessage,
      })
    },
  })

  const cancelInvitation = useMutation({
    mutationFn: async ({ invitationId }: CancelInvitationParams) => {
      await api.delete(`/invitations/${invitationId}`)
    },
    onSuccess: () => {
      toast.success('Convite cancelado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Erro ao cancelar convite'
      toast.error('Erro', {
        description: errorMessage,
      })
    },
  })

  return {
    resendInvitation,
    cancelInvitation,
  }
}
