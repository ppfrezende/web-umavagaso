'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { MoreHorizontal, Mail, Trash2, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '@/src/services/api-client'
import type { Invitation, InvitationStatus } from '@/src/types/invitation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface InvitationsTableProps {
  invitations: Invitation[]
  tenantId: string
  onUpdate: () => void
}

const statusMap: Record<
  InvitationStatus,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' }
> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  ACCEPTED: { label: 'Aceito', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'destructive' },
  EXPIRED: { label: 'Expirado', variant: 'destructive' },
}

export function InvitationsTable({
  invitations,
  tenantId,
  onUpdate,
}: InvitationsTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  )

  const isLoading = (invitationId: string) => loadingActions[invitationId]

  const handleResend = async (invitationId: string, email: string) => {
    setLoadingActions((prev) => ({ ...prev, [invitationId]: true }))

    try {
      await api.post(`/invitations/${invitationId}/resend`)
      toast.success('Convite reenviado!', {
        description: `Um novo email foi enviado para ${email}`,
      })
      onUpdate()
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao reenviar convite'
        toast.error('Erro', {
          description: errorMessage,
        })
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [invitationId]: false }))
    }
  }

  const handleCancel = async (invitationId: string) => {
    setLoadingActions((prev) => ({ ...prev, [invitationId]: true }))

    try {
      await api.delete(`/invitations/${invitationId}`)
      toast.success('Convite cancelado com sucesso')
      onUpdate()
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao cancelar convite'
        toast.error('Erro', {
          description: errorMessage,
        })
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [invitationId]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Nenhum convite enviado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Comece convidando um aluno para sua plataforma
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Enviado</TableHead>
          <TableHead>Expira</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const expired = isExpired(invitation.expiresAt)
          const status = expired ? 'EXPIRED' : invitation.status
          const statusInfo = statusMap[status]

          return (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">{invitation.email}</TableCell>
              <TableCell>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invitation.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invitation.expiresAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isLoading(invitation.id)}
                    >
                      {isLoading(invitation.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {invitation.status === 'PENDING' && !expired && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleResend(invitation.id, invitation.email)
                        }
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Reenviar convite
                      </DropdownMenuItem>
                    )}
                    {invitation.status === 'PENDING' && (
                      <DropdownMenuItem
                        onClick={() => handleCancel(invitation.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancelar convite
                      </DropdownMenuItem>
                    )}
                    {(invitation.status === 'ACCEPTED' ||
                      invitation.status === 'CANCELLED' ||
                      expired) && (
                      <DropdownMenuItem disabled>
                        Nenhuma ação disponível
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
