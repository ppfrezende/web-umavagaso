import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/src/services/api-client'

interface AcceptInvitationParams {
  token: string
  name: string
  password: string
}

interface AcceptInvitationError {
  message?: string
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ token, name, password }: AcceptInvitationParams) => {
      const response = await api.post(`/invitations/${token}/accept`, {
        name,
        password,
      })
      return response.data
    },
    onSuccess: () => {
      // Invalida as queries de convites e estudantes para atualizar as listagens
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error: AxiosError<AcceptInvitationError>) => {
      // Retorna o erro para ser tratado no componente
      return error
    },
  })
}
