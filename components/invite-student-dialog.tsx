'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Loader2 } from 'lucide-react'

import { useSendInvitation } from '@/src/hooks/use-send-invitation'
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
}

export function InviteStudentDialog({
  tenantId,
}: InviteStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const sendInvitation = useSendInvitation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteStudentFormData>({
    resolver: zodResolver(inviteStudentSchema),
  })

  const onSubmit: SubmitHandler<InviteStudentFormData> = async (data) => {
    sendInvitation.mutate(
      {
        tenantId,
        email: data.email,
      },
      {
        onSuccess: () => {
          reset()
          setOpen(false)
        },
      }
    )
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!sendInvitation.isPending) {
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
          <Mail />
          Convidar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Aluno</DialogTitle>
          <DialogDescription>
            Envie um convite por email para um novo aluno. O convite expira em 7
            dias.
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
              disabled={sendInvitation.isPending}
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
              disabled={sendInvitation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={sendInvitation.isPending}>
              {sendInvitation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Convite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
