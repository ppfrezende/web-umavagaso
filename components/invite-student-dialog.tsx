'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

import { api } from '@/src/services/api-client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const inviteStudentSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
})

type InviteStudentFormData = z.infer<typeof inviteStudentSchema>

interface InviteStudentDialogProps {
  tenantId: string
  onInviteSent?: () => void
}

export function InviteStudentDialog({
  tenantId,
  onInviteSent,
}: InviteStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteStudentFormData>({
    resolver: zodResolver(inviteStudentSchema),
  })

  const onSubmit: SubmitHandler<InviteStudentFormData> = async (data) => {
    setIsLoading(true)

    try {
      await api.post(`/tenants/${tenantId}/invitations`, {
        email: data.email,
      })

      toast.success('Convite enviado com sucesso!', {
        description: `Um email foi enviado para ${data.email}`,
      })

      reset()
      setOpen(false)
      onInviteSent?.()
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao enviar convite'
        toast.error('Erro ao enviar convite', {
          description: errorMessage,
        })
      } else {
        toast.error('Erro ao enviar convite', {
          description: 'Ocorreu um erro inesperado',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      setOpen(newOpen)
      if (!newOpen) {
        reset()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Convidar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Aluno</DialogTitle>
          <DialogDescription>
            Envie um convite por email para um novo aluno. O convite expira em
            7 dias.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email do aluno</Label>
            <Input
              id="email"
              type="email"
              placeholder="aluno@exemplo.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Convite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
